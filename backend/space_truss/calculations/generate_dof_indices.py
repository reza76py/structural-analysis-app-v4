from ..models import Node

def generate_dof_indices(start_node: str, end_node: str) -> list[int]:
    """
    Given start and end node strings ("x,y,z"),
    return a list of global DOF indices [a, b, c, d, e, f] for the element.
    Uses consistent node ordering based on the database.
    """
    def normalize(coord_str: str) -> str:
        parts = coord_str.split(",")
        return ",".join([str(float(p)) for p in parts])

    all_nodes = Node.objects.all()
    ordered = [normalize(f"{n.x},{n.y},{n.z}") for n in all_nodes]
    node_index_map = {coord: i for i, coord in enumerate(ordered)}

    i_start = node_index_map[normalize(start_node)]
    i_end = node_index_map[normalize(end_node)]

    dof = [
        3 * i_start, 3 * i_start + 1, 3 * i_start + 2,
        3 * i_end,   3 * i_end + 1,   3 * i_end + 2,
    ]
    return dof
