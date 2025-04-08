import fitz  # PyMuPDF
import re


def extract_coordinates_from_pdf(pdf_file) -> list[dict]:
    """
    Extracts node coordinates from a PDF file.
    Expected format in PDF text: (x, y, z) or x,y,z or similar.
    Returns a list of dicts with keys: x, y, z
    """
    coordinates = []

    # ✅ Step 1: Reset file pointer before reading
    try:
        pdf_file.seek(0)
    except Exception as e:
        raise ValueError(f"❌ Could not reset file pointer: {str(e)}")

    # ✅ Step 2: Attempt to open the file using PyMuPDF
    try:
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    except Exception as e:
        raise ValueError(f"❌ PyMuPDF failed to open the file: {str(e)}")

    # ✅ Step 3: Regex pattern to match coordinates
    pattern = r"(-?\d+\.?\d*)[,|\s]+(-?\d+\.?\d*)[,|\s]+(-?\d+\.?\d*)"

    # ✅ Step 4: Loop through PDF pages and extract coordinates
    for i, page in enumerate(doc):
        text = page.get_text()
        print(f"📄 Page {i + 1} content:\n{text}")  # Debug output
        matches = re.findall(pattern, text)

        for match in matches:
            try:
                x, y, z = map(float, match)
                coordinates.append({"x": x, "y": y, "z": z})
                print(f"✅ Found coordinate: ({x}, {y}, {z})")  # Debug output
            except ValueError as ve:
                print(f"⚠️ Skipped invalid coordinate match: {match} -> {ve}")  # Debug output
                continue  # Skip malformed lines

    print(f"✅ Total valid coordinates extracted: {len(coordinates)}")
    return coordinates
