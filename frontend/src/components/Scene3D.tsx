import { useEffect, useRef } from "react";
import * as THREE from "three";
import Scene3DNodes from "./Scene3DNodes"; // ✅ Import nodes renderer

type Scene3DProps = {
  nodes: Array<{ x: number; y: number; z: number }>;
};

const Scene3D = ({ nodes }: Scene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: make sure the DOM and nodes are ready
    if (!mountRef.current || !nodes || nodes.length === 0) return;

    // ✅ Clean up previous canvas
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // ✅ Scene setup
    const scene = new THREE.Scene();

    // ✅ Camera setup
    const camera = new THREE.PerspectiveCamera(
      100,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // ✅ Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0xf0f0f0);
    mountRef.current.appendChild(renderer.domElement);

    // ✅ Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // ✅ Render nodes (spheres) using the modular file
    Scene3DNodes({ nodes, scene }); // 🧠 We treat it like a utility for now

    // ✅ Render the scene once
    renderer.render(scene, camera);

    // ✅ Cleanup
    return () => {
      renderer.dispose();
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [nodes]);

  return (
    <div
      ref={mountRef}
      className="scene-container"
      style={{ width: "100%", height: "400px", background: "#e0e0e0" }}
    />
  );
};

export default Scene3D;
