import pytesseract
from PIL import Image


def extract_text(image_path: str) -> str:
    try:
        image = Image.open(image_path)
        return pytesseract.image_to_string(image)
    except Exception as e:
        return f"OCR failed: {str(e)}"
