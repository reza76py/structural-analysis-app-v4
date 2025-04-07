import fitz  # PyMuPDF
import re

def extract_coordinates_from_pdf(pdf_file) -> list[dict]:
    """
    Extracts node coordinates from a PDF file.
    Expected format in PDF text: (x, y, z) or x,y,z or similar.
    Returns a list of dicts with keys: x, y, z
    """
    coordinates = []
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    
    pattern = r"(-?\d+\.?\d*)[,|\s]+(-?\d+\.?\d*)[,|\s]+(-?\d+\.?\d*)"
    
    for page in doc:
        text = page.get_text()
        matches = re.findall(pattern, text)
        
        for match in matches:
            try:
                x, y, z = map(float, match)
                coordinates.append({"x": x, "y": y, "z": z})
            except ValueError:
                continue  # Skip malformed lines

    return coordinates
