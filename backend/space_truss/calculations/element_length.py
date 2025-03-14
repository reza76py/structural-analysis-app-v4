import math

def calculate_element_length(start_node:tuple, end_node:tuple) -> float:
    x1, y1, z1 = start_node
    x2, y2, z2 = end_node

    length = math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)
    return round (length, 2)