import * as THREE from "three";

type NodeType = {
    x: number;
    y: number;
    z: number;
};

type Scene3DNodesProps = {
    nodes: NodeType[];
    scene: THREE.Scene;
};

const Scene3DNodes = ({ nodes, scene }: Scene3DNodesProps) => {
    nodes.forEach(({ x, y, z }) => {
        const geometry = new THREE.SphereGeometry(0.2, 10, 10);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.set(x, y, z);

        // ✅ Attach custom userData to the sphere
        sphere.userData = { type: "node", x, y, z };

        scene.add(sphere);
    });

    return null;
};

export default Scene3DNodes;
