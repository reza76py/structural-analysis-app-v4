def generate_dof_indices(startNode: str, endNode: str) -> list[int]:
    """
    Generates global DOF indices [a, b, c, d, e, f] for an element
    based on the node coordinates.

    Each node has 3 DOFs: x, y, z → global index = node_index * 3 + offset

    Parameters:
    - startNode: string like "0,0,0"
    - endNode: string like "6,0,8"

    Returns:
    - list of 6 integers: [a,b,c,d,e,f]
    """
    def coord_to_index(coord: str) -> int:
        # Map each unique node coordinate to an index
        if coord not in coord_to_index.node_map:
            coord_to_index.node_map[coord] = len(coord_to_index.node_map)
        return coord_to_index.node_map[coord]
    
    # Static map to preserve node order across calls
    if not hasattr(coord_to_index, "node_map"):
        coord_to_index.node_map = {}

    start_index = coord_to_index(startNode)
    end_index = coord_to_index(endNode)

    # Global DOFs for 3D truss: 3 per node
    start_dofs = [start_index * 3 + i for i in range(3)]
    end_dofs = [end_index * 3 + i for i in range(3)]

    return start_dofs + end_dofs
