# import pandas as pd

# def extract_coordinates_from_excel(excel_file) -> list[dict]:
#     """
#     Extracts node coordinates from an Excel file.
#     Expected columns: x, y, z (case-insensitive).
#     Returns a list of dicts with keys: x, y, z.
#     """
#     coordinates = []

#     try:
#         excel_file.seek(0)  # Reset for safety
#     except Exception as e:
#         raise ValueError(f"❌ Could not reset file pointer: {str(e)}")

#     try:
#         df = pd.read_excel(excel_file)
#     except Exception as e:
#         raise ValueError(f"❌ Failed to read Excel file: {str(e)}")

#     print("📊 Excel columns found:", list(df.columns))

#     required_cols = ['x', 'y', 'z']
#     lowercased_cols = {col.lower(): col for col in df.columns}

#     if not all(col in lowercased_cols for col in required_cols):
#         raise ValueError(f"❌ Excel file must contain columns: {required_cols}")

#     try:
#         for i, row in df.iterrows():
#             x = float(row[lowercased_cols['x']])
#             y = float(row[lowercased_cols['y']])
#             z = float(row[lowercased_cols['z']])
#             coordinates.append({"x": x, "y": y, "z": z})
#             print(f"✅ Row {i + 1} coordinate: ({x}, {y}, {z})")
#     except Exception as e:
#         raise ValueError(f"⚠️ Failed to parse a row: {e}")

#     print(f"✅ Total coordinates extracted: {len(coordinates)}")
#     return coordinates









import pandas as pd

def extract_coordinates_from_excel(excel_file) -> list[dict]:
    """
    Extracts x, y, z coordinates from a flexible Excel layout.
    Automatically finds the correct columns and skips unrelated data.
    """
    coordinates = []

    try:
        excel_file.seek(0)
    except Exception as e:
        raise ValueError(f"❌ Could not reset file pointer: {str(e)}")

    try:
        df = pd.read_excel(excel_file, header=None)
    except Exception as e:
        raise ValueError(f"❌ Failed to read Excel file: {str(e)}")

    print("📊 Raw Excel Data Preview:")
    print(df.head(10))

    # 🔍 Find header row with x, y, z
    header_row_index = None
    for i, row in df.iterrows():
        lower_row = row.astype(str).str.lower()
        if {'x', 'y', 'z'}.issubset(set(lower_row)):
            header_row_index = i
            break

    if header_row_index is None:
        raise ValueError("❌ Could not find a row with x, y, z column headers.")

    print(f"✅ Header row found at index {header_row_index}")

    # Re-read Excel file with correct header
    excel_file.seek(0)
    df = pd.read_excel(excel_file, header=header_row_index)

    # 🧹 Drop completely empty columns and rows
    df.dropna(how='all', axis=0, inplace=True)
    df.dropna(how='all', axis=1, inplace=True)

    print("🧼 Cleaned Excel Data:")
    print(df.head(10))

    # 🌐 Normalize column names to lowercase
    df.columns = [str(col).strip().lower() for col in df.columns]

    if not all(col in df.columns for col in ['x', 'y', 'z']):
        raise ValueError("❌ Required columns x, y, z not found after cleaning.")

    for i, row in df.iterrows():
        try:
            x = float(row['x'])
            y = float(row['y'])
            z = float(row['z'])
            coordinates.append({'x': x, 'y': y, 'z': z})
            print(f"✅ Row {i} → ({x}, {y}, {z})")
        except Exception as e:
            print(f"⚠️ Skipping row {i}: {e}")

    print(f"✅ Total valid coordinates extracted: {len(coordinates)}")
    return coordinates
