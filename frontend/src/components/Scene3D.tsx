// import { useEffect, useRef, useState } from "react";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as THREE from "three";

// import Scene3DNodes from "./Scene3DNodes";
// import Scene3DElements from "./Scene3DElements";
// import Scene3DSupports from "./Scene3DSupports";
// import Scene3DLoads from "./Scene3DLoads";
// import "../styles/styles_scene3d.css";

// type Scene3DProps = {
//   nodes: Array<{ x: number; y: number; z: number }>;
//   elements: Array<{ startNode: string; endNode: string }>;
//   supports: Array<{
//     id: number;
//     node_coordinate: string;
//     x_restrained: boolean;
//     y_restrained: boolean;
//     z_restrained: boolean;
//   }>;
//   loads: Array<{
//     node_coordinate: string;
//     Fx: number;
//     Fy: number;
//     Fz: number;
//   }>;
// };

// type ViewMode = "default" | "xy" | "xz" | "yz";

// const Scene3D = ({ nodes, elements, supports, loads }: Scene3DProps) => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const gizmoRef = useRef<HTMLCanvasElement>(null);
//   const tooltipRef = useRef<HTMLDivElement>(null);
//   const [clickedNode, setClickedNode] = useState<THREE.Mesh | null>(null);
//   const [clickedNodeInfo, setClickedNodeInfo] = useState<{ x: number; y: number; z: number } | null>(null);

//   const [showAxes, setShowAxes] = useState<boolean>(false);
//   const [showGrid, setShowGrid] = useState<boolean>(false);
//   const [viewMode, setViewMode] = useState<ViewMode>("default");

//   const [hoveredNode, setHoveredNode] = useState<{ x: number; y: number; z: number } | null>(null);
//   const mouse = new THREE.Vector2();
//   const raycaster = new THREE.Raycaster();

//   useEffect(() => {
//     if (!mountRef.current || nodes.length === 0) return;

//     while (mountRef.current.firstChild) {
//       mountRef.current.removeChild(mountRef.current.firstChild);
//     }

//     const scene = new THREE.Scene();

//     const min = new THREE.Vector3(Infinity, Infinity, Infinity);
//     const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
//     nodes.forEach(({ x, y, z }) => {
//       min.min(new THREE.Vector3(x, y, z));
//       max.max(new THREE.Vector3(x, y, z));
//     });

//     const size = new THREE.Vector3();
//     size.subVectors(max, min);
//     const maxDimension = Math.max(size.x, size.y, size.z);
//     const gridSize = Math.ceil(maxDimension * 2);
//     const gridDivisions = Math.ceil(gridSize / 2);

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );

//     switch (viewMode) {
//       case "xy":
//         camera.position.set(0, 0, 20);
//         camera.up.set(0, 1, 0);
//         break;
//       case "xz":
//         camera.position.set(0, 20, 0);
//         camera.up.set(0, 0, 1);
//         break;
//       case "yz":
//         camera.position.set(20, 0, 0);
//         camera.up.set(0, 1, 0);
//         break;
//       default:
//         camera.position.set(10, 10, 10);
//         camera.up.set(0, 1, 0);
//     }

//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(
//       mountRef.current.clientWidth,
//       mountRef.current.clientHeight
//     );
//     renderer.setClearColor(0xf0f0f0);
//     mountRef.current.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.enableZoom = true;
//     controls.enablePan = true;

//     const light = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(light);

//     if (showGrid) {
//       const gridXY = new THREE.GridHelper(gridSize, gridDivisions);
//       gridXY.rotateX(Math.PI / 2);
//       scene.add(gridXY);

//       const gridYZ = new THREE.GridHelper(gridSize, gridDivisions);
//       gridYZ.rotateZ(Math.PI / 2);
//       scene.add(gridYZ);

//       const gridXZ = new THREE.GridHelper(gridSize, gridDivisions);
//       scene.add(gridXZ);
//     }

//     if (showAxes) {
//       const axesHelper = new THREE.AxesHelper();
//       scene.add(axesHelper);
//     }

//     nodes.forEach(({ x, y, z }) => {
//       const geometry = new THREE.SphereGeometry(0.2, 10, 10);
//       const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
//       const sphere = new THREE.Mesh(geometry, material);
//       sphere.position.set(x, y, z);
//       sphere.userData = { type: "node", x, y, z };
//       scene.add(sphere);
//     });

//     Scene3DElements({ elements, scene });
//     Scene3DSupports({ supports, scene });
//     Scene3DLoads(scene, loads);

//     const axesScene = new THREE.Scene();
//     const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
//     axesCamera.position.set(2, 2, 2);
//     axesCamera.lookAt(0, 0, 0);

//     const axesRenderer = new THREE.WebGLRenderer({ canvas: gizmoRef.current!, alpha: true });
//     axesRenderer.setSize(80, 80);
//     axesRenderer.setClearColor(0x000000, 0);

//     const axesHelper = new THREE.AxesHelper(1.5);
//     axesScene.add(axesHelper);

//     const handleMouseMove = (event: MouseEvent) => {
//       if (!mountRef.current) return;
//       const rect = mountRef.current.getBoundingClientRect();
//       mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//       if (tooltipRef.current) {
//         tooltipRef.current.style.left = `${event.clientX + 10}px`;
//         tooltipRef.current.style.top = `${event.clientY + 10}px`;
//       }
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     const handleClick = (event: MouseEvent) => {
//       if (!mountRef.current) return;
//       const rect = mountRef.current.getBoundingClientRect();
//       mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children);
//       const nodeHit = intersects.find((i) => i.object.userData?.type === "node");
    
//       if (nodeHit) {
//         const mesh = nodeHit.object as THREE.Mesh;
//         const { x, y, z } = mesh.userData;
//         setClickedNode(mesh);
//         setClickedNodeInfo({ x, y, z });
//       } else {
//         setClickedNode(null);
//         setClickedNodeInfo(null);
//       }
//     };
//     window.addEventListener("click", handleClick);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children);
//       const nodeHit = intersects.find((i) => i.object.userData?.type === "node");
//       if (nodeHit) {
//         const { x, y, z } = nodeHit.object.userData;
//         setHoveredNode({ x, y, z });
//       } else {
//         setHoveredNode(null);
//       }

//       scene.children.forEach((obj) => {
//         if (obj.userData?.type === "node") {
//           const mesh = obj as THREE.Mesh;
//           const isClicked = mesh === clickedNode;
//           (mesh.material as THREE.MeshPhongMaterial).color.set(isClicked ? 0xffff00 : 0x00ff00);
//           (mesh.scale as THREE.Vector3).setScalar(isClicked ? 1.5 : 1);
//         }
//       });

//       controls.update();
//       renderer.render(scene, camera);
//       axesRenderer.render(axesScene, axesCamera);
//     };
//     animate();

//     return () => {
//       renderer.dispose();
//       axesRenderer.dispose();
//       window.removeEventListener("mousemove", handleMouseMove);
//       while (mountRef.current?.firstChild) {
//         mountRef.current.removeChild(mountRef.current.firstChild);
//       }
//     };
//   }, [nodes, elements, supports, loads, showAxes, showGrid, viewMode]);

//   return (
//     <div className="scene-wrapper" style={{ position: "relative" }}>
//       <div className="btn-wrapper">
//         <button onClick={() => setShowAxes((prev) => !prev)} className="toggle-axes-btn">
//           {showAxes ? "Hide Axes" : "Show Axes"}
//         </button>
//         <button onClick={() => setShowGrid((prev) => !prev)} className="toggle-grid-btn">
//           {showGrid ? "Hide Grid" : "Show Grid"}
//         </button>
//         <button onClick={() => setViewMode("xy")} className="view-btn">XY Plane View</button>
//         <button onClick={() => setViewMode("xz")} className="view-btn">XZ Plane View</button>
//         <button onClick={() => setViewMode("yz")} className="view-btn">YZ Plane View</button>
//         <button onClick={() => setViewMode("default")} className="view-btn">3D View</button>
//       </div>

//       <div
//         ref={mountRef}
//         className="scene-container"
//         style={{ width: "100%", height: "400px", background: "#e0e0e0" }}
//       />

//       <canvas
//         ref={gizmoRef}
//         style={{
//           position: "absolute",
//           top: 10,
//           left: 10,
//           width: 80,
//           height: 80,
//           zIndex: 10,
//           pointerEvents: "none",
//           border: "1px solid #ccc",
//           borderRadius: "8px"
//         }}
//       />

//       {/* ✅ Dynamic Tooltip */}
//       {hoveredNode && (
//         <div
//           ref={tooltipRef}
//           style={{
//             position: "absolute",
//             background: "#333",
//             color: "#fff",
//             padding: "6px 12px",
//             borderRadius: "6px",
//             fontSize: "14px",
//             zIndex: 20,
//             pointerEvents: "none",
//             transition: "top 0.05s, left 0.05s",
//           }}
//         >
//           🧩 Node: ({hoveredNode.x}, {hoveredNode.y}, {hoveredNode.z})
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scene3D;







// import { useEffect, useRef, useState } from "react";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as THREE from "three";

// import Scene3DNodes from "./Scene3DNodes";
// import Scene3DElements from "./Scene3DElements";
// import Scene3DSupports from "./Scene3DSupports";
// import Scene3DLoads from "./Scene3DLoads";
// import "../styles/styles_scene3d.css";

// type Scene3DProps = {
//   nodes: Array<{ x: number; y: number; z: number }>;
//   elements: Array<{ startNode: string; endNode: string }>;
//   supports: Array<{
//     id: number;
//     node_coordinate: string;
//     x_restrained: boolean;
//     y_restrained: boolean;
//     z_restrained: boolean;
//   }>;
//   loads: Array<{
//     node_coordinate: string;
//     Fx: number;
//     Fy: number;
//     Fz: number;
//   }>;
// };

// type ViewMode = "default" | "xy" | "xz" | "yz";

// const Scene3D = ({ nodes, elements, supports, loads }: Scene3DProps) => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const gizmoRef = useRef<HTMLCanvasElement>(null);
//   const tooltipRef = useRef<HTMLDivElement>(null);

//   const [hoveredNode, setHoveredNode] = useState<{ x: number; y: number; z: number } | null>(null);
//   const [clickedNode, setClickedNode] = useState<THREE.Mesh | null>(null);
//   const [clickedNodeInfo, setClickedNodeInfo] = useState<{ x: number; y: number; z: number } | null>(null);

//   const [showAxes, setShowAxes] = useState(false);
//   const [showGrid, setShowGrid] = useState(false);
//   const [viewMode, setViewMode] = useState<ViewMode>("default");

//   const mouse = new THREE.Vector2();
//   const raycaster = new THREE.Raycaster();

//   useEffect(() => {
//     if (!mountRef.current || nodes.length === 0) return;

//     while (mountRef.current.firstChild) {
//       mountRef.current.removeChild(mountRef.current.firstChild);
//     }

//     const scene = new THREE.Scene();

//     const min = new THREE.Vector3(Infinity, Infinity, Infinity);
//     const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
//     nodes.forEach(({ x, y, z }) => {
//       min.min(new THREE.Vector3(x, y, z));
//       max.max(new THREE.Vector3(x, y, z));
//     });
//     const size = new THREE.Vector3();
//     size.subVectors(max, min);
//     const maxDimension = Math.max(size.x, size.y, size.z);
//     const gridSize = Math.ceil(maxDimension * 2);
//     const gridDivisions = Math.ceil(gridSize / 2);

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );

//     switch (viewMode) {
//       case "xy":
//         camera.position.set(0, 0, 20);
//         camera.up.set(0, 1, 0);
//         break;
//       case "xz":
//         camera.position.set(0, 20, 0);
//         camera.up.set(0, 0, 1);
//         break;
//       case "yz":
//         camera.position.set(20, 0, 0);
//         camera.up.set(0, 1, 0);
//         break;
//       default:
//         camera.position.set(10, 10, 10);
//         camera.up.set(0, 1, 0);
//     }

//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     renderer.setClearColor(0xf0f0f0);
//     mountRef.current.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;

//     const light = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(light);

//     if (showGrid) {
//       const gridXY = new THREE.GridHelper(gridSize, gridDivisions);
//       gridXY.rotateX(Math.PI / 2);
//       scene.add(gridXY);

//       const gridYZ = new THREE.GridHelper(gridSize, gridDivisions);
//       gridYZ.rotateZ(Math.PI / 2);
//       scene.add(gridYZ);

//       const gridXZ = new THREE.GridHelper(gridSize, gridDivisions);
//       scene.add(gridXZ);
//     }

//     if (showAxes) {
//       scene.add(new THREE.AxesHelper());
//     }

//     // Nodes with metadata for hover/click
//     nodes.forEach(({ x, y, z }) => {
//       const geometry = new THREE.SphereGeometry(0.2, 10, 10);
//       const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
//       const sphere = new THREE.Mesh(geometry, material);
//       sphere.position.set(x, y, z);
//       sphere.userData = { type: "node", x, y, z };
//       scene.add(sphere);
//     });

//     // Additional visual components
//     Scene3DElements({ elements, scene });
//     Scene3DSupports({ supports, scene });
//     Scene3DLoads(scene, loads);

//     // Mini Gizmo
//     const axesScene = new THREE.Scene();
//     const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
//     axesCamera.position.set(2, 2, 2);
//     axesCamera.lookAt(0, 0, 0);
//     const axesRenderer = new THREE.WebGLRenderer({ canvas: gizmoRef.current!, alpha: true });
//     axesRenderer.setSize(80, 80);
//     axesRenderer.setClearColor(0x000000, 0);
//     axesScene.add(new THREE.AxesHelper(1.5));

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = mountRef.current!.getBoundingClientRect();
//       mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

//       if (tooltipRef.current) {
//         tooltipRef.current.style.left = `${e.clientX + 10}px`;
//         tooltipRef.current.style.top = `${e.clientY + 10}px`;
//       }
//     };

//     const handleClick = (e: MouseEvent) => {
//       const rect = mountRef.current!.getBoundingClientRect();
//       mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children);
//       const nodeHit = intersects.find((i) => i.object.userData?.type === "node");

//       if (nodeHit) {
//         const mesh = nodeHit.object as THREE.Mesh;
//         setClickedNode(mesh);
//         setClickedNodeInfo(mesh.userData);
//       } else {
//         setClickedNode(null);
//         setClickedNodeInfo(null);
//       }
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("click", handleClick);

//     const animate = () => {
//       requestAnimationFrame(animate);

//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children);
//       const nodeHit = intersects.find((i) => i.object.userData?.type === "node");
//       setHoveredNode(nodeHit ? nodeHit.object.userData : null);

//       scene.children.forEach((obj) => {
//         if (obj.userData?.type === "node") {
//           const mesh = obj as THREE.Mesh;
//           const isClicked = mesh === clickedNode;
//           (mesh.material as THREE.MeshPhongMaterial).color.set(isClicked ? 0xffff00 : 0x00ff00);
//           mesh.scale.setScalar(isClicked ? 1.5 : 1);
//         }
//       });

//       controls.update();
//       renderer.render(scene, camera);
//       axesRenderer.render(axesScene, axesCamera);
//     };

//     animate();

//     return () => {
//       renderer.dispose();
//       axesRenderer.dispose();
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("click", handleClick);
//       while (mountRef.current?.firstChild) {
//         mountRef.current.removeChild(mountRef.current.firstChild);
//       }
//     };
//   }, [nodes, elements, supports, loads, showAxes, showGrid, viewMode]);

//   return (
//     <div className="scene-wrapper" style={{ position: "relative" }}>
//       <div className="btn-wrapper">
//         <button onClick={() => setShowAxes((prev) => !prev)} className="toggle-axes-btn">
//           {showAxes ? "Hide Axes" : "Show Axes"}
//         </button>
//         <button onClick={() => setShowGrid((prev) => !prev)} className="toggle-grid-btn">
//           {showGrid ? "Hide Grid" : "Show Grid"}
//         </button>
//         <button onClick={() => setViewMode("xy")} className="view-btn">XY Plane View</button>
//         <button onClick={() => setViewMode("xz")} className="view-btn">XZ Plane View</button>
//         <button onClick={() => setViewMode("yz")} className="view-btn">YZ Plane View</button>
//         <button onClick={() => setViewMode("default")} className="view-btn">3D View</button>
//       </div>

//       <div ref={mountRef} className="scene-container" style={{ width: "100%", height: "400px", background: "#e0e0e0" }} />
//       <canvas ref={gizmoRef} style={{
//         position: "absolute", top: 10, left: 10, width: 80, height: 80, zIndex: 10, pointerEvents: "none",
//         border: "1px solid #ccc", borderRadius: "8px"
//       }} />

//       {/* Tooltip on hover */}
//       {hoveredNode && (
//         <div ref={tooltipRef} style={{
//           position: "absolute", background: "#333", color: "#fff",
//           padding: "6px 12px", borderRadius: "6px", fontSize: "14px",
//           zIndex: 20, pointerEvents: "none", transition: "top 0.05s, left 0.05s"
//         }}>
//           🧩 Node: ({hoveredNode.x}, {hoveredNode.y}, {hoveredNode.z})
//         </div>
//       )}

//       {/* Fixed info on click */}
//       {clickedNodeInfo && (
//         <div style={{
//           position: "absolute", top: 10, right: 10,
//           background: "#006", color: "#fff",
//           padding: "8px 14px", borderRadius: "6px", fontSize: "14px", zIndex: 20
//         }}>
//           📌 Selected Node: ({clickedNodeInfo.x}, {clickedNodeInfo.y}, {clickedNodeInfo.z})
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scene3D;










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
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [hoveredNode, setHoveredNode] = useState<{ x: number; y: number; z: number } | null>(null);
  const [clickedNode, setClickedNode] = useState<THREE.Mesh | null>(null);
  const [clickedNodeInfo, setClickedNodeInfo] = useState<{ x: number; y: number; z: number } | null>(null);

  const [showAxes, setShowAxes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  useEffect(() => {
    if (!mountRef.current || nodes.length === 0) return;

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
      case "xy": camera.position.set(0, 0, 20); camera.up.set(0, 1, 0); break;
      case "xz": camera.position.set(0, 20, 0); camera.up.set(0, 0, 1); break;
      case "yz": camera.position.set(20, 0, 0); camera.up.set(0, 1, 0); break;
      default: camera.position.set(10, 10, 10); camera.up.set(0, 1, 0);
    }

    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0xf0f0f0);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    if (showGrid) {
      const gridXY = new THREE.GridHelper(gridSize, gridDivisions);
      gridXY.rotateX(Math.PI / 2);
      scene.add(gridXY);
      const gridYZ = new THREE.GridHelper(gridSize, gridDivisions);
      gridYZ.rotateZ(Math.PI / 2);
      scene.add(gridYZ);
      scene.add(new THREE.GridHelper(gridSize, gridDivisions));
    }

    if (showAxes) scene.add(new THREE.AxesHelper());

    // ✅ Render nodes (interactive)
    nodes.forEach(({ x, y, z }) => {
      const geometry = new THREE.SphereGeometry(0.2, 10, 10);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.userData = { type: "node", x, y, z };
      scene.add(sphere);
    });

    Scene3DElements({ elements, scene });
    Scene3DSupports({ supports, scene });
    Scene3DLoads(scene, loads);

    // Gizmo
    const axesScene = new THREE.Scene();
    const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    axesCamera.position.set(2, 2, 2);
    axesCamera.lookAt(0, 0, 0);
    const axesRenderer = new THREE.WebGLRenderer({ canvas: gizmoRef.current!, alpha: true });
    axesRenderer.setSize(80, 80);
    axesRenderer.setClearColor(0x000000, 0);
    axesScene.add(new THREE.AxesHelper(1.5));

    // Mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${e.clientX + 10}px`;
        tooltipRef.current.style.top = `${e.clientY + 10}px`;
      }
    };

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      const hit = intersects.find((i) => i.object.userData?.type === "node");

      if (hit) {
        const mesh = hit.object as THREE.Mesh;
        setClickedNode(mesh);
        setClickedNodeInfo(mesh.userData);
      } else {
        setClickedNode(null);
        setClickedNodeInfo(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      const nodeHit = intersects.find((i) => i.object.userData?.type === "node");
      setHoveredNode(nodeHit ? nodeHit.object.userData : null);

      // ✅ Highlight clicked node
      scene.children.forEach((obj) => {
        if (obj.userData?.type === "node") {
          const mesh = obj as THREE.Mesh;
          const isClicked = mesh === clickedNode;
          const mat = mesh.material as THREE.MeshPhongMaterial;
          mat.color.set(isClicked ? 0xffff00 : 0x00ff00);
          mat.needsUpdate = true;
          mesh.scale.setScalar(isClicked ? 1.5 : 1);
        }
      });

      controls.update();
      renderer.render(scene, camera);
      axesRenderer.render(axesScene, axesCamera);
    };

    animate();

    return () => {
      renderer.dispose();
      axesRenderer.dispose();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [nodes, elements, supports, loads, showAxes, showGrid, viewMode]);

  return (
    <div className="scene-wrapper" style={{ position: "relative" }}>
      <div className="btn-wrapper">
        <button onClick={() => setShowAxes((p) => !p)} className="toggle-axes-btn">{showAxes ? "Hide Axes" : "Show Axes"}</button>
        <button onClick={() => setShowGrid((p) => !p)} className="toggle-grid-btn">{showGrid ? "Hide Grid" : "Show Grid"}</button>
        <button onClick={() => setViewMode("xy")} className="view-btn">XY Plane View</button>
        <button onClick={() => setViewMode("xz")} className="view-btn">XZ Plane View</button>
        <button onClick={() => setViewMode("yz")} className="view-btn">YZ Plane View</button>
        <button onClick={() => setViewMode("default")} className="view-btn">3D View</button>
      </div>

      <div ref={mountRef} className="scene-container" style={{ width: "100%", height: "400px", background: "#e0e0e0" }} />

      <canvas ref={gizmoRef} style={{
        position: "absolute", top: 10, left: 10, width: 80, height: 80,
        zIndex: 10, pointerEvents: "none", border: "1px solid #ccc", borderRadius: "8px"
      }} />

      {/* Tooltip on hover */}
      {hoveredNode && (
        <div ref={tooltipRef} style={{
          position: "absolute", background: "#333", color: "#fff",
          padding: "6px 12px", borderRadius: "6px", fontSize: "14px",
          zIndex: 20, pointerEvents: "none", transition: "top 0.05s, left 0.05s"
        }}>
          🧩 Node: ({hoveredNode.x}, {hoveredNode.y}, {hoveredNode.z})
        </div>
      )}

      {/* Selected node info */}
      {clickedNodeInfo && (
        <div style={{
          position: "absolute", top: 10, right: 10, background: "#006",
          color: "#fff", padding: "8px 14px", borderRadius: "6px",
          fontSize: "14px", zIndex: 20
        }}>
          📌 Selected Node: ({clickedNodeInfo.x}, {clickedNodeInfo.y}, {clickedNodeInfo.z})
        </div>
      )}
    </div>
  );
};

export default Scene3D;
