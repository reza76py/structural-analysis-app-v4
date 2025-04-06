// ✅ React + Three.js imports
import React from "react";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

// ✅ Component imports
import Scene3DNodes from "./Scene3DNodes";
import Scene3DElements from "./Scene3DElements";
import Scene3DSupports from "./Scene3DSupports";
import Scene3DLoads from "./Scene3DLoads";
import "../styles/styles_scene3d.css";

// ✅ Props type
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

type NodeInfo = { x: number; y: number; z: number };

function isNodeInfo(obj: any): obj is NodeInfo {
    return (
        obj &&
        typeof obj.x === "number" &&
        typeof obj.y === "number" &&
        typeof obj.z === "number"
    );
}

type ViewMode = "default" | "xy" | "xz" | "yz";

// ✅ Main Scene3D Component
const Scene3D = ({ nodes, elements, supports, loads }: Scene3DProps) => {
    // 🔧 Refs
    const mountRef = useRef<HTMLDivElement>(null);
    const gizmoRef = useRef<HTMLCanvasElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // 🔧 UI state
    const [showAxes, setShowAxes] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("default");

    // 🖱️ Hover & click state

    const [clickedNode, setClickedNode] = useState<THREE.Mesh | null>(null);


    // 🎯 Raycasting setup
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const [hoveredNode, setHoveredNode] = useState<NodeInfo | null>(null);
    const [clickedNodeInfo, setClickedNodeInfo] = useState<NodeInfo | null>(
        null,
    );

    // 🔄 Core scene logic
    useEffect(() => {
        if (!mountRef.current || nodes.length === 0) return;
        while (mountRef.current.firstChild)
            mountRef.current.removeChild(mountRef.current.firstChild);

        // 🎬 Scene setup
        const scene = new THREE.Scene();

        // 🧮 Compute bounds for grid
        const min = new THREE.Vector3(Infinity, Infinity, Infinity);
        const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
        nodes.forEach(({ x, y, z }) => {
            min.min(new THREE.Vector3(x, y, z));
            max.max(new THREE.Vector3(x, y, z));
        });
        const size = new THREE.Vector3().subVectors(max, min);
        const gridSize = Math.ceil(Math.max(size.x, size.y, size.z) * 2);
        const gridDivisions = Math.ceil(gridSize / 2);

        // 📷 Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000,
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

        // 🧱 Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight,
        );
        renderer.setClearColor(0xf0f0f0);
        mountRef.current.appendChild(renderer.domElement);

        // 🌀 Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // 💡 Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 1));

        // 📏 Grids
        if (showGrid) {
            const gridXY = new THREE.GridHelper(gridSize, gridDivisions);
            gridXY.rotateX(Math.PI / 2);
            scene.add(gridXY);
            const gridYZ = new THREE.GridHelper(gridSize, gridDivisions);
            gridYZ.rotateZ(Math.PI / 2);
            scene.add(gridYZ);
            scene.add(new THREE.GridHelper(gridSize, gridDivisions)); // XZ
        }

        // 📐 Axes
        if (showAxes) scene.add(new THREE.AxesHelper());

        // 🟢 Add interactive nodes
        nodes.forEach(({ x, y, z }) => {
            const geometry = new THREE.SphereGeometry(0.2, 10, 10);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y, z);
            sphere.userData = { type: "node", x, y, z };
            scene.add(sphere);
        });

        // 🧱 Add structure components
        Scene3DElements({ elements, scene });
        Scene3DSupports({ supports, scene });
        Scene3DLoads(scene, loads);

        // 🔍 Mini Axes Gizmo
        const axesScene = new THREE.Scene();
        const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
        axesCamera.position.set(2, 2, 2);
        axesCamera.lookAt(0, 0, 0);
        const axesRenderer = new THREE.WebGLRenderer({
            canvas: gizmoRef.current!,
            alpha: true,
        });
        axesRenderer.setSize(80, 80);
        axesRenderer.setClearColor(0x000000, 0);
        axesScene.add(new THREE.AxesHelper(1.5));

        // 🖱️ Mouse move → update raycaster + tooltip
        const handleMouseMove = (e: MouseEvent) => {
            const rect = mountRef.current!.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            if (tooltipRef.current) {
                tooltipRef.current.style.left = `${e.clientX + 10}px`;
                tooltipRef.current.style.top = `${e.clientY + 10}px`;
            }
        };

        // ✨ Click → select node
        const handleClick = (e: MouseEvent) => {
            const rect = mountRef.current!.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hit = raycaster
                .intersectObjects(scene.children)
                .find((i) => i.object.userData?.type === "node");

                if (hit) {
                  const mesh = hit.object as THREE.Mesh;
                  setClickedNode(mesh);
                  if (isNodeInfo(mesh.userData)) {
                    setClickedNodeInfo(mesh.userData);
                  } else {
                    setClickedNodeInfo(null);
                  }
                } else {
                  setClickedNode(null);
                  setClickedNodeInfo(null);
                }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick);

        // 🔁 Render loop
        const animate = () => {
            requestAnimationFrame(animate);

            // 🎯 Hover detection
            raycaster.setFromCamera(mouse, camera);
            const nodeHit = raycaster.intersectObjects(scene.children).find(
              i => i.object.userData?.type === "node"
            );
            
            if (nodeHit && isNodeInfo(nodeHit.object.userData)) {
              setHoveredNode(nodeHit.object.userData);
            } else {
              setHoveredNode(null);
            }

            // 🎨 Highlight selected node
            scene.children.forEach((obj) => {
                if (obj.userData?.type === "node") {
                    const mesh = obj as THREE.Mesh;
                    const mat = mesh.material as THREE.MeshPhongMaterial;
                    const isClicked = mesh === clickedNode;
                    mat.color.set(isClicked ? 0xffff00 : 0x00ff00);
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
            while (mountRef.current?.firstChild)
                mountRef.current.removeChild(mountRef.current.firstChild);
        };
    }, [nodes, elements, supports, loads, showAxes, showGrid, viewMode]);

    // ✅ UI Render
    return (
        <div className="scene-wrapper" style={{ position: "relative" }}>
            {/* 🧭 Controls */}
            <div className="btn-wrapper">
                <button
                    onClick={() => setShowAxes((p) => !p)}
                    className="toggle-axes-btn"
                >
                    {showAxes ? "Hide Axes" : "Show Axes"}
                </button>
                <button
                    onClick={() => setShowGrid((p) => !p)}
                    className="toggle-grid-btn"
                >
                    {showGrid ? "Hide Grid" : "Show Grid"}
                </button>
                <button onClick={() => setViewMode("xy")} className="view-btn">
                    XY View
                </button>
                <button onClick={() => setViewMode("xz")} className="view-btn">
                    XZ View
                </button>
                <button onClick={() => setViewMode("yz")} className="view-btn">
                    YZ View
                </button>
                <button
                    onClick={() => setViewMode("default")}
                    className="view-btn"
                >
                    3D View
                </button>
            </div>

            {/* 🖼️ Scene container */}
            <div
                ref={mountRef}
                className="scene-container"
                style={{
                    width: "100%",
                    height: "400px",
                    background: "#e0e0e0",
                }}
            />

            {/* 🧭 Gizmo */}
            <canvas
                ref={gizmoRef}
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    width: 80,
                    height: 80,
                    zIndex: 10,
                    pointerEvents: "none",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}
            />

            {/* 🟡 Tooltip on hover */}
            {hoveredNode && (
                <div
                    ref={tooltipRef}
                    style={{
                        position: "absolute",
                        background: "#333",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        zIndex: 20,
                        pointerEvents: "none",
                        transition: "top 0.05s, left 0.05s",
                    }}
                >
                    🧩 Node: ({hoveredNode.x}, {hoveredNode.y}, {hoveredNode.z})
                </div>
            )}

            {/* 📌 Selected node info */}
            {clickedNodeInfo && (
                <div
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "#006",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        zIndex: 20,
                    }}
                >
                    📌 Selected Node: ({clickedNodeInfo.x}, {clickedNodeInfo.y},{" "}
                    {clickedNodeInfo.z})
                </div>
            )}
        </div>
    );
};

export default Scene3D;
