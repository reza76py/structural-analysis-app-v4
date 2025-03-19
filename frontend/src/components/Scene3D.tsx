import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import "../styles/styles_scene3D.css";

type Scene3DProps = {
  nodes: Array<{ x: number; y: number; z: number }>;
  elements: Array<{ startNode: string; endNode: string }>;
};

const Scene3D = ({ nodes, elements }: Scene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  console.log("🔹 Scene3D received nodes:", nodes);
  console.log("🔹 Scene3D received elements:", elements);


  useEffect(() => {
    if (!mountRef.current) return;

    // Cleanup previous scene
    while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, 
        mountRef.current.offsetWidth / mountRef.current.offsetHeight, 
        0.1, 
        1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Renderer setup
    renderer.setSize(
        mountRef.current.offsetWidth, 
        mountRef.current.offsetHeight
    );
    renderer.setClearColor(0xf0f0f0);
    mountRef.current.appendChild(renderer.domElement);

    // ✅ Adjust Camera Position
    camera.position.set(10, 10, 10);
    const sceneCenter = new THREE.Vector3(0, 0, 0);
    camera.lookAt(sceneCenter);

    // ✅ Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // ✅ Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // ✅ Create Nodes with Larger Size
    const nodeMeshes: THREE.Mesh[] = [];
    nodes.forEach(({ x, y, z }) => {
        console.log("🎯 Creating node at:", x, y, z);  // ✅ Debug log

        const geometry = new THREE.SphereGeometry(2);  // 🔹 Increase size
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);
        scene.add(sphere);
        nodeMeshes.push(sphere);
    });

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();

        // Rotate nodes for visibility
        nodeMeshes.forEach(mesh => {
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.005;
        });
    };
    animate();

    // Handle window resize
    const handleResize = () => {
        camera.aspect = mountRef.current!.offsetWidth / mountRef.current!.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
            mountRef.current!.offsetWidth, 
            mountRef.current!.offsetHeight
        );
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        scene.clear();
        renderer.dispose();
        nodeMeshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
    };
}, [nodes, elements]);


return (
  <div 
    ref={mountRef} 
    className="scene-container w-full h-full min-h-[500px] bg-gray-200 border border-gray-400 shadow-lg rounded-lg"
  />
);
}
export default Scene3D;