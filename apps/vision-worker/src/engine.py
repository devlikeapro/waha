import os
import logging
import cv2
import numpy as np
from insightface.app import FaceAnalysis

logger = logging.getLogger(__name__)

def get_max_dim() -> int:
    """Get MAX_DIM from environment, default 1080."""
    try:
        return int(os.getenv("MAX_DIM", "1080"))
    except ValueError:
        logger.warning("Invalid MAX_DIM value, using default 1080")
        return 1080

class VisionEngine:
    def __init__(self):
        det_size_str = os.getenv("DET_SIZE", "1280")
        try:
            det_size = int(det_size_str)
        except ValueError:
            logger.warning(f"Invalid DET_SIZE '{det_size_str}', using default 1280")
            det_size = 1280
            
        self.max_dim = get_max_dim()
        self.app = FaceAnalysis(name='buffalo_s', providers=['CPUExecutionProvider'])
        self.app.prepare(ctx_id=0, det_size=(det_size, det_size))
        logger.info(f"InsightFace Model Loaded (buffalo_s) with det_size=({det_size}, {det_size}), max_dim={self.max_dim}")
        
        # Verify model loaded correctly
        if not self._verify_model():
            raise RuntimeError("InsightFace model verification failed")
        logger.info("InsightFace model verification passed")

    def _verify_model(self) -> bool:
        """Verify model works by running inference on a test image."""
        try:
            test_img = np.zeros((112, 112, 3), dtype=np.uint8)
            self.app.get(test_img)  # Should return empty list, not error
            return True
        except Exception as e:
            logger.error(f"Model verification failed: {e}")
            return False

    def process_image(self, image_path: str):
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image from {image_path}")

        # Downscale large images to manage RAM
        h, w = img.shape[:2]
        if max(h, w) > self.max_dim:
            scale = self.max_dim / max(h, w)
            img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
            logger.info(f"Downscaled image from {w}x{h} to {img.shape[1]}x{img.shape[0]}")

        faces = self.app.get(img)
        
        results = []
        for face in faces:
            # L2 normalize embedding for cosine similarity
            embedding = face.embedding / np.linalg.norm(face.embedding)
            
            # Scale bbox back to original dimensions if downscaled
            bbox = face.bbox
            if max(h, w) > self.max_dim:
                scale_back = max(h, w) / self.max_dim
                bbox = bbox * scale_back
            
            results.append({
                "bbox": bbox.tolist(),
                "det_score": float(face.det_score),
                "embedding": embedding.tolist(),
            })
            
        return results
