"""
Unit tests for the Vision Worker.
These tests verify actual business logic, not just mock returns.
"""
import pytest
import numpy as np
from unittest.mock import Mock, patch, MagicMock
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))


class TestModelVerification:
    """Tests for model startup verification."""

    @patch('src.engine.FaceAnalysis')
    def test_model_verification_passes_on_success(self, mock_fa):
        """Model verification should pass when inference works."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        mock_app.get.return_value = []  # Empty list = no faces, but no error
        
        # Should not raise
        engine = VisionEngine()
        assert engine is not None

    @patch('src.engine.FaceAnalysis')
    def test_model_verification_fails_on_error(self, mock_fa):
        """Model verification should fail when inference throws."""
        mock_app = Mock()
        mock_fa.return_value = mock_app
        mock_app.get.side_effect = RuntimeError("Model not loaded")
        
        from src.engine import VisionEngine
        
        with pytest.raises(RuntimeError, match="verification failed"):
            VisionEngine()


class TestEmbeddingNormalization:
    """Tests that verify embedding normalization is correct."""

    @patch('src.engine.FaceAnalysis')
    @patch('src.engine.cv2')
    def test_embedding_is_l2_normalized(self, mock_cv2, mock_fa):
        """Embedding output should have L2 norm of 1.0."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        
        # Raw embedding with known L2 norm
        raw_embedding = np.array([3.0, 4.0])  # L2 norm = 5
        mock_face = Mock()
        mock_face.embedding = raw_embedding
        mock_face.bbox = np.array([10, 10, 100, 100])
        mock_face.det_score = 0.99
        mock_app.get.return_value = [mock_face]
        
        mock_cv2.imread.return_value = np.zeros((100, 100, 3), dtype=np.uint8)
        
        engine = VisionEngine()
        results = engine.process_image('/fake/path.jpg')
        
        # Verify normalization: [3/5, 4/5] = [0.6, 0.8]
        embedding = np.array(results[0]['embedding'])
        np.testing.assert_array_almost_equal(embedding, [0.6, 0.8])
        
        # Verify L2 norm is 1.0
        l2_norm = np.linalg.norm(embedding)
        assert abs(l2_norm - 1.0) < 0.0001, f"L2 norm should be 1.0, got {l2_norm}"

    @patch('src.engine.FaceAnalysis')
    @patch('src.engine.cv2')
    def test_512_dim_embedding_normalized(self, mock_cv2, mock_fa):
        """Real 512-dim embedding should be normalized correctly."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        
        # Random 512-dim embedding
        np.random.seed(42)
        raw_embedding = np.random.randn(512)
        original_norm = np.linalg.norm(raw_embedding)
        
        mock_face = Mock()
        mock_face.embedding = raw_embedding
        mock_face.bbox = np.array([0, 0, 100, 100])
        mock_face.det_score = 0.95
        mock_app.get.return_value = [mock_face]
        
        mock_cv2.imread.return_value = np.zeros((100, 100, 3), dtype=np.uint8)
        
        engine = VisionEngine()
        results = engine.process_image('/fake/path.jpg')
        
        embedding = np.array(results[0]['embedding'])
        assert len(embedding) == 512
        
        # L2 norm should be 1.0
        l2_norm = np.linalg.norm(embedding)
        assert abs(l2_norm - 1.0) < 0.0001


class TestImageDownscaling:
    """Tests that verify image downscaling logic."""

    @patch('src.engine.FaceAnalysis')
    @patch('src.engine.cv2')
    def test_large_image_is_downscaled(self, mock_cv2, mock_fa):
        """Images > 1080px should be downscaled."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        mock_app.get.return_value = []
        
        # 2000x1500 image (larger than MAX_DIM=1080)
        large_img = np.zeros((1500, 2000, 3), dtype=np.uint8)
        mock_cv2.imread.return_value = large_img
        mock_cv2.resize.return_value = np.zeros((810, 1080, 3), dtype=np.uint8)
        
        engine = VisionEngine()
        engine.process_image('/fake/large.jpg')
        
        # Verify resize was called
        mock_cv2.resize.assert_called_once()
        call_args = mock_cv2.resize.call_args
        
        # Scale factor should be 1080/2000 = 0.54
        assert call_args[1]['fx'] == pytest.approx(0.54, rel=0.01)
        assert call_args[1]['fy'] == pytest.approx(0.54, rel=0.01)

    @patch('src.engine.FaceAnalysis')
    @patch('src.engine.cv2')
    def test_small_image_not_downscaled(self, mock_cv2, mock_fa):
        """Images <= 1080px should NOT be downscaled."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        mock_app.get.return_value = []
        
        # 800x600 image (smaller than MAX_DIM)
        small_img = np.zeros((600, 800, 3), dtype=np.uint8)
        mock_cv2.imread.return_value = small_img
        
        engine = VisionEngine()
        engine.process_image('/fake/small.jpg')
        
        # Resize should NOT be called
        mock_cv2.resize.assert_not_called()

    @patch('src.engine.FaceAnalysis')
    @patch('src.engine.cv2')
    def test_bbox_scaled_back_to_original(self, mock_cv2, mock_fa):
        """Bounding boxes should be scaled back to original image dimensions."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        
        # Face at [50, 50, 100, 100] in downscaled image
        mock_face = Mock()
        mock_face.embedding = np.array([1.0] * 512)
        mock_face.bbox = np.array([50.0, 50.0, 100.0, 100.0])
        mock_face.det_score = 0.95
        mock_app.get.return_value = [mock_face]
        
        # Original: 2160x2160, will be downscaled to 1080x1080 (scale = 2)
        large_img = np.zeros((2160, 2160, 3), dtype=np.uint8)
        mock_cv2.imread.return_value = large_img
        mock_cv2.resize.return_value = np.zeros((1080, 1080, 3), dtype=np.uint8)
        
        engine = VisionEngine()
        results = engine.process_image('/fake/path.jpg')
        
        # Bbox should be scaled back by factor of 2
        bbox = results[0]['bbox']
        assert bbox == pytest.approx([100.0, 100.0, 200.0, 200.0], rel=0.01)


class TestInputValidation:
    """Tests for input validation and error handling."""

    @patch('src.engine.FaceAnalysis')
    @patch('src.engine.cv2')
    def test_invalid_image_raises_error(self, mock_cv2, mock_fa):
        """Should raise ValueError for unreadable images."""
        from src.engine import VisionEngine
        
        mock_app = Mock()
        mock_fa.return_value = mock_app
        mock_cv2.imread.return_value = None  # Failed to read
        
        engine = VisionEngine()
        
        with pytest.raises(ValueError, match="Could not read image"):
            engine.process_image('/fake/corrupt.jpg')

    def test_s3_key_path_traversal_rejected(self):
        """S3 keys with path traversal should be rejected."""
        from src.main import DetectRequest
        
        malicious_keys = [
            '../../../etc/passwd',
            '..\\..\\windows\\system32',
            'uploads/../../../secret.txt',
        ]
        
        for key in malicious_keys:
            req = DetectRequest(s3_key=key)
            with pytest.raises(ValueError, match="Invalid S3 key"):
                _ = req.validated_key

    def test_s3_key_absolute_path_rejected(self):
        """Absolute S3 keys should be rejected."""
        from src.main import DetectRequest
        
        req = DetectRequest(s3_key='/etc/passwd')
        with pytest.raises(ValueError, match="Invalid S3 key"):
            _ = req.validated_key

    def test_s3_key_valid_formats_accepted(self):
        """Valid S3 key formats should be accepted."""
        from src.main import DetectRequest
        
        valid_keys = [
            'image.jpg',
            'uploads/2024/01/photo.jpg',
            'user_123/face_crop.png',
            'a1b2c3d4e5f6.jpg',
            'simple',
            'path/to/file.jpeg',
        ]
        
        for key in valid_keys:
            req = DetectRequest(s3_key=key)
            assert req.validated_key == key

    def test_s3_key_rejects_double_extension(self):
        """S3 keys with suspicious double extensions should be rejected."""
        from src.main import DetectRequest
        
        suspicious_keys = [
            'file.php.jpg',
            'script.js.png',
        ]
        
        for key in suspicious_keys:
            req = DetectRequest(s3_key=key)
            with pytest.raises(ValueError, match="Invalid S3 key"):
                _ = req.validated_key

    def test_s3_key_max_length_enforced(self):
        """S3 keys over 500 characters should be rejected by Pydantic."""
        from src.main import DetectRequest
        from pydantic import ValidationError
        
        long_key = 'a' * 501 + '.jpg'
        with pytest.raises(ValidationError):
            DetectRequest(s3_key=long_key)

    def test_s3_key_empty_rejected(self):
        """Empty S3 keys should be rejected."""
        from src.main import DetectRequest
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            DetectRequest(s3_key='')


class TestAPIAuthentication:
    """Tests for API key authentication."""

    @patch.dict(os.environ, {
        'S3_ACCESS_KEY': 'test',
        'S3_SECRET_KEY': 'test',
        'VISION_API_KEY': 'correct-key-123',
    })
    def test_missing_api_key_rejected(self):
        """Requests without API key should be rejected."""
        with patch('src.main.engine'), patch('src.main.s3_client'):
            import importlib
            import src.main
            importlib.reload(src.main)
            
            from fastapi.testclient import TestClient
            client = TestClient(src.main.app)
            
            response = client.post('/detect', json={'s3_key': 'test.jpg'})
            assert response.status_code == 401

    @patch.dict(os.environ, {
        'S3_ACCESS_KEY': 'test',
        'S3_SECRET_KEY': 'test',
        'VISION_API_KEY': 'correct-key-123',
    })
    def test_wrong_api_key_rejected(self):
        """Requests with wrong API key should be rejected."""
        with patch('src.main.engine'), patch('src.main.s3_client'):
            import importlib
            import src.main
            importlib.reload(src.main)
            
            from fastapi.testclient import TestClient
            client = TestClient(src.main.app)
            
            response = client.post(
                '/detect',
                json={'s3_key': 'test.jpg'},
                headers={'X-API-Key': 'wrong-key'}
            )
            assert response.status_code == 401

    @patch.dict(os.environ, {
        'S3_ACCESS_KEY': 'test',
        'S3_SECRET_KEY': 'test',
        'VISION_API_KEY': 'correct-key-123',
    })
    def test_correct_api_key_accepted(self):
        """Requests with correct API key should be accepted."""
        with patch('src.main.engine') as mock_engine, \
             patch('src.main.s3_client') as mock_s3:
            
            mock_engine.process_image.return_value = []
            mock_s3.download_fileobj = lambda b, k, f: f.write(b'data')
            
            import importlib
            import src.main
            importlib.reload(src.main)
            
            from fastapi.testclient import TestClient
            client = TestClient(src.main.app)
            
            response = client.post(
                '/detect',
                json={'s3_key': 'test.jpg'},
                headers={'X-API-Key': 'correct-key-123'}
            )
            assert response.status_code == 200


class TestRateLimiting:
    """Tests for rate limiting functionality."""

    @patch.dict(os.environ, {
        'S3_ACCESS_KEY': 'test',
        'S3_SECRET_KEY': 'test',
    })
    def test_rate_limiter_is_configured(self):
        """Verify rate limiter is attached to the app."""
        with patch('src.main.engine'), patch('src.main.s3_client'):
            import importlib
            import src.main
            importlib.reload(src.main)
            
            assert hasattr(src.main.app.state, 'limiter')
            assert src.main.app.state.limiter is not None


class TestDetSizeConfiguration:
    """Tests for DET_SIZE environment variable handling."""

    @patch('src.engine.FaceAnalysis')
    def test_default_det_size(self, mock_fa):
        """Default DET_SIZE should be 1280."""
        with patch.dict(os.environ, {}, clear=False):
            # Remove DET_SIZE if present
            os.environ.pop('DET_SIZE', None)
            
            from src.engine import VisionEngine
            import importlib
            import src.engine
            importlib.reload(src.engine)
            
            mock_app = Mock()
            mock_fa.return_value = mock_app
            
            engine = src.engine.VisionEngine()
            
            mock_app.prepare.assert_called_once()
            call_args = mock_app.prepare.call_args
            assert call_args[1]['det_size'] == (1280, 1280)

    @patch('src.engine.FaceAnalysis')
    def test_custom_det_size(self, mock_fa):
        """Custom DET_SIZE should be respected."""
        with patch.dict(os.environ, {'DET_SIZE': '640'}):
            import importlib
            import src.engine
            importlib.reload(src.engine)
            
            mock_app = Mock()
            mock_fa.return_value = mock_app
            
            engine = src.engine.VisionEngine()
            
            mock_app.prepare.assert_called_once()
            call_args = mock_app.prepare.call_args
            assert call_args[1]['det_size'] == (640, 640)

    @patch('src.engine.FaceAnalysis')
    def test_invalid_det_size_uses_default(self, mock_fa):
        """Invalid DET_SIZE should fall back to default 1280."""
        with patch.dict(os.environ, {'DET_SIZE': 'invalid'}):
            import importlib
            import src.engine
            importlib.reload(src.engine)
            
            mock_app = Mock()
            mock_fa.return_value = mock_app
            
            engine = src.engine.VisionEngine()
            
            mock_app.prepare.assert_called_once()
            call_args = mock_app.prepare.call_args
            assert call_args[1]['det_size'] == (1280, 1280)


class TestMaxDimConfiguration:
    """Tests for MAX_DIM environment variable handling."""

    def test_default_max_dim(self):
        """Default MAX_DIM should be 1080."""
        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop('MAX_DIM', None)
            
            import importlib
            import src.engine
            importlib.reload(src.engine)
            
            assert src.engine.get_max_dim() == 1080

    def test_custom_max_dim(self):
        """Custom MAX_DIM should be respected."""
        with patch.dict(os.environ, {'MAX_DIM': '720'}):
            import importlib
            import src.engine
            importlib.reload(src.engine)
            
            assert src.engine.get_max_dim() == 720

    def test_invalid_max_dim_uses_default(self):
        """Invalid MAX_DIM should fall back to default 1080."""
        with patch.dict(os.environ, {'MAX_DIM': 'not_a_number'}):
            import importlib
            import src.engine
            importlib.reload(src.engine)
            
            assert src.engine.get_max_dim() == 1080
