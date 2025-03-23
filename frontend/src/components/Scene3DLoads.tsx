import * as THREE from 'three';

const Scene3DLoads = (scene: THREE.Scene, loads?: Array<{ node_coordinate: string; Fx: number; Fy: number; Fz: number }>) => {
  if (!loads) return;
  loads.forEach(({ node_coordinate, Fx, Fy, Fz }) => {
    // Similar logic to supports, but use different colors
  });
};

export default Scene3DLoads;
