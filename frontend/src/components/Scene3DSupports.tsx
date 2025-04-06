import * as THREE from "three";

type SupportType = {
    id: number;
    node_coordinate: string;
    x_restrained: boolean;
    y_restrained: boolean;
    z_restrained: boolean;
};

type Scene3DSupportsProps = {
    supports: SupportType[];
    scene: THREE.Scene;
};

const Scene3DSupports = ({ supports, scene }: Scene3DSupportsProps) => {
    supports.forEach((support) => {
        try {
            const coords = support.node_coordinate.split(",").map(Number);
            if (coords.length !== 3 || coords.some(isNaN)) return;

            const origin = new THREE.Vector3(...coords);
            const length = 1;

            // X Direction Arrow
            const dirX = new THREE.Vector3(1, 0, 0);
            const colorX = support.x_restrained ? 0xff0000 : 0x888888;
            const arrowX = new THREE.ArrowHelper(dirX, origin, length, colorX);
            scene.add(arrowX);

            // Y Direction Arrow
            const dirY = new THREE.Vector3(0, 1, 0);
            const colorY = support.y_restrained ? 0x00ff00 : 0x888888;
            const arrowY = new THREE.ArrowHelper(dirY, origin, length, colorY);
            scene.add(arrowY);

            // Z Direction Arrow
            const dirZ = new THREE.Vector3(0, 0, 1);
            const colorZ = support.z_restrained ? 0x0000ff : 0x888888;
            const arrowZ = new THREE.ArrowHelper(dirZ, origin, length, colorZ);
            scene.add(arrowZ);
        } catch (error) {
            console.error("Error drawing support arrows:", support, error);
        }
    });

    return null;
};

export default Scene3DSupports;
