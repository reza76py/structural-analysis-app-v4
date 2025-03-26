import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Scene3DNodes from "./Scene3DNodes";
import Scene3DElements from "./Scene3DElements"; 
import Scene3DSupports from "./Scene3DSupports";
import Scene3DLoads from "./Scene3DLoads";
import "../styles/styles_scene3d.css";

type Scene3DProps = {
  nodes: Array<{ x: number; y: number; z: number }>;
  elements: Array<{ startNode: string; endNode: string }>;
  supports: Array<{
    id: number;
    node_coordinate: string;
    x_restrained: boolean;
    y_restrained: boolean;
    z_restrained: boolean;
  }>;
  loads: Array<{
    node_coordinate: string;
    Fx: number;
    Fy: number;
    Fz: number;
  }>;
};

type ViewMode = "default" | "xy" | "xz" | "yz";

const Scene3D = ({ nodes, elements, supports, loads }: Scene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showAxes, setShowAxes] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("default"); // ✅ new state

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

    // ✅ Set camera based on selected view
    switch (viewMode) {
      case "xy":
        camera.position.set(0, 0, 20); // View from Z axis
        camera.up.set(0, 1, 0);
        break;
      case "xz":
        camera.position.set(0, 20, 0); // View from Y axis
        camera.up.set(0, 0, 1);
        break;
      case "yz":
        camera.position.set(20, 0, 0); // View from X axis
        camera.up.set(0, 1, 0);
        break;
      default:
        camera.position.set(10, 10, 10); // 3D view
        camera.up.set(0, 1, 0);
    }

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

    // ✅ Grid
    if (showGrid) {
      const gridXY = new THREE.GridHelper(10, 10); // XY → rotate X
      gridXY.rotateX(Math.PI / 2);
      scene.add(gridXY);
    
      const gridYZ = new THREE.GridHelper(10, 10); // YZ → rotate Z
      gridYZ.rotateZ(Math.PI / 2);
      scene.add(gridYZ);
    
      const gridXZ = new THREE.GridHelper(10, 10); // XZ → default
      scene.add(gridXZ);
    }
    

    // ✅ Axes
    let axesHelper: THREE.AxesHelper | null = null;
    if (showAxes) {
      axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }

    // ✅ Render nodes
    Scene3DNodes({ nodes, scene });
    Scene3DElements({ elements, scene });
    Scene3DSupports({ supports, scene });
    Scene3DLoads( scene, loads );


    // ✅ Render the scene
    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [nodes, loads, showAxes, showGrid, viewMode]);

  return (
    <div className="scene-wrapper">
      <div className="btn-wrapper">
        {/* ✅ Axes Toggle */}
        <button
          onClick={() => setShowAxes((prev) => !prev)}
          className="toggle-axes-btn"
        >
          {showAxes ? "Hide Axes" : "Show Axes"}
        </button>

        {/* ✅ Grid Toggle */}
        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className="toggle-grid-btn"
        >
          {showGrid ? "Hide XY Grid" : "Show XY Grid"}
        </button>

        {/* ✅ View Buttons */}
        <button onClick={() => setViewMode("xy")} className="view-btn">
          XY Plane View
        </button>
        <button onClick={() => setViewMode("xz")} className="view-btn">
          XZ Plane View
        </button>
        <button onClick={() => setViewMode("yz")} className="view-btn">
          YZ Plane View
        </button>
        <button onClick={() => setViewMode("default")} className="view-btn">
          3D View
        </button>
      </div>

      <div
        ref={mountRef}
        className="scene-container"
        style={{ width: "100%", height: "400px", background: "#e0e0e0" }}
      />
    </div>
  );
};

export default Scene3D;
