import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Scene3DProps = {
  nodes: Array<{ x: number; y: number; z: number }>;
  elements: Array<{ startNode: string; endNode: string }>;
};

const Scene3D = ({ nodes, elements }: Scene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Cleanup previous scene
    while(mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 
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

    // Camera positioning
    camera.position.set(25, 25, 25);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Create nodes
    const nodeMeshes: THREE.Mesh[] = [];
    nodes.forEach(({ x, y, z }) => {
      const geometry = new THREE.SphereGeometry(0.5);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      scene.add(sphere);
      nodeMeshes.push(sphere);
    });

    // Create elements
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xff0000,
      linewidth: 2
    });
    
    elements.forEach(element => {
      try {
        const startCoords = element.startNode.split(',').map(Number);
        const endCoords = element.endNode.split(',').map(Number);

        if (startCoords.length !== 3 || endCoords.length !== 3) {
          console.error('Invalid element coordinates:', element);
          return;
        }

        const points = [
          new THREE.Vector3(...startCoords),
          new THREE.Vector3(...endCoords)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
      } catch (error) {
        console.error('Error creating element:', error, element);
      }
    });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      
      // Rotate nodes for better visibility
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
      lineMaterial.dispose();
      nodeMeshes.forEach(mesh => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, [nodes, elements]);

  return <div ref={mountRef} className="scene-container" />;
};

export default Scene3D;