# import numpy as np
# from ..models import Load

# def generate_load_vector(total_dof: int, ordered_node_coords: list[str]) -> np.ndarray:
#     """
#     Generates the global load vector P based on the fixed node order (from DB).

#     Parameters:
#     - total_dof: Total number of degrees of freedom
#     - ordered_node_coords: List of node coordinate strings in order of DB (used in dropdowns, etc.)

#     Returns:
#     - P: Load vector (numpy array)
#     """
#     P = np.zeros((total_dof, 1))

#     # Fetch all loads
#     loads = Load.objects.all()
#     load_map = {load.node_coordinate: (load.Fx, load.Fy, load.Fz) for load in loads}

#     for i, coord in enumerate(ordered_node_coords):
#         if coord in load_map:
#             Fx, Fy, Fz = load_map[coord]
#             P[3 * i + 0][0] = Fx
#             P[3 * i + 1][0] = Fy
#             P[3 * i + 2][0] = Fz

#     return P






import numpy as np
from ..models import Load

def generate_load_vector(total_dof: int, ordered_node_coords: list[str]) -> np.ndarray:
    """
    Builds the global load vector P using consistent float formatting.
    """
    P = np.zeros((total_dof, 1))

    # ✅ Normalize load coordinates to float format like "50.0,0.0,100.0"
    def normalize(coord_str):
        parts = coord_str.split(",")
        return ",".join([str(float(p)) for p in parts])

    # ✅ Build load map with normalized keys
    loads = Load.objects.all()
    load_map = {
        normalize(load.node_coordinate): (load.Fx, load.Fy, load.Fz)
        for load in loads
    }

    for i, coord in enumerate(ordered_node_coords):
        norm_coord = normalize(coord)
        if norm_coord in load_map:
            Fx, Fy, Fz = load_map[norm_coord]
            P[3 * i + 0][0] = Fx
            P[3 * i + 1][0] = Fy
            P[3 * i + 2][0] = Fz

    return P


