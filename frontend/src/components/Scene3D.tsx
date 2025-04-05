import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  const gizmoRef = useRef<HTMLCanvasElement>(null);
  const [showAxes, setShowAxes] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  useEffect(() => {
    if (!mountRef.current || !nodes || nodes.length === 0) return;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const scene = new THREE.Scene();

    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

    nodes.forEach(({ x, y, z }) => {
      min.min(new THREE.Vector3(x, y, z));
      max.max(new THREE.Vector3(x, y, z));
    });

    const size = new THREE.Vector3();
    size.subVectors(max, min);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const gridSize = Math.ceil(maxDimension * 2);
    const gridDivisions = Math.ceil(gridSize / 2);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    switch (viewMode) {
      case "xy":
        camera.position.set(0, 0, 20);
        camera.up.set(0, 1, 0);
        break;
      case "xz":
        camera.position.set(0, 20, 0);
        camera.up.set(0, 0, 1);
        break;
      case "yz":
        camera.position.set(20, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      default:
        camera.position.set(10, 10, 10);
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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    if (showGrid) {
      const gridXY = new THREE.GridHelper(gridSize, gridDivisions);
      gridXY.rotateX(Math.PI / 2);
      scene.add(gridXY);

      const gridYZ = new THREE.GridHelper(gridSize, gridDivisions);
      gridYZ.rotateZ(Math.PI / 2);
      scene.add(gridYZ);

      const gridXZ = new THREE.GridHelper(gridSize, gridDivisions);
      scene.add(gridXZ);
    }

    if (showAxes) {
      const axesHelper = new THREE.AxesHelper();
      scene.add(axesHelper);
    }

    Scene3DNodes({ nodes, scene });
    Scene3DElements({ elements, scene });
    Scene3DSupports({ supports, scene });
    Scene3DLoads(scene, loads);

    // ✅ MINI AXES GIZMO SETUP
    const axesScene = new THREE.Scene();
    const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    axesCamera.position.set(2, 2, 2);
    axesCamera.lookAt(0, 0, 0);

    const axesRenderer = new THREE.WebGLRenderer({ canvas: gizmoRef.current!, alpha: true });
    axesRenderer.setSize(80, 80);
    axesRenderer.setClearColor(0x000000, 0);

    const axesHelper = new THREE.AxesHelper(1.5);
    axesScene.add(axesHelper);

    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   controls.update();
    //   renderer.render(scene, camera);
    //   console.log("Gizmo rendering");
    //   axesCamera.quaternion.copy(camera.quaternion);
    //   axesRenderer.render(axesScene, axesCamera);
    // };


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
    
      // Main scene
      renderer.render(scene, camera);
    
      // ✅ Sync gizmo orientation (rotation only)
      axesCamera.quaternion.copy(camera.quaternion);
    
      // ✅ Maintain a fixed distance (e.g., radius = 2 units)
      const radius = 2;
      const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(axesCamera.quaternion);
      axesCamera.position.copy(direction.multiplyScalar(radius));
      axesCamera.lookAt(0, 0, 0);
    
      // Render gizmo
      axesRenderer.render(axesScene, axesCamera);
    };
    animate();

    return () => {
      renderer.dispose();
      axesRenderer.dispose();
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [nodes, elements, supports, loads, showAxes, showGrid, viewMode]);

  return (
    <div className="scene-wrapper" style={{ position: "relative" }}>
      <div className="btn-wrapper">
        {/* Buttons */}
        <button onClick={() => setShowAxes((prev) => !prev)} className="toggle-axes-btn">
          {showAxes ? "Hide Axes" : "Show Axes"}
        </button>
        <button onClick={() => setShowGrid((prev) => !prev)} className="toggle-grid-btn">
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
        <button onClick={() => setViewMode("xy")} className="view-btn">XY Plane View</button>
        <button onClick={() => setViewMode("xz")} className="view-btn">XZ Plane View</button>
        <button onClick={() => setViewMode("yz")} className="view-btn">YZ Plane View</button>
        <button onClick={() => setViewMode("default")} className="view-btn">3D View</button>
      </div>
  
      {/* Main scene */}
      <div
        ref={mountRef}
        className="scene-container"
        style={{ width: "100%", height: "400px", background: "#e0e0e0" }}
      />
  
      {/* ✅ Mini Axes Gizmo Canvas */}
      <canvas
        ref={gizmoRef}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 80,
          height: 80,
          zIndex: 10,
          pointerEvents: "none", // Don't block mouse events
          border: "1px solid #ccc",
          borderRadius: "8px"
        }}
      />
    </div>
  );
}  

export default Scene3D;
