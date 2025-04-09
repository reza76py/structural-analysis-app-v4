import fitz  # PyMuPDF
import re

def extract_coordinates_from_pdf(pdf_file) -> list[dict]:
    """
    Extracts node coordinates from a PDF file.
    Supports formats: "x,y,z", "x y z", "(x, y, z)", etc.
    """
    coordinates = []

    try:
        pdf_file.seek(0)
    except Exception as e:
        raise ValueError(f"❌ Could not reset file pointer: {str(e)}")

    try:
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    except Exception as e:
        raise ValueError(f"❌ PyMuPDF failed to open the file: {str(e)}")

    # Accepts various formats: commas, spaces, optional parentheses
    pattern = r"[({]?\s*(-?\d+(?:\.\d+)?)\s*[,|\s]\s*(-?\d+(?:\.\d+)?)\s*[,|\s]\s*(-?\d+(?:\.\d+)?)[)}]?"

    for i, page in enumerate(doc):
        text = page.get_text()
        print(f"📄 Page {i + 1} content:\n{text}")
        matches = re.findall(pattern, text)

        for match in matches:
            try:
                x, y, z = map(float, match)
                coordinates.append({"x": x, "y": y, "z": z})
                print(f"✅ Found coordinate: ({x}, {y}, {z})")
            except Exception as ve:
                print(f"⚠️ Skipped invalid coordinate match: {match} -> {ve}")
                continue

    print(f"✅ Total valid coordinates extracted: {len(coordinates)}")
    return coordinates
