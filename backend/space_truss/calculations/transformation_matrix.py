def build_transformation_matrix(cos_x: float, cos_y: float, cos_z: float):
    l, m, n = cos_x, cos_y, cos_z

    # Build 6x6 transformation matrix for 3D truss
    T = [
        [l, m, n, 0, 0, 0],
        [0, 0, 0, l, m, n]
    ]

    return T
