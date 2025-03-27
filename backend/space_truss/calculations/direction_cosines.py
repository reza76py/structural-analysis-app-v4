import math

def calculate_direction_cosines(start_coord: str, end_coord: str):
    try:
        x1, y1, z1 = map(float, start_coord.split(","))
        x2, y2, z2 = map(float, end_coord.split(","))
        
        dx = x2 - x1
        dy = y2 - y1
        dz = z2 - z1

        length = math.sqrt(dx**2 + dy**2 + dz**2)
        if length == 0:
            raise ValueError("Start and end nodes are the same")

        cos_x = dx / length
        cos_y = dy / length
        cos_z = dz / length

        return {
            "cos_x": round(cos_x, 5),
            "cos_y": round(cos_y, 5),
            "cos_z": round(cos_z, 5),
            "length": round(length, 5)
        }
    except Exception as e:
        return {"error": str(e)}
