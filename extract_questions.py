import os
import re
import pytesseract
from PIL import Image

def extract_text_from_images():
    data = {}

    # Process each page sequentially. Note: Tesseract Hindi OCR on poor resolution images can be spotty,
    # but we'll try to extract what we can.
    image_dir = "pdf_images"
    if not os.path.exists(image_dir):
        print("Images not found")
        return

    for filename in sorted(os.listdir(image_dir)):
        if filename.endswith(".jpg"):
            filepath = os.path.join(image_dir, filename)
            text = pytesseract.image_to_string(Image.open(filepath), lang='hin+eng')
            print(f"--- Extracted from {filename} ---")

            # Simple heuristic: Look for lines starting with a number followed by a dot
            lines = text.split('\n')
            for line in lines:
                line = line.strip()
                if re.match(r'^\d{1,2}\.', line):
                    print("QUESTION:", line)
                elif re.match(r'^\d+-', line) or re.match(r'^[○O]\s*\d+-', line):
                    print("OPTION:", line)

extract_text_from_images()
