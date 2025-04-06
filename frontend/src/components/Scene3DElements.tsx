// 📍 File: src/components/Scene3DElements.tsx

import * as THREE from "three";

type ElementType = {
    startNode: string; // e.g., "1.0,2.0,3.0"
    endNode: string;
};

type Scene3DElementsProps = {
    elements: ElementType[];
    scene: THREE.Scene;
};

const Scene3DElements = ({ elements, scene }: Scene3DElementsProps) => {
    elements.forEach(({ startNode, endNode }) => {
        try {
            // Convert "x,y,z" → [x, y, z]
            const startCoords = startNode.split(",").map(Number);
            const endCoords = endNode.split(",").map(Number);

            if (startCoords.length !== 3 || endCoords.length !== 3) {
                console.warn("Invalid element coordinates:", {
                    startNode,
                    endNode,
                });
                return;
            }

            const points = [
                new THREE.Vector3(...startCoords),
                new THREE.Vector3(...endCoords),
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        } catch (error) {
            console.error(
                "Error drawing element:",
                { startNode, endNode },
                error,
            );
        }
    });

    return null;
};

export default Scene3DElements;
