import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Scene3DNodes from "./Scene3DNodes";

type Scene3DProps = {
  nodes: Array<{ x: number; y: number; z: number }>;
};

const Scene3D = ({ nodes }: Scene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showAxes, setShowAxes] = useState<boolean>(false); // ✅ Toggle state

  useEffect(() => {
    if (!mountRef.current || !nodes || nodes.length === 0) return;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0xf0f0f0);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // ✅ Conditionally add Axes Helper
    let axesHelper: THREE.AxesHelper | null = null;
    if (showAxes) {
      axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }

    // ✅ Render the nodes
    Scene3DNodes({ nodes, scene });

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [nodes, showAxes]); // ✅ re-run when axes toggle

  return (
    <div className="scene-wrapper">
      {/* ✅ The Button */}
      <button
        onClick={() => setShowAxes((prev) => !prev)}
        className="toggle-axes-btn"
      >
        {showAxes ? "Hide Axes" : "Show Axes"}
      </button>

      {/* ✅ The 3D Container */}
      <div
        ref={mountRef}
        className="scene-container"
        style={{ width: "100%", height: "400px", background: "#e0e0e0" }}
      />
    </div>
  );
};

export default Scene3D;
