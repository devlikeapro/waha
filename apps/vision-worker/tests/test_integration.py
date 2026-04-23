"""
Integration tests for the Vision Worker service.
Tests the full pipeline from HTTP request to face detection response.

Run with: pytest tests/test_integration.py -v
"""
import pytest
import os
import tempfile
import numpy as np
from unittest.mock import patch, Mock, MagicMock
from fastapi.testclient import TestClient


@pytest.fixture
def mock_env():
    """Set up required environment variables."""
    with patch.dict(os.environ, {
        'S3_ACCESS_KEY': 'test-access-key',
        'S3_SECRET_KEY': 'test-secret-key',
        'S3_BUCKET': 'test-bucket',
        'S3_ENDPOINT': 'http://localhost:9000',
        'VISION_API_KEY': 'test-api-key',
    }):
        yield


@pytest.fixture
def mock_s3():
    """Mock S3 client."""
    with patch('src.main.s3_client') as mock:
        mock.head_bucket.return_value = {}
        yield mock


@pytest.fixture
def mock_engine():
    """Mock VisionEngine."""
    with patch('src.main.engine') as mock:
        yield mock


@pytest.fixture
def client(mock_env, mock_s3, mock_engine):
    """Create test client with mocked dependencies."""
    # Need to reimport after patching
    import importlib
    import src.main
    importlib.reload(src.main)
    
    return TestClient(src.main.app)


class TestVisionWorkerIntegration:
    """Integration tests for the complete vision worker flow."""

    def test_full_detection_pipeline(self, mock_env, mock_s3, mock_engine):
        """Test complete flow: upload -> detect -> return embeddings."""
        # Setup mock face detection result
        mock_engine.process_image.return_value = [
            {
                'bbox': [100.0, 100.0, 200.0, 200.0],
                'det_score': 0.98,
                'embedding': [0.1] * 512,
            }
        ]
        
        # Mock S3 download
        def mock_download(bucket, key, fileobj):
            # Write fake image data
            fileobj.write(b'fake-image-data')
        
        mock_s3.download_fileobj = mock_download
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.post(
            '/detect',
            json={'s3_key': 'test-image.jpg'},
            headers={'X-API-Key': 'test-api-key'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'faces' in data
        assert len(data['faces']) == 1
        assert len(data['faces'][0]['embedding']) == 512

    def test_multiple_faces_detection(self, mock_env, mock_s3, mock_engine):
        """Test detection of multiple faces in single image."""
        mock_engine.process_image.return_value = [
            {'bbox': [10, 10, 100, 100], 'det_score': 0.95, 'embedding': [0.1] * 512},
            {'bbox': [200, 10, 300, 100], 'det_score': 0.92, 'embedding': [0.2] * 512},
            {'bbox': [400, 10, 500, 100], 'det_score': 0.88, 'embedding': [0.3] * 512},
        ]
        
        mock_s3.download_fileobj = lambda b, k, f: f.write(b'data')
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.post(
            '/detect',
            json={'s3_key': 'group-photo.jpg'},
            headers={'X-API-Key': 'test-api-key'}
        )
        
        assert response.status_code == 200
        assert len(response.json()['faces']) == 3

    def test_no_faces_detected(self, mock_env, mock_s3, mock_engine):
        """Test response when no faces are found."""
        mock_engine.process_image.return_value = []
        mock_s3.download_fileobj = lambda b, k, f: f.write(b'data')
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.post(
            '/detect',
            json={'s3_key': 'landscape.jpg'},
            headers={'X-API-Key': 'test-api-key'}
        )
        
        assert response.status_code == 200
        assert response.json()['faces'] == []

    def test_s3_download_failure(self, mock_env, mock_s3, mock_engine):
        """Test error handling when S3 download fails."""
        mock_s3.download_fileobj = Mock(side_effect=Exception('S3 connection failed'))
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.post(
            '/detect',
            json={'s3_key': 'missing.jpg'},
            headers={'X-API-Key': 'test-api-key'}
        )
        
        assert response.status_code == 500
        assert 'S3 connection failed' in response.json()['detail']

    def test_engine_processing_failure(self, mock_env, mock_s3, mock_engine):
        """Test error handling when face detection fails."""
        mock_s3.download_fileobj = lambda b, k, f: f.write(b'data')
        mock_engine.process_image.side_effect = ValueError('Invalid image format')
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.post(
            '/detect',
            json={'s3_key': 'corrupt.jpg'},
            headers={'X-API-Key': 'test-api-key'}
        )
        
        assert response.status_code == 500
        assert 'Invalid image format' in response.json()['detail']


class TestSecurityIntegration:
    """Security-focused integration tests."""

    def test_api_key_required(self, mock_env, mock_s3, mock_engine):
        """Test that API key is required for /detect endpoint."""
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        # No API key
        response = client.post('/detect', json={'s3_key': 'test.jpg'})
        assert response.status_code == 401

    def test_invalid_api_key_rejected(self, mock_env, mock_s3, mock_engine):
        """Test that invalid API key is rejected."""
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.post(
            '/detect',
            json={'s3_key': 'test.jpg'},
            headers={'X-API-Key': 'wrong-key'}
        )
        assert response.status_code == 401

    def test_path_traversal_blocked(self, mock_env, mock_s3, mock_engine):
        """Test that path traversal attempts are blocked."""
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        malicious_keys = [
            '../../../etc/passwd',
            '/etc/passwd',
            'uploads/../../../secret',
            'test\x00.jpg',
        ]
        
        for key in malicious_keys:
            response = client.post(
                '/detect',
                json={'s3_key': key},
                headers={'X-API-Key': 'test-api-key'}
            )
            # Should fail validation or return error
            assert response.status_code in [400, 422, 500], f"Key {key} should be rejected"


class TestHealthCheckIntegration:
    """Health check endpoint integration tests."""

    def test_health_check_s3_connected(self, mock_env, mock_s3, mock_engine):
        """Test health check when S3 is connected."""
        mock_s3.head_bucket.return_value = {}
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.get('/health')
        
        assert response.status_code == 200
        assert response.json()['status'] == 'ok'
        assert response.json()['model'] == 'buffalo_s'

    def test_health_check_s3_disconnected(self, mock_env, mock_s3, mock_engine):
        """Test health check when S3 is disconnected."""
        mock_s3.head_bucket.side_effect = Exception('Connection refused')
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        response = client.get('/health')
        
        assert response.status_code == 200
        assert response.json()['status'] == 'degraded'


class TestRateLimitingIntegration:
    """Rate limiting integration tests."""

    def test_rate_limiter_attached_to_app(self, mock_env, mock_s3, mock_engine):
        """Verify rate limiter is properly configured."""
        import importlib
        import src.main
        importlib.reload(src.main)
        
        assert hasattr(src.main.app.state, 'limiter')
        assert src.main.app.state.limiter is not None

    def test_health_endpoint_not_rate_limited(self, mock_env, mock_s3, mock_engine):
        """Health endpoint should not be rate limited."""
        mock_s3.head_bucket.return_value = {}
        
        import importlib
        import src.main
        importlib.reload(src.main)
        client = TestClient(src.main.app)
        
        # Make many requests - should all succeed
        for _ in range(100):
            response = client.get('/health')
            assert response.status_code == 200
