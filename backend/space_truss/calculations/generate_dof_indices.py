def generate_dof_indices(start_node: str, end_node: str) -> list[int]:
    """
    Given start and end node coordinates as strings ("x,y,z"),
    return a list of 6 DOF indices [a, b, c, d, e, f] corresponding to:
    - start node DOFs: [a, b, c]
    - end node DOFs:   [d, e, f]
    """
    def get_node_index(node_str: str) -> int:
        """Maps node coordinate string to a unique index."""
        if node_str not in generate_dof_indices.node_map:
            generate_dof_indices.node_map[node_str] = len(generate_dof_indices.node_map)
        return generate_dof_indices.node_map[node_str]

    start_idx = get_node_index(start_node)
    end_idx = get_node_index(end_node)

    # Each node has 3 DOFs: [x, y, z]
    dof = [
        3 * start_idx, 3 * start_idx + 1, 3 * start_idx + 2,
        3 * end_idx,   3 * end_idx + 1,   3 * end_idx + 2,
    ]
    return dof


# Static mapping from node string to index
generate_dof_indices.node_map = {}
