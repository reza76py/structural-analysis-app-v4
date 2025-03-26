import * as THREE from 'three';

type LoadType = {
  node_coordinate: string;
  Fx: number;
  Fy: number;
  Fz: number;
};

const Scene3DLoads = (
  scene: THREE.Scene,
  loads?: LoadType[]
) => {
  if (!loads) return;

  loads.forEach(({ node_coordinate, Fx, Fy, Fz }) => {
    console.log("Rendering load at:", node_coordinate, "Fx:", Fx, "Fy:", Fy, "Fz:", Fz);
    try {
      const coords = node_coordinate.split(",").map(Number);
      if (coords.length !== 3 || coords.some(isNaN)) return;

      const origin = new THREE.Vector3(...coords);
      const length = 1;

      // Fx Arrow
      if (Fx !== 0) {
        const dirX = new THREE.Vector3(Math.sign(Fx), 0, 0);
        const colorX = 0xff0000;
        const arrowX = new THREE.ArrowHelper(dirX, origin, length, colorX);
        scene.add(arrowX);
      }

      // Fy Arrow
      if (Fy !== 0) {
        const dirY = new THREE.Vector3(0, Math.sign(Fy), 0);
        const colorY = 0x00ff00;
        const arrowY = new THREE.ArrowHelper(dirY, origin, length, colorY);
        scene.add(arrowY);
      }

      // Fz Arrow
      if (Fz !== 0) {
        const dirZ = new THREE.Vector3(0, 0, Math.sign(Fz));
        const colorZ = 0x0000ff;
        const arrowZ = new THREE.ArrowHelper(dirZ, origin, length, colorZ);
        scene.add(arrowZ);
      }
    } catch (err) {
      console.error("Error rendering load:", { node_coordinate, Fx, Fy, Fz }, err);
    }
  });
};

export default Scene3DLoads;
