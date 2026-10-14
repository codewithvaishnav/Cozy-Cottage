import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AtmosphericMood, LandmarkHotspot, RenderStyle } from '../../types';
import { LANDMARK_HOTSPOTS } from '../../data/estateData';
import { useScrollPhysics } from '../../hooks/useScrollPhysics';
import { createCompressionPipeline, CompressionPipeline } from '../../services/compressionLoader';
import { Sparkles, Sun, Moon, Sunset, Maximize2, Minimize2, RotateCcw, X, Zap, Smartphone } from 'lucide-react';

interface Estate3DSceneProps {
  mood: AtmosphericMood;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: LandmarkHotspot | null) => void;
  onMoodChange: (mood: AtmosphericMood) => void;
  onCompressionReady?: (info: { gpuFormats: string[]; dracoReady: boolean }) => void;
}

interface CloudFormation {
  group: THREE.Group;
  speed: number;
  baseY: number;
  phase: number;
}

export const Estate3DScene: React.FC<Estate3DSceneProps> = ({
  mood,
  activeHotspotId,
  onSelectHotspot,
  onMoodChange,
  onCompressionReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollPhysics = useScrollPhysics();
  const scrollPhysicsRef = useRef(scrollPhysics);

  useEffect(() => {
    scrollPhysicsRef.current = scrollPhysics;
  }, [scrollPhysics]);

  // Render Style: Realistic PBR
  const [renderStyle, setRenderStyle] = useState<RenderStyle>('realistic');
  const [isCinematicTour, setIsCinematicTour] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));
  const [forceOrientation, setForceOrientation] = useState<'landscape' | 'portrait' | 'auto'>('auto');

  // Compute whether 3D model should be displayed in landscape orientation when in mobile fullscreen
  const isPortrait = viewportSize.height > viewportSize.width;
  const isMobile = Math.min(viewportSize.width, viewportSize.height) < 768;
  const shouldRotateLandscape = isFullscreen && (
    forceOrientation === 'landscape' || (forceOrientation === 'auto' && isMobile && isPortrait)
  );

  const [screenHotspots, setScreenHotspots] = useState<Array<{ id: string; name: string; category: string; x: number; y: number; visible: boolean }>>([]);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic objects refs
  const poolWaterRef = useRef<THREE.Mesh | null>(null);
  const poolTubeRef = useRef<THREE.Group | THREE.Mesh | null>(null);
  const pillarSconcesRef = useRef<THREE.PointLight[]>([]);
  const underwaterLightsRef = useRef<THREE.PointLight[]>([]);
  const windowGlowLightsRef = useRef<THREE.PointLight[]>([]);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const hemisphereLightRef = useRef<THREE.HemisphereLight | null>(null);
  const windmillSailsRef = useRef<THREE.Group | null>(null);
  const firefliesRef = useRef<THREE.Points | null>(null);
  const cloudsListRef = useRef<CloudFormation[]>([]);
  const cloudMaterialsRef = useRef<THREE.SpriteMaterial[]>([]);
  const compressionPipelineRef = useRef<CompressionPipeline | null>(null);
  const allMeshMaterialsRef = useRef<Array<{ mesh: THREE.Mesh; originalMat: THREE.Material; toonMat: THREE.Material; pixarMat: THREE.Material }>>([]);
  const villaGroupRef = useRef<THREE.Group | null>(null);

  // Camera lerp targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(18, 12, 22));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));

  // Mouse & interaction states
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDist = useRef<number>(0);
  const orbitRadius = useRef<number>(28);
  const orbitAngles = useRef<{ theta: number; phi: number }>({ theta: 0.85, phi: 0.48 });
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDist = useRef<number | null>(null);
  const initialPinchRadius = useRef<number>(28);

  // Update target when active hotspot changes with responsive mobile framing
  useEffect(() => {
    const w = containerRef.current?.clientWidth || window.innerWidth;
    const h = containerRef.current?.clientHeight || window.innerHeight;
    const aspect = w / h;
    const isMobile = w < 640 || aspect < 0.9;

    if (activeHotspotId) {
      const spot = LANDMARK_HOTSPOTS.find(h => h.id === activeHotspotId);
      if (spot) {
        // On mobile devices, pull camera back slightly (16%) so the entire hotspot scene fits in the narrow viewport
        const mobileScale = isMobile ? 1.16 : 1.0;
        const camX = spot.targetPosition[0] + (spot.cameraPosition[0] - spot.targetPosition[0]) * mobileScale;
        const camY = Math.max(1.8, spot.targetPosition[1] + (spot.cameraPosition[1] - spot.targetPosition[1]) * mobileScale);
        const camZ = spot.targetPosition[2] + (spot.cameraPosition[2] - spot.targetPosition[2]) * mobileScale;

        targetCamPos.current.set(camX, camY, camZ);
        targetLookAt.current.set(...spot.targetPosition);
        setIsCinematicTour(false);

        // Align orbit parameters to the selected viewpoint
        const dx = camX - spot.targetPosition[0];
        const dy = camY - spot.targetPosition[1];
        const dz = camZ - spot.targetPosition[2];
        const r = Math.hypot(dx, dy, dz);
        orbitRadius.current = r;
        orbitAngles.current.theta = Math.atan2(dx, dz);
        orbitAngles.current.phi = Math.acos(Math.max(-1, Math.min(1, dy / r)));
      }
    } else {
      const defaultR = isMobile ? 32 : 28;
      orbitRadius.current = defaultR;
      orbitAngles.current = { theta: 0.85, phi: 0.48 };
      const x = defaultR * Math.sin(0.48) * Math.sin(0.85);
      const y = defaultR * Math.cos(0.48);
      const z = defaultR * Math.sin(0.48) * Math.cos(0.85);
      targetCamPos.current.set(x, Math.max(1.8, y + 2), z);
      targetLookAt.current.set(0, 2, 0);
    }
  }, [activeHotspotId]);

  // Main Three.js Setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 1. Rich Sky Dome with Twilight & Golden Sunset Gradient + Twinkling Stars
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const skyCtx = skyCanvas.getContext('2d');
    if (skyCtx) {
      const grad = skyCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0.0, '#06101c'); // Midnight deep zenith
      grad.addColorStop(0.25, '#0e2034'); // Deep royal indigo
      grad.addColorStop(0.50, '#1c324a'); // Atmospheric twilight slate
      grad.addColorStop(0.72, '#5a3536'); // Warm dusk mauve
      grad.addColorStop(0.88, '#d47b42'); // Glowing amber/peach horizon band
      grad.addColorStop(0.96, '#f4ab64'); // Radiant golden peach
      grad.addColorStop(1.0, '#ffd18f'); // Luminous horizon line
      skyCtx.fillStyle = grad;
      skyCtx.fillRect(0, 0, 512, 512);

      // Painterly soft horizon cloud banks
      const drawHorizonCloud = (cx: number, cy: number, rx: number, ry: number, color: string) => {
        skyCtx.fillStyle = color;
        skyCtx.beginPath();
        skyCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        skyCtx.fill();
      };

      const horizonCloudPuffs = [
        { x: 50, y: 440, rx: 75, ry: 26, c: 'rgba(235, 140, 80, 0.45)' },
        { x: 125, y: 430, rx: 60, ry: 22, c: 'rgba(245, 175, 110, 0.55)' },
        { x: 195, y: 445, rx: 85, ry: 28, c: 'rgba(225, 130, 75, 0.40)' },
        { x: 265, y: 435, rx: 70, ry: 24, c: 'rgba(240, 160, 95, 0.50)' },
        { x: 345, y: 440, rx: 80, ry: 27, c: 'rgba(235, 145, 85, 0.45)' },
        { x: 425, y: 432, rx: 65, ry: 25, c: 'rgba(248, 180, 115, 0.52)' },
        { x: 490, y: 445, rx: 75, ry: 26, c: 'rgba(225, 135, 80, 0.40)' }
      ];
      horizonCloudPuffs.forEach(p => drawHorizonCloud(p.x, p.y, p.rx, p.ry, p.c));

      // Higher soft wispy cirrus sweeps
      const cirrusPuffs = [
        { x: 90, y: 350, rx: 95, ry: 16, c: 'rgba(210, 150, 160, 0.28)' },
        { x: 280, y: 330, rx: 115, ry: 18, c: 'rgba(220, 160, 170, 0.32)' },
        { x: 440, y: 355, rx: 100, ry: 17, c: 'rgba(215, 155, 165, 0.26)' }
      ];
      cirrusPuffs.forEach(p => drawHorizonCloud(p.x, p.y, p.rx, p.ry, p.c));

      // Subtle twinkling stars in upper atmosphere
      skyCtx.fillStyle = '#ffffff';
      for (let s = 0; s < 180; s++) {
        const sx = Math.random() * 512;
        const sy = Math.random() * 260;
        const sr = Math.random() < 0.2 ? 1.5 : 0.8;
        skyCtx.globalAlpha = 0.35 + Math.random() * 0.65;
        skyCtx.beginPath();
        skyCtx.arc(sx, sy, sr, 0, Math.PI * 2);
        skyCtx.fill();
      }
      skyCtx.globalAlpha = 1.0;
    }
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    const skyDomeGeo = new THREE.SphereGeometry(260, 32, 16);
    const skyDomeMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      fog: false // Never obscured by fog, always radiant!
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    scene.add(skyDome);

    // Linear Atmospheric Fog (Leaves foreground crystal clear, soft fade beyond 50m)
    scene.background = new THREE.Color(0x101f2e);
    const fog = new THREE.Fog(0x101f2e, 45, 230);
    scene.fog = fog;

    // Helper to calculate responsive camera FOV & aspect ratio for ANY screen size
    const updateCameraResponsive = (cam: THREE.PerspectiveCamera, w: number, h: number) => {
      const aspect = w / h;
      cam.aspect = aspect;
      if (aspect < 0.65) {
        // Narrow smartphone portrait (e.g. 360x600, 375x667)
        cam.fov = 64;
      } else if (aspect < 0.85) {
        // Standard phone portrait (e.g. 390x520, 412x560)
        cam.fov = 58;
      } else if (aspect < 1.1) {
        // Tablet portrait or square
        cam.fov = 50;
      } else if (aspect < 1.4) {
        // Tablet landscape / small laptop
        cam.fov = 46;
      } else {
        // Desktop wide
        cam.fov = 43;
      }
      cam.updateProjectionMatrix();
    };

    // Camera with Responsive Framing
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.5, 450);
    updateCameraResponsive(camera, width, height);
    camera.position.set(18, 12, 22);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer (High 60 FPS Performance Mode)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    rendererRef.current = renderer;

    // Hardware-Accelerated Draco 3D & KTX2 GPU Texture Decompression Pipeline
    const compressionPipeline = createCompressionPipeline(renderer);
    compressionPipelineRef.current = compressionPipeline;
    if (onCompressionReady) {
      onCompressionReady({
        gpuFormats: compressionPipeline.gpuFormats,
        dracoReady: true
      });
    }

    // Main Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3d5c2e, 0.65);
    scene.add(hemiLight);
    hemisphereLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfff0d0, 1.8);
    dirLight.position.set(25, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Build the user's authentic Farmhouse architecture & environment
    buildCustomFarmhouseWorld(scene);

    // Create Beautiful Volumetric & Atmospheric 3D Drifting Cloud System
    const buildVolumetricCloudsSystem = () => {
      // Procedural soft cloud puff texture with concentric feathering
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 128;
      cloudCanvas.height = 128;
      const cctx = cloudCanvas.getContext('2d');
      if (cctx) {
        const rad = cctx.createRadialGradient(64, 64, 4, 64, 64, 62);
        rad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
        rad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
        rad.addColorStop(0.48, 'rgba(255, 255, 255, 0.45)');
        rad.addColorStop(0.72, 'rgba(255, 255, 255, 0.16)');
        rad.addColorStop(0.92, 'rgba(255, 255, 255, 0.02)');
        rad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
        cctx.fillStyle = rad;
        cctx.beginPath();
        cctx.arc(64, 64, 62, 0, Math.PI * 2);
        cctx.fill();
      }
      const cloudPuffTex = new THREE.CanvasTexture(cloudCanvas);

      // Cloud materials: core lit crown, ambient mid-body, and shaded underbelly
      const coreCloudMat = new THREE.SpriteMaterial({
        map: cloudPuffTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
        fog: false
      });
      const ambientCloudMat = new THREE.SpriteMaterial({
        map: cloudPuffTex,
        color: 0xf5eee0,
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
        fog: false
      });
      const baseCloudMat = new THREE.SpriteMaterial({
        map: cloudPuffTex,
        color: 0xd2c0b0,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        fog: false
      });

      cloudMaterialsRef.current = [coreCloudMat, ambientCloudMat, baseCloudMat];

      const masterCloudsGroup = new THREE.Group();
      scene.add(masterCloudsGroup);

      // 10 realistic cumulus cloud banks distributed across sky elevations
      const cloudPresets = [
        // Front & mid-canopy cumulus drifting over the courtyard & estate
        { x: -35, y: 32, z: -15, width: 50, height: 16, depth: 18, puffs: 15, speed: 0.38 },
        { x: 30, y: 36, z: -30, width: 56, height: 18, depth: 20, puffs: 16, speed: 0.32 },
        { x: -75, y: 35, z: -25, width: 48, height: 15, depth: 18, puffs: 14, speed: 0.36 },

        // Towering mid-altitude cumulus banks
        { x: 10, y: 46, z: -65, width: 72, height: 24, depth: 24, puffs: 20, speed: 0.24 },
        { x: -50, y: 50, z: -85, width: 80, height: 26, depth: 25, puffs: 22, speed: 0.22 },
        { x: 65, y: 44, z: -75, width: 68, height: 22, depth: 22, puffs: 18, speed: 0.26 },

        // Majestic distant horizon cloud shelves over the village & hills
        { x: -105, y: 28, z: -125, width: 90, height: 22, depth: 26, puffs: 24, speed: 0.16 },
        { x: 5, y: 26, z: -145, width: 105, height: 24, depth: 28, puffs: 26, speed: 0.14 },
        { x: 95, y: 30, z: -120, width: 88, height: 21, depth: 25, puffs: 22, speed: 0.17 },

        // Ambient sky frame clouds
        { x: 80, y: 38, z: -10, width: 44, height: 15, depth: 16, puffs: 14, speed: 0.34 }
      ];

      const clouds: CloudFormation[] = [];

      cloudPresets.forEach((preset, idx) => {
        const bankGroup = new THREE.Group();
        bankGroup.position.set(preset.x, preset.y, preset.z);

        // Generate organic billowy puffs within the preset bounds
        for (let p = 0; p < preset.puffs; p++) {
          // Normalize position within the cloud bank: center mound + tapered edges
          const relX = (Math.random() - 0.5) * preset.width;
          const edgeDist = Math.abs(relX) / (preset.width * 0.5);
          const moundHeight = (1 - edgeDist * 0.7) * (preset.height * 0.5);
          const relY = (Math.random() - 0.45) * moundHeight;
          const relZ = (Math.random() - 0.5) * preset.depth * (1 - edgeDist * 0.5);

          // Select material: upper crowns are core lit, lower base are shadowed, mid are ambient
          let puffMat = ambientCloudMat;
          if (relY > moundHeight * 0.25) {
            puffMat = coreCloudMat;
          } else if (relY < -moundHeight * 0.25) {
            puffMat = baseCloudMat;
          }

          const sprite = new THREE.Sprite(puffMat);
          sprite.position.set(relX, relY, relZ);

          // Puffs near center are larger, edge puffs are wispy
          const scaleBase = 18 + (1 - edgeDist) * 14 + Math.random() * 6;
          const scaleY = scaleBase * (0.65 + Math.random() * 0.25);
          sprite.scale.set(scaleBase, scaleY, 1);

          bankGroup.add(sprite);
        }

        masterCloudsGroup.add(bankGroup);

        clouds.push({
          group: bankGroup,
          speed: preset.speed,
          baseY: preset.y,
          phase: idx * 0.75 + Math.random() * 0.5
        });
      });

      cloudsListRef.current = clouds;
    };

    buildVolumetricCloudsSystem();

    // Apply initial mood
    applyAtmosphericMood(mood, scene);

    // Resize Handler for dynamic aspect ratio and pixel ratio scaling
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      updateCameraResponsive(cameraRef.current, w, h);
      rendererRef.current.setSize(w, h);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // ResizeObserver ensures smooth WebGL resizing during CSS transitions, layout shifts, or fullscreen toggles
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    const handleFullscreenSync = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(handleResize, 50);
    };
    document.addEventListener('fullscreenchange', handleFullscreenSync);
    document.addEventListener('webkitfullscreenchange', handleFullscreenSync);

    // Animation Loop
    let tourTime = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Animate Swimming Pool Water, Floating Tube & Swimmers
      if (poolWaterRef.current) {
        const geom = poolWaterRef.current.geometry as THREE.PlaneGeometry;
        const posAttr = geom.attributes.position;
        const scrollRipple = Math.abs(scrollPhysicsRef.current.normalizedVelocity) * 0.08;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const v = posAttr.getY(i);
          const z = Math.sin(u * 1.5 + elapsedTime * 2.5) * 0.04 +
                    Math.cos(v * 1.8 + elapsedTime * 2.0) * 0.03 +
                    Math.sin((u + v) * 2.0 + elapsedTime * 3.0) * (0.02 + scrollRipple);
          posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      if (poolTubeRef.current) {
        poolTubeRef.current.position.y = -0.15 + Math.sin(elapsedTime * 1.8) * 0.02;
        poolTubeRef.current.rotation.z = Math.sin(elapsedTime * 1.2) * 0.05;
        poolTubeRef.current.rotation.x = Math.cos(elapsedTime * 1.0) * 0.04;
      }

      // Animate Rustic Windmill Sails & Gentle Fireflies
      if (windmillSailsRef.current) {
        windmillSailsRef.current.rotation.z += delta * 0.35;
      }

      if (firefliesRef.current) {
        const fireflyPos = firefliesRef.current.geometry.attributes.position;
        if (fireflyPos) {
          for (let f = 0; f < fireflyPos.count; f++) {
            const curY = fireflyPos.getY(f);
            fireflyPos.setY(f, curY + Math.sin(elapsedTime * 2.2 + f * 0.7) * 0.005);
          }
          fireflyPos.needsUpdate = true;
        }
      }

      // Animate Peaceful Atmospheric Clouds Drifting Eastward Across the Sky
      if (cloudsListRef.current.length > 0) {
        cloudsListRef.current.forEach((cloud) => {
          cloud.group.position.x += delta * (cloud.speed * 3.8);
          // Subtle organic breathing motion
          cloud.group.position.y = cloud.baseY + Math.sin(elapsedTime * 0.16 + cloud.phase) * 0.8;
          // Seamless sky wrapping
          if (cloud.group.position.x > 140) {
            cloud.group.position.x = -140;
          }
        });
      }

      // Camera Movement Logic
      const scrollPitch = scrollPhysicsRef.current.normalizedVelocity * 1.2;
      if (isCinematicTour) {
        tourTime += delta * 0.22;
        const radius = 24;
        const camX = Math.cos(tourTime) * radius;
        const camZ = Math.sin(tourTime) * radius;
        const camY = 10 + Math.sin(tourTime * 1.4) * 3 + scrollPitch;
        camera.position.set(camX, camY, camZ);
        currentLookAt.current.set(0, 1.8, 0);
        camera.lookAt(currentLookAt.current);
      } else {
        // Orbit or Lerp to active Hotspot
        camera.position.lerp(targetCamPos.current, 0.04);
        currentLookAt.current.lerp(targetLookAt.current, 0.04);

        const parallaxX = mousePos.current.x * 1.8;
        const parallaxY = mousePos.current.y * 1.2 + scrollPitch;
        camera.position.x += (targetCamPos.current.x + parallaxX - camera.position.x) * 0.02;
        camera.position.y += (targetCamPos.current.y + parallaxY - camera.position.y) * 0.02;

        camera.lookAt(currentLookAt.current);
      }

      // Dynamically project 3D Hotspot positions (throttled for 60 FPS performance)
      if (Math.floor(elapsedTime * 30) % 2 === 0) {
        const curWidth = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
        const curHeight = containerRef.current ? containerRef.current.clientHeight : window.innerHeight;
        projectHotspotsToScreen(camera, curWidth, curHeight);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenSync);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenSync);
      if (resizeObserver) resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (compressionPipelineRef.current) {
        compressionPipelineRef.current.dispose();
        compressionPipelineRef.current = null;
      }
      renderer.dispose();
    };
  }, []);

  // Update canvas size whenever fullscreen state or landscape rotation changes
  useEffect(() => {
    const handleImmediateResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const frameId = requestAnimationFrame(handleImmediateResize);
    const timeoutId = setTimeout(handleImmediateResize, 60);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [isFullscreen, shouldRotateLandscape]);

  // Update Mood Lighting
  useEffect(() => {
    if (!sceneRef.current) return;
    applyAtmosphericMood(mood, sceneRef.current);
  }, [mood]);

  // Update Render Style (Pixar vs Cel-Shaded vs Realistic)
  useEffect(() => {
    applyRenderStyle(renderStyle);
  }, [renderStyle]);

  // Apply Atmospheric Mood (Sun, Sunset, Night with real Cyan Sconces)
  const applyAtmosphericMood = (currentMood: AtmosphericMood, scene: THREE.Scene) => {
    const isNight = currentMood === 'night';
    const isGolden = currentMood === 'golden';
    const isAutumn = currentMood === 'autumn';

    if (ambientLightRef.current && dirLightRef.current && hemisphereLightRef.current) {
      if (isNight) {
        // Night Mode matching the real night photo: dark ambient, moonlight, intense cyan sconces & pool glow
        ambientLightRef.current.color.setHex(0x101b24);
        ambientLightRef.current.intensity = 0.4;

        hemisphereLightRef.current.color.setHex(0x1a2b3c);
        hemisphereLightRef.current.groundColor.setHex(0x081014);
        hemisphereLightRef.current.intensity = 0.5;

        dirLightRef.current.color.setHex(0x6ba4d9);
        dirLightRef.current.intensity = 0.6;
        dirLightRef.current.position.set(-20, 25, -15);

        scene.background = new THREE.Color(0x0e1724);
        if (scene.fog) {
          (scene.fog as THREE.FogExp2).color.setHex(0x0e1724);
        }
      } else if (isGolden) {
        // Golden Hour sunset warming yellow facade
        ambientLightRef.current.color.setHex(0xffddaa);
        ambientLightRef.current.intensity = 0.9;

        hemisphereLightRef.current.color.setHex(0xffaa55);
        hemisphereLightRef.current.groundColor.setHex(0x4a2a14);
        hemisphereLightRef.current.intensity = 0.8;

        dirLightRef.current.color.setHex(0xffa834);
        dirLightRef.current.intensity = 2.4;
        dirLightRef.current.position.set(35, 20, 15);

        scene.background = new THREE.Color(0x281912);
        if (scene.fog) {
          (scene.fog as THREE.FogExp2).color.setHex(0x281912);
        }
      } else if (isAutumn) {
        ambientLightRef.current.color.setHex(0xf5e6cb);
        ambientLightRef.current.intensity = 0.8;

        hemisphereLightRef.current.color.setHex(0xd4a373);
        hemisphereLightRef.current.groundColor.setHex(0x3a2e1d);
        hemisphereLightRef.current.intensity = 0.7;

        dirLightRef.current.color.setHex(0xffd166);
        dirLightRef.current.intensity = 1.8;
        dirLightRef.current.position.set(20, 30, 25);

        scene.background = new THREE.Color(0x1a1914);
        if (scene.fog) {
          (scene.fog as THREE.FogExp2).color.setHex(0x1a1914);
        }
      } else {
        // Crisp Sunny Day (Dawn/Morning)
        ambientLightRef.current.color.setHex(0xffffff);
        ambientLightRef.current.intensity = 0.9;

        hemisphereLightRef.current.color.setHex(0xa8d5e5);
        hemisphereLightRef.current.groundColor.setHex(0x1a2430);
        hemisphereLightRef.current.intensity = 0.7;

        dirLightRef.current.color.setHex(0xfff6e6);
        dirLightRef.current.intensity = 2.0;
        dirLightRef.current.position.set(25, 35, 20);

        scene.background = new THREE.Color(0x0e1b29);
        if (scene.fog) {
          (scene.fog as THREE.FogExp2).color.setHex(0x0e1b29);
        }
      }
    }

    // Toggle pillar cyan sconces & underwater pool lights intensity
    pillarSconcesRef.current.forEach(light => {
      light.intensity = isNight ? 2.8 : (isGolden ? 1.2 : 0.1);
    });

    underwaterLightsRef.current.forEach(light => {
      light.color.setHex(0x0055ff);
      light.intensity = isNight ? 4.0 : (isGolden ? 3.0 : 2.4);
    });

    windowGlowLightsRef.current.forEach(light => {
      light.intensity = isNight ? 2.5 : (isGolden ? 1.8 : 0.4);
    });

    // Harmonize volumetric cloud color and radiance to time-of-day lighting
    if (cloudMaterialsRef.current.length >= 3) {
      const [coreMat, ambMat, baseMat] = cloudMaterialsRef.current;
      if (isNight) {
        // Moonlit silver-blue cloud banks with deep indigo under-shading
        coreMat.color.setHex(0x768fa8);
        coreMat.opacity = 0.50;
        ambMat.color.setHex(0x455a72);
        ambMat.opacity = 0.40;
        baseMat.color.setHex(0x1a2636);
        baseMat.opacity = 0.28;
      } else if (isGolden) {
        // Glowing amber-peach sunset crowns with warm terracotta shadows
        coreMat.color.setHex(0xffdfb8);
        coreMat.opacity = 0.88;
        ambMat.color.setHex(0xfba274);
        ambMat.opacity = 0.70;
        baseMat.color.setHex(0x9a5042);
        baseMat.opacity = 0.50;
      } else if (isAutumn) {
        // Mauve-twilight evening clouds
        coreMat.color.setHex(0xf5ded0);
        coreMat.opacity = 0.82;
        ambMat.color.setHex(0xcfa394);
        ambMat.opacity = 0.62;
        baseMat.color.setHex(0x6a4858);
        baseMat.opacity = 0.44;
      } else {
        // Fresh daylight: fluffy pure white crowns, soft sky-tinted ambient, gentle grey-blue base
        coreMat.color.setHex(0xffffff);
        coreMat.opacity = 0.80;
        ambMat.color.setHex(0xebf3f9);
        ambMat.opacity = 0.60;
        baseMat.color.setHex(0xc9d9e8);
        baseMat.opacity = 0.38;
      }
    }
  };

  // Apply Rendering Styles (Pixar, Cel-Shaded Toon, or Realistic PBR)
  const applyRenderStyle = (style: RenderStyle) => {
    allMeshMaterialsRef.current.forEach(({ mesh, originalMat, toonMat, pixarMat }) => {
      if (style === 'cel-shaded') {
        mesh.material = toonMat;
      } else if (style === 'pixar') {
        mesh.material = pixarMat;
      } else {
        mesh.material = originalMat;
      }
    });
  };

  // Project 3D Hotspot positions to 2D Screen
  const projectHotspotsToScreen = (camera: THREE.PerspectiveCamera, width: number, height: number) => {
    const tempV = new THREE.Vector3();
    const coords = LANDMARK_HOTSPOTS.map(h => {
      tempV.set(...h.targetPosition);
      tempV.project(camera);

      const isVisible = tempV.z < 1 && tempV.z > -1;
      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (-(tempV.y * 0.5) + 0.5) * height;

      return {
        id: h.id,
        name: h.name,
        category: h.category,
        x,
        y,
        visible: isVisible && x > 40 && x < width - 40 && y > 40 && y < height - 40
      };
    });

    setScreenHotspots(coords);
  };

  // Register mesh with multi-style materials for easy swapping
  const registerMultiStyleMesh = (
    mesh: THREE.Mesh,
    realMat: THREE.Material,
    toonMat: THREE.Material,
    pixarMat: THREE.Material
  ) => {
    allMeshMaterialsRef.current.push({
      mesh,
      originalMat: realMat,
      toonMat,
      pixarMat
    });
  };

  // Build the authentic Farmhouse 3D Model matching user's photos
  const buildCustomFarmhouseWorld = (scene: THREE.Scene) => {
    allMeshMaterialsRef.current = [];
    pillarSconcesRef.current = [];
    underwaterLightsRef.current = [];
    windowGlowLightsRef.current = [];

    // Helper: Create 3 versions of material (Realistic, Cel-Shaded, Pixar)
    const createMatSet = (
      realColor: number,
      options: {
        roughness?: number;
        metalness?: number;
        emissive?: number;
        emissiveIntensity?: number;
        toonColor?: number;
        pixarColor?: number;
        wireframe?: boolean;
      } = {}
    ) => {
      const {
        roughness = 0.5,
        metalness = 0.1,
        emissive = 0x000000,
        emissiveIntensity = 0,
        toonColor = realColor,
        pixarColor = realColor
      } = options;

      // Realistic PBR
      const realMat = new THREE.MeshStandardMaterial({
        color: realColor,
        roughness,
        metalness,
        emissive,
        emissiveIntensity
      });

      // Cel-Shaded Toon
      const toonMat = new THREE.MeshToonMaterial({
        color: toonColor,
        emissive,
        emissiveIntensity: emissiveIntensity * 1.2
      });

      // Pixar / Stylized (Saturated, smooth, subtle sheen)
      const pixarMat = new THREE.MeshStandardMaterial({
        color: pixarColor,
        roughness: Math.max(0.2, roughness * 0.7),
        metalness: Math.min(0.3, metalness * 1.2),
        emissive,
        emissiveIntensity: emissiveIntensity * 1.1
      });

      return { realMat, toonMat, pixarMat };
    };

    // 1. Manicured Emerald Lawn Ground with 100% Hollow Opening for Swimming Pool
    // Shifted pool rightwards towards the corner of the poolside bedroom building:
    // Pool area is X: [1.2, 11.8], Z: [1.05, 6.55]. We construct 4 perimeter lawn patches.
    const lawnMats = createMatSet(0x3e6828, {
      roughness: 0.85,
      metalness: 0.05
    });

    const createLawnPatch = (xMin: number, xMax: number, zMin: number, zMax: number) => {
      const w = xMax - xMin;
      const d = zMax - zMin;
      const geo = new THREE.PlaneGeometry(w, d, 8, 8);
      geo.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geo, lawnMats.realMat);
      mesh.position.set((xMin + xMax) / 2, 0, (zMin + zMax) / 2);
      mesh.receiveShadow = true;
      scene.add(mesh);
      registerMultiStyleMesh(mesh, lawnMats.realMat, lawnMats.toonMat, lawnMats.pixarMat);
      return mesh;
    };

    // North Lawn (Z from 6.55 to 45, full width X: -45 to 45)
    createLawnPatch(-45, 45, 6.55, 45);
    // South Lawn (Z from -45 to 1.05, full width X: -45 to 45)
    createLawnPatch(-45, 45, -45, 1.05);
    // West Lawn (Z between 1.05 and 6.55, X: -45 to 1.2) - Gives broad pathway space
    createLawnPatch(-45, 1.2, 1.05, 6.55);
    // East Lawn (Z between 1.05 and 6.55, X: 11.8 to 45)
    createLawnPatch(11.8, 45, 1.05, 6.55);

    // 2. Concrete / Stone Boundary Wall in the back & side (Bright Sunny Yellow as requested)
    const wallGeo = new THREE.BoxGeometry(70, 2.5, 0.4);
    const wallMats = createMatSet(0xf5b700, {
      roughness: 0.6
    });
    const backWall = new THREE.Mesh(wallGeo, wallMats.realMat);
    backWall.position.set(0, 1.25, -20);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);
    registerMultiStyleMesh(backWall, wallMats.realMat, wallMats.toonMat, wallMats.pixarMat);

    const sideWallGeo = new THREE.BoxGeometry(0.4, 2.5, 50);
    const sideWall = new THREE.Mesh(sideWallGeo, wallMats.realMat);
    sideWall.position.set(-25, 1.25, 5);
    sideWall.castShadow = true;
    sideWall.receiveShadow = true;
    scene.add(sideWall);
    registerMultiStyleMesh(sideWall, wallMats.realMat, wallMats.toonMat, wallMats.pixarMat);

    // Warm LED strip on top of perimeter wall (as seen in night photo)
    const ledStripGeo = new THREE.BoxGeometry(69.8, 0.08, 0.15);
    const ledStripMat = new THREE.MeshBasicMaterial({ color: 0xffe899 });
    const ledStrip = new THREE.Mesh(ledStripGeo, ledStripMat);
    ledStrip.position.set(0, 2.52, -19.9);
    scene.add(ledStrip);

    // ==========================================
    // 3. THE L-SHAPED VILLA ARCHITECTURE
    // ==========================================
    const villaGroup = new THREE.Group();
    villaGroupRef.current = villaGroup;
    scene.add(villaGroup);

    // Palettes matching the user's authentic farmhouse:
    // Primary Villa Body & Facades: Bright Sunflower Yellow (#f5b700)
    // Accent Wall / Geometric Mural base: Slate Charcoal Grey (#3f474e)
    // White Columns/Trims: Pure White (#ffffff)
    // Warm Wood Soffit: (#6a4427)
    // Slate Corrugated Gable Roof: (#2d3439)
    const yellowMats = createMatSet(0xf5b700, {
      roughness: 0.35,
      metalness: 0.05,
      toonColor: 0xffc800,
      pixarColor: 0xffbb00
    });
    const greyMats = createMatSet(0x404850, {
      roughness: 0.6,
      metalness: 0.1,
      toonColor: 0x48525b,
      pixarColor: 0x3a4249
    });
    const whiteMats = createMatSet(0xf8fafc, {
      roughness: 0.3,
      metalness: 0.05,
      toonColor: 0xffffff,
      pixarColor: 0xffffff
    });
    const woodMats = createMatSet(0x6b4423, {
      roughness: 0.7,
      metalness: 0.05,
      toonColor: 0x7a4d28,
      pixarColor: 0x734825
    });
    const roofMats = createMatSet(0x2d343a, {
      roughness: 0.5,
      metalness: 0.2,
      toonColor: 0x323a41,
      pixarColor: 0x282f35
    });
    const darkStonePlinthMats = createMatSet(0x23282b, {
      roughness: 0.8,
      toonColor: 0x2a3034,
      pixarColor: 0x222629
    });

    // --- A. Main Long Wing (Facing the pool along X-axis) ---
    // The main body walls are Bright Sunflower Yellow (side and back are yellow)
    const mainWingBaseGeo = new THREE.BoxGeometry(18, 4.2, 5.5);
    const mainWingBase = new THREE.Mesh(mainWingBaseGeo, yellowMats.realMat);
    mainWingBase.position.set(4, 2.1, -6);
    mainWingBase.castShadow = true;
    mainWingBase.receiveShadow = true;
    villaGroup.add(mainWingBase);
    registerMultiStyleMesh(mainWingBase, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    // Front Feature Accent Wall in Charcoal Grey with Yellow Geometric Murals
    const frontAccentWallGeo = new THREE.BoxGeometry(11.5, 4.2, 0.08);
    const frontAccentWall = new THREE.Mesh(frontAccentWallGeo, greyMats.realMat);
    frontAccentWall.position.set(1.5, 2.1, -3.22);
    villaGroup.add(frontAccentWall);
    registerMultiStyleMesh(frontAccentWall, greyMats.realMat, greyMats.toonMat, greyMats.pixarMat);

    // Signature Geometric Murals (Triangular & Chevron yellow murals on grey accent wall)
    const triangleGeo = new THREE.ConeGeometry(2.0, 2.8, 3);
    triangleGeo.rotateZ(Math.PI);
    const triangleMural1 = new THREE.Mesh(triangleGeo, yellowMats.realMat);
    triangleMural1.position.set(0.5, 2.1, -3.17);
    triangleMural1.scale.set(1, 0.9, 0.02);
    villaGroup.add(triangleMural1);
    registerMultiStyleMesh(triangleMural1, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    const triangleMural2 = new THREE.Mesh(triangleGeo, yellowMats.realMat);
    triangleMural2.position.set(4.5, 2.2, -3.17);
    triangleMural2.scale.set(1.3, 1.1, 0.02);
    triangleMural2.rotateZ(Math.PI);
    villaGroup.add(triangleMural2);
    registerMultiStyleMesh(triangleMural2, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    // --- B. Perpendicular Side Wing (Forms the L-Junction) ---
    // All walls (side, back, outer) are Bright Sunflower Yellow
    const sideWingBaseGeo = new THREE.BoxGeometry(5.5, 4.2, 10);
    const sideWingBase = new THREE.Mesh(sideWingBaseGeo, yellowMats.realMat);
    sideWingBase.position.set(-6, 2.1, 0.5);
    sideWingBase.castShadow = true;
    sideWingBase.receiveShadow = true;
    villaGroup.add(sideWingBase);
    registerMultiStyleMesh(sideWingBase, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    // --- C. Pitched Roofs (Accurately Proportioned & Positioned Gable Roofs) ---
    // Helper function to create exact triangular prism gable roofs centered at base
    const createGableRoofPrism = (axis: 'X' | 'Z', lengthAlongAxis: number, crossSectionWidth: number, height: number) => {
      const shape = new THREE.Shape();
      const halfW = crossSectionWidth / 2;
      shape.moveTo(-halfW, 0);
      shape.lineTo(0, height);
      shape.lineTo(halfW, 0);
      shape.closePath();

      const geom = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: lengthAlongAxis,
        bevelEnabled: false
      });

      if (axis === 'X') {
        geom.center();
        geom.rotateY(Math.PI / 2);
        geom.translate(0, height / 2, 0);
      } else {
        geom.center();
        geom.translate(0, height / 2, 0);
      }
      return geom;
    };

    const createGableTriangleGeo = (width: number, height: number) => {
      const shape = new THREE.Shape();
      const halfW = width / 2;
      shape.moveTo(-halfW, 0);
      shape.lineTo(0, height);
      shape.lineTo(halfW, 0);
      shape.closePath();
      return new THREE.ShapeGeometry(shape);
    };

    // 1. Long Wing Gable Roof (Sits right on top of main wing walls at Y = 4.2, X = 4, Z = -6)
    const mainRoofGeo = createGableRoofPrism('X', 18.4, 5.8, 2.0);
    const mainRoof = new THREE.Mesh(mainRoofGeo, roofMats.realMat);
    mainRoof.position.set(4, 4.2, -6);
    mainRoof.castShadow = true;
    villaGroup.add(mainRoof);
    registerMultiStyleMesh(mainRoof, roofMats.realMat, roofMats.toonMat, roofMats.pixarMat);

    // Main long wing right end gable (yellow triangular wall end)
    const mainRightGableGeo = createGableTriangleGeo(5.5, 2.0);
    const mainRightGable = new THREE.Mesh(mainRightGableGeo, yellowMats.realMat);
    mainRightGable.position.set(13.01, 4.2, -6);
    mainRightGable.rotation.y = Math.PI / 2;
    villaGroup.add(mainRightGable);
    registerMultiStyleMesh(mainRightGable, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    // 2. Side Wing Gable Roof (Sits right on top of side wing walls at Y = 4.2, X = -6, Z = 0.5)
    const sideRoofGeo = createGableRoofPrism('Z', 10.4, 5.8, 2.0);
    const sideRoof = new THREE.Mesh(sideRoofGeo, roofMats.realMat);
    sideRoof.position.set(-6, 4.2, 0.5);
    sideRoof.castShadow = true;
    villaGroup.add(sideRoof);
    registerMultiStyleMesh(sideRoof, roofMats.realMat, roofMats.toonMat, roofMats.pixarMat);

    // Side wing front gable (yellow triangular wall facing pool & front lawn)
    const sideFrontGableGeo = createGableTriangleGeo(5.5, 2.0);
    const sideFrontGable = new THREE.Mesh(sideFrontGableGeo, yellowMats.realMat);
    sideFrontGable.position.set(-6, 4.2, 5.51);
    villaGroup.add(sideFrontGable);
    registerMultiStyleMesh(sideFrontGable, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    // Side wing back gable (yellow triangular wall facing back)
    const sideBackGableGeo = createGableTriangleGeo(5.5, 2.0);
    const sideBackGable = new THREE.Mesh(sideBackGableGeo, yellowMats.realMat);
    sideBackGable.position.set(-6, 4.2, -4.51);
    sideBackGable.rotation.y = Math.PI;
    villaGroup.add(sideBackGable);
    registerMultiStyleMesh(sideBackGable, yellowMats.realMat, yellowMats.toonMat, yellowMats.pixarMat);

    // --- D. Raised Veranda Porch & Extended Roofs Over Pillars ---
    // 1. Long Wing (Poolside Bedroom) Veranda Plinth (Dark Granite Coping Edge)
    const verandaPlinthGeo = new THREE.BoxGeometry(17.2, 0.6, 3.4);
    const verandaPlinth = new THREE.Mesh(verandaPlinthGeo, darkStonePlinthMats.realMat);
    verandaPlinth.position.set(3.8, 0.3, -1.6);
    verandaPlinth.receiveShadow = true;
    villaGroup.add(verandaPlinth);
    registerMultiStyleMesh(verandaPlinth, darkStonePlinthMats.realMat, darkStonePlinthMats.toonMat, darkStonePlinthMats.pixarMat);

    // 2. Side Wing (Main Villa) Veranda Plinth
    const sideVerandaPlinthGeo = new THREE.BoxGeometry(3.4, 0.6, 10.2);
    const sideVerandaPlinth = new THREE.Mesh(sideVerandaPlinthGeo, darkStonePlinthMats.realMat);
    sideVerandaPlinth.position.set(-1.6, 0.3, 0.6);
    sideVerandaPlinth.receiveShadow = true;
    villaGroup.add(sideVerandaPlinth);
    registerMultiStyleMesh(sideVerandaPlinth, darkStonePlinthMats.realMat, darkStonePlinthMats.toonMat, darkStonePlinthMats.pixarMat);

    // Long Wing Veranda Wood Soffit Ceiling (Extending fully to the outer end of the 3 pillars at Z = 0.05)
    const soffitGeo = new THREE.BoxGeometry(17.2, 0.22, 3.45);
    const soffit = new THREE.Mesh(soffitGeo, woodMats.realMat);
    soffit.position.set(3.8, 4.0, -1.6);
    soffit.castShadow = true;
    soffit.receiveShadow = true;
    villaGroup.add(soffit);
    registerMultiStyleMesh(soffit, woodMats.realMat, woodMats.toonMat, woodMats.pixarMat);

    // Long Wing Extended Tiled Veranda Roof (Sloping from main house down to pillar ends with overhang)
    const mainVerandaRoofGeo = new THREE.BoxGeometry(17.4, 0.2, 3.55);
    const mainVerandaRoof = new THREE.Mesh(mainVerandaRoofGeo, roofMats.realMat);
    mainVerandaRoof.position.set(3.8, 4.18, -1.6);
    mainVerandaRoof.rotation.x = -0.05; // Gentle realistic roof pitch
    mainVerandaRoof.castShadow = true;
    villaGroup.add(mainVerandaRoof);
    registerMultiStyleMesh(mainVerandaRoof, roofMats.realMat, roofMats.toonMat, roofMats.pixarMat);

    // Long Wing Veranda Dark Tile Fascia Eaves Trim (Running along outer pillar edge at Z = 0.15)
    const mainFasciaGeo = new THREE.BoxGeometry(17.4, 0.32, 0.12);
    const mainFascia = new THREE.Mesh(mainFasciaGeo, roofMats.realMat);
    mainFascia.position.set(3.8, 4.05, 0.15);
    mainFascia.castShadow = true;
    villaGroup.add(mainFascia);
    registerMultiStyleMesh(mainFascia, roofMats.realMat, roofMats.toonMat, roofMats.pixarMat);

    // Side Wing (Main Villa) Wood Soffit Ceiling (Extending fully to the outer end of the 2 pillars at X = 0.05)
    const sideSoffitGeo = new THREE.BoxGeometry(3.45, 0.22, 10.4);
    const sideSoffit = new THREE.Mesh(sideSoffitGeo, woodMats.realMat);
    sideSoffit.position.set(-1.6, 4.0, 0.6);
    sideSoffit.castShadow = true;
    sideSoffit.receiveShadow = true;
    villaGroup.add(sideSoffit);
    registerMultiStyleMesh(sideSoffit, woodMats.realMat, woodMats.toonMat, woodMats.pixarMat);

    // Side Wing Extended Tiled Veranda Roof (Sloping from side house down to pillar ends with overhang)
    const sideVerandaRoofGeo = new THREE.BoxGeometry(3.55, 0.2, 10.5);
    const sideVerandaRoof = new THREE.Mesh(sideVerandaRoofGeo, roofMats.realMat);
    sideVerandaRoof.position.set(-1.6, 4.18, 0.6);
    sideVerandaRoof.rotation.z = 0.05; // Gentle realistic roof pitch
    sideVerandaRoof.castShadow = true;
    villaGroup.add(sideVerandaRoof);
    registerMultiStyleMesh(sideVerandaRoof, roofMats.realMat, roofMats.toonMat, roofMats.pixarMat);

    // Side Wing Veranda Dark Tile Fascia Eaves Trim (Running along outer pillar edge at X = 0.15)
    const sideFasciaGeo = new THREE.BoxGeometry(0.12, 0.32, 10.5);
    const sideFascia = new THREE.Mesh(sideFasciaGeo, roofMats.realMat);
    sideFascia.position.set(0.15, 4.05, 0.6);
    sideFascia.castShadow = true;
    villaGroup.add(sideFascia);
    registerMultiStyleMesh(sideFascia, roofMats.realMat, roofMats.toonMat, roofMats.pixarMat);

    // --- E. Prominent White Veranda Pillars with Cyan LED Wall Sconces ---
    // User Specification: 3 pillars on the poolside bedroom veranda + 2 pillars on the main villa veranda
    const pillarGeo = new THREE.BoxGeometry(0.55, 3.7, 0.55);

    // 1. Three (3) Pillars on Poolside Bedroom Wing (Along X at Z = -0.4)
    const poolsidePillarX = [0.2, 4.8, 9.4];
    poolsidePillarX.forEach((posX) => {
      const pillar = new THREE.Mesh(pillarGeo, whiteMats.realMat);
      pillar.position.set(posX, 2.15, -0.4);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      villaGroup.add(pillar);
      registerMultiStyleMesh(pillar, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Cyan / Turquoise Up-Down LED Wall Sconce mounted on pillar
      const sconceFixtureGeo = new THREE.BoxGeometry(0.12, 0.35, 0.12);
      const sconceFixtureMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const sconceFixture = new THREE.Mesh(sconceFixtureGeo, sconceFixtureMat);
      sconceFixture.position.set(posX, 2.4, -0.1);
      villaGroup.add(sconceFixture);

      const sconceLight = new THREE.PointLight(0x00f5ff, 0.25, 9, 1.8);
      sconceLight.position.set(posX, 2.4, 0.15);
      villaGroup.add(sconceLight);
      pillarSconcesRef.current.push(sconceLight);
    });

    // 2. Two (2) Pillars on Main Villa Wing (Along Z at X = -0.4)
    const mainVillaPillarZ = [1.2, 4.5];
    mainVillaPillarZ.forEach((posZ) => {
      const pillar = new THREE.Mesh(pillarGeo, whiteMats.realMat);
      pillar.position.set(-0.4, 2.15, posZ);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      villaGroup.add(pillar);
      registerMultiStyleMesh(pillar, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Cyan Sconce on front-facing side of pillar
      const sconceFixtureGeo = new THREE.BoxGeometry(0.12, 0.35, 0.12);
      const sconceFixtureMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const sconceFixture = new THREE.Mesh(sconceFixtureGeo, sconceFixtureMat);
      sconceFixture.position.set(-0.1, 2.4, posZ);
      villaGroup.add(sconceFixture);

      const sconceLight = new THREE.PointLight(0x00f5ff, 0.25, 9, 1.8);
      sconceLight.position.set(0.15, 2.4, posZ);
      villaGroup.add(sconceLight);
      pillarSconcesRef.current.push(sconceLight);
    });

    // --- F. Authentic Windows & Doors Matching Actual Cottage Photo ---
    // --- F. Authentic Windows & Doors Matching Actual Cottage Photo ---
    // High-Fidelity Architectural Glass Materials
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x8ec5ec, // Crisp architectural sky-reflecting float glass
      metalness: 0.22,
      roughness: 0.04, // Mirror-smooth polished glass
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.68,
      reflectivity: 0.98,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const glassToonMat = new THREE.MeshToonMaterial({
      color: 0x90caf9,
      transparent: true,
      opacity: 0.72
    });

    const glassPixarMat = new THREE.MeshStandardMaterial({
      color: 0x7eb8e8,
      roughness: 0.08,
      metalness: 0.2,
      transparent: true,
      opacity: 0.70
    });

    const glassGlintMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const interiorRoomMat = new THREE.MeshStandardMaterial({
      color: 0x141a22, // Deep charcoal room interior
      roughness: 0.9,
      metalness: 0.05
    });

    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0xebdcc4, // Warm natural linen luxury drapery
      roughness: 0.8,
      metalness: 0.0
    });

    const doorMats = createMatSet(0x2a1a0e, { roughness: 0.6 });

    // Helper: Build Hollow, Deep, Glazed Architectural Windows with Real 3D Glass Panes, Interior Depth & Curtains
    const buildGlazedWindow = (
      parent: THREE.Group,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      rotationY: number = 0,
      hasRoomLight: boolean = true
    ) => {
      const winGroup = new THREE.Group();
      winGroup.position.set(x, y, z);
      if (rotationY !== 0) {
        winGroup.rotation.y = rotationY;
      }
      parent.add(winGroup);

      const frameThick = 0.09;
      const frameDepth = 0.10;
      const innerW = w - 2 * frameThick;
      const innerH = h - 2 * frameThick;
      const halfInnerW = innerW / 2;

      // 1. Hollow White Casing (4 perimeter pieces around the glass aperture)
      // Top Header
      const topGeo = new THREE.BoxGeometry(w, frameThick, frameDepth);
      const topMesh = new THREE.Mesh(topGeo, whiteMats.realMat);
      topMesh.position.set(0, h / 2 - frameThick / 2, 0.02);
      winGroup.add(topMesh);
      registerMultiStyleMesh(topMesh, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Bottom Rail
      const botGeo = new THREE.BoxGeometry(w, frameThick, frameDepth);
      const botMesh = new THREE.Mesh(botGeo, whiteMats.realMat);
      botMesh.position.set(0, -h / 2 + frameThick / 2, 0.02);
      winGroup.add(botMesh);
      registerMultiStyleMesh(botMesh, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Left Jamb
      const jambGeo = new THREE.BoxGeometry(frameThick, innerH, frameDepth);
      const leftMesh = new THREE.Mesh(jambGeo, whiteMats.realMat);
      leftMesh.position.set(-w / 2 + frameThick / 2, 0, 0.02);
      winGroup.add(leftMesh);
      registerMultiStyleMesh(leftMesh, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Right Jamb
      const rightMesh = new THREE.Mesh(jambGeo, whiteMats.realMat);
      rightMesh.position.set(w / 2 - frameThick / 2, 0, 0.02);
      winGroup.add(rightMesh);
      registerMultiStyleMesh(rightMesh, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Projecting Architectural Sill Shelf
      const sillGeo = new THREE.BoxGeometry(w + 0.16, 0.08, frameDepth + 0.10);
      const sillMesh = new THREE.Mesh(sillGeo, whiteMats.realMat);
      sillMesh.position.set(0, -h / 2 - 0.04, 0.06);
      winGroup.add(sillMesh);
      registerMultiStyleMesh(sillMesh, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // Center Vertical Dividing Mullion
      const mullionGeo = new THREE.BoxGeometry(0.06, innerH, frameDepth * 0.7);
      const mullionMesh = new THREE.Mesh(mullionGeo, whiteMats.realMat);
      mullionMesh.position.set(0, 0, 0.025);
      winGroup.add(mullionMesh);
      registerMultiStyleMesh(mullionMesh, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      // 2. Interior Room Backing & Depth (Inside the room behind glass)
      const roomBackGeo = new THREE.BoxGeometry(innerW + 0.02, innerH + 0.02, 0.02);
      const roomBack = new THREE.Mesh(roomBackGeo, interiorRoomMat);
      roomBack.position.set(0, 0, -0.05);
      winGroup.add(roomBack);

      // Warm linen curtains (Left & Right inside window)
      const curtainGeo = new THREE.BoxGeometry(innerW * 0.18, innerH, 0.02);
      const curtainL = new THREE.Mesh(curtainGeo, curtainMat);
      curtainL.position.set(-innerW / 2 + (innerW * 0.18) / 2, 0, -0.03);
      winGroup.add(curtainL);

      const curtainR = new THREE.Mesh(curtainGeo, curtainMat);
      curtainR.position.set(innerW / 2 - (innerW * 0.18) / 2, 0, -0.03);
      winGroup.add(curtainR);

      // 3. Physical 3D Glass Panes (Dual Panes: Left & Right)
      const paneW = halfInnerW - 0.03;
      const glassPaneGeo = new THREE.BoxGeometry(paneW, innerH, 0.015);

      const glassPaneL = new THREE.Mesh(glassPaneGeo, glassMat);
      glassPaneL.position.set(-paneW / 2 - 0.015, 0, 0.02);
      winGroup.add(glassPaneL);
      registerMultiStyleMesh(glassPaneL, glassMat, glassToonMat, glassPixarMat);

      const glassPaneR = new THREE.Mesh(glassPaneGeo, glassMat);
      glassPaneR.position.set(paneW / 2 + 0.015, 0, 0.02);
      winGroup.add(glassPaneR);
      registerMultiStyleMesh(glassPaneR, glassMat, glassToonMat, glassPixarMat);

      // 4. Architectural Glass Reflection Sheen Glints (Visible crisp specular reflection highlights)
      const glintGeo = new THREE.PlaneGeometry(paneW * 0.22, innerH * 0.90);
      glintGeo.rotateZ(Math.PI / 4.5);

      const glintL = new THREE.Mesh(glintGeo, glassGlintMat);
      glintL.position.set(-paneW / 2 - 0.015, 0, 0.032);
      winGroup.add(glintL);

      const glintR = new THREE.Mesh(glintGeo, glassGlintMat);
      glintR.position.set(paneW / 2 + 0.015, 0, 0.032);
      winGroup.add(glintR);

      // 5. Warm interior ambient glow light
      if (hasRoomLight) {
        const roomLight = new THREE.PointLight(0xffa726, 0.55, 7, 2.0);
        roomLight.position.set(0, 0, -0.8);
        winGroup.add(roomLight);
        windowGlowLightsRef.current.push(roomLight);
      }

      return winGroup;
    };

    // 1. MAIN VILLA FRONT FACADE (Facing Front Lawn at Z = 5.5, matching photo)
    // Front Two-Tone Wall: Grey accent wall section positioned behind the window on the left
    const frontGreyAccentGeo = new THREE.BoxGeometry(2.8, 4.2, 0.02);
    const frontGreyAccent = new THREE.Mesh(frontGreyAccentGeo, greyMats.realMat);
    frontGreyAccent.position.set(-7.35, 2.1, 5.51);
    villaGroup.add(frontGreyAccent);
    registerMultiStyleMesh(frontGreyAccent, greyMats.realMat, greyMats.toonMat, greyMats.pixarMat);

    // [A] Main Villa Front Window (LEFT SIDE of front facade at X = -7.3 on grey wall)
    buildGlazedWindow(villaGroup, -7.3, 2.15, 5.53, 1.85, 1.45, 0, true);

    // [B] Main Villa Front Entrance Door (RIGHT SIDE of front facade at X = -4.65 on yellow wall with white frame & canopy overhang)
    const frontDoorFrameGeo = new THREE.BoxGeometry(1.35, 2.7, 0.08);
    const frontDoorFrame = new THREE.Mesh(frontDoorFrameGeo, whiteMats.realMat);
    frontDoorFrame.position.set(-4.65, 1.4, 5.53);
    villaGroup.add(frontDoorFrame);
    registerMultiStyleMesh(frontDoorFrame, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

    const frontDoorLeafGeo = new THREE.BoxGeometry(1.15, 2.5, 0.08);
    const frontDoorLeaf = new THREE.Mesh(frontDoorLeafGeo, doorMats.realMat);
    frontDoorLeaf.position.set(-4.65, 1.4, 5.55);
    villaGroup.add(frontDoorLeaf);
    registerMultiStyleMesh(frontDoorLeaf, doorMats.realMat, doorMats.toonMat, doorMats.pixarMat);

    // Distinctive White Overhead Canopy Shelf (Extending out over front entrance door at X = -4.65)
    const frontDoorCanopyGeo = new THREE.BoxGeometry(1.65, 0.14, 0.7);
    const frontDoorCanopy = new THREE.Mesh(frontDoorCanopyGeo, whiteMats.realMat);
    frontDoorCanopy.position.set(-4.65, 2.8, 5.86);
    frontDoorCanopy.castShadow = true;
    villaGroup.add(frontDoorCanopy);
    registerMultiStyleMesh(frontDoorCanopy, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

    // Door glass horizontal lites / slats with real glass panes, white trim, dark backing, and glass reflection glints
    for (let g = 0; g < 4; g++) {
      const slatY = 0.65 + g * 0.46;
      const slatTrimGeo = new THREE.BoxGeometry(0.88, 0.30, 0.02);
      const slatTrim = new THREE.Mesh(slatTrimGeo, whiteMats.realMat);
      slatTrim.position.set(-4.65, slatY, 5.59);
      villaGroup.add(slatTrim);
      registerMultiStyleMesh(slatTrim, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      const slatBackGeo = new THREE.BoxGeometry(0.82, 0.24, 0.01);
      const slatBack = new THREE.Mesh(slatBackGeo, interiorRoomMat);
      slatBack.position.set(-4.65, slatY, 5.595);
      villaGroup.add(slatBack);

      const slatGlassGeo = new THREE.BoxGeometry(0.82, 0.24, 0.015);
      const slatGlass = new THREE.Mesh(slatGlassGeo, glassMat);
      slatGlass.position.set(-4.65, slatY, 5.605);
      villaGroup.add(slatGlass);
      registerMultiStyleMesh(slatGlass, glassMat, glassToonMat, glassPixarMat);

      const slatGlintGeo = new THREE.PlaneGeometry(0.12, 0.22);
      slatGlintGeo.rotateZ(Math.PI / 4.5);
      const slatGlint = new THREE.Mesh(slatGlintGeo, glassGlintMat);
      slatGlint.position.set(-4.65, slatY, 5.615);
      villaGroup.add(slatGlint);
    }

    // Door Handle (Right edge of front door leaf at X = -4.23)
    const frontDoorHandleGeo = new THREE.BoxGeometry(0.04, 0.45, 0.06);
    const frontDoorHandle = new THREE.Mesh(frontDoorHandleGeo, darkStonePlinthMats.realMat);
    frontDoorHandle.position.set(-4.23, 1.35, 5.60);
    villaGroup.add(frontDoorHandle);

    // [C] Main Villa Outer Left Wall Window (Visible on far left of photo on grey wall)
    buildGlazedWindow(villaGroup, -8.78, 2.15, 2.2, 1.6, 1.45, -Math.PI / 2, true);

    // 2. BEDROOM SUITES & POOL WING FACADE (Facing Pool at Z = -3.14, with prominent white-trimmed glazed windows)
    // Positioned in front of the wall (Z = -3.18) so glass panes, reflection glints, sills & curtains are crisply visible
    buildGlazedWindow(villaGroup, -0.5, 2.15, -3.14, 2.1, 1.45, 0, true);
    buildGlazedWindow(villaGroup, 2.35, 2.15, -3.14, 2.2, 1.45, 0, true);
    buildGlazedWindow(villaGroup, 5.2, 2.15, -3.14, 2.2, 1.45, 0, true);
    buildGlazedWindow(villaGroup, 8.1, 2.15, -3.14, 2.3, 1.45, 0, true);

    // Inner Courtyard Veranda Bedroom Windows (Along inner corridor facing pool at X = -3.21)
    buildGlazedWindow(villaGroup, -3.21, 2.15, 2.2, 1.8, 1.4, Math.PI / 2, true);

    // 3. BEDROOM OUTER EAST WING END (Facing East Garden at X = 13.04 with panoramic morning windows)
    buildGlazedWindow(villaGroup, 13.04, 2.15, -4.8, 2.2, 1.45, Math.PI / 2, true);
    buildGlazedWindow(villaGroup, 13.04, 2.15, -7.2, 2.2, 1.45, Math.PI / 2, true);

    // 4. BEDROOM REAR WALL (Facing North Garden at Z = -8.78 with garden view windows)
    buildGlazedWindow(villaGroup, 1.2, 2.15, -8.78, 2.1, 1.4, Math.PI, true);
    buildGlazedWindow(villaGroup, 6.0, 2.15, -8.78, 2.1, 1.4, Math.PI, true);
    buildGlazedWindow(villaGroup, 10.4, 2.15, -8.78, 2.1, 1.4, Math.PI, true);

    // Pool Wing Far-Right Bedroom Terrace Door with Crisp White Frame and Glazed Glass Panels
    const poolDoorFrameGeo = new THREE.BoxGeometry(1.4, 2.7, 0.08);
    const poolDoorFrame = new THREE.Mesh(poolDoorFrameGeo, whiteMats.realMat);
    poolDoorFrame.position.set(11.2, 1.6, -3.16);
    villaGroup.add(poolDoorFrame);
    registerMultiStyleMesh(poolDoorFrame, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

    const poolDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 0.08), doorMats.realMat);
    poolDoorLeaf.position.set(11.2, 1.6, -3.14);
    villaGroup.add(poolDoorLeaf);
    registerMultiStyleMesh(poolDoorLeaf, doorMats.realMat, doorMats.toonMat, doorMats.pixarMat);

    // Door glass horizontal lites on bedroom terrace door
    for (let g = 0; g < 4; g++) {
      const slatY = 0.85 + g * 0.46;
      const slatTrimGeo = new THREE.BoxGeometry(0.88, 0.30, 0.02);
      const slatTrim = new THREE.Mesh(slatTrimGeo, whiteMats.realMat);
      slatTrim.position.set(11.2, slatY, -3.10);
      villaGroup.add(slatTrim);
      registerMultiStyleMesh(slatTrim, whiteMats.realMat, whiteMats.toonMat, whiteMats.pixarMat);

      const slatBackGeo = new THREE.BoxGeometry(0.82, 0.24, 0.01);
      const slatBack = new THREE.Mesh(slatBackGeo, interiorRoomMat);
      slatBack.position.set(11.2, slatY, -3.095);
      villaGroup.add(slatBack);

      const slatGlassGeo = new THREE.BoxGeometry(0.82, 0.24, 0.015);
      const slatGlass = new THREE.Mesh(slatGlassGeo, glassMat);
      slatGlass.position.set(11.2, slatY, -3.085);
      villaGroup.add(slatGlass);
      registerMultiStyleMesh(slatGlass, glassMat, glassToonMat, glassPixarMat);

      const slatGlintGeo = new THREE.PlaneGeometry(0.12, 0.22);
      slatGlintGeo.rotateZ(Math.PI / 4.5);
      const slatGlint = new THREE.Mesh(slatGlintGeo, glassGlintMat);
      slatGlint.position.set(11.2, slatY, -3.075);
      villaGroup.add(slatGlint);
    }

    // Inner Corner Veranda Door with Glazed Upper Glass Panel
    const cornerDoor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 0.08), doorMats.realMat);
    cornerDoor.position.set(-3.21, 1.6, -0.6);
    cornerDoor.rotation.y = Math.PI / 2;
    villaGroup.add(cornerDoor);
    registerMultiStyleMesh(cornerDoor, doorMats.realMat, doorMats.toonMat, doorMats.pixarMat);

    // ==========================================
    // 4. THE HOLLOW SWIMMING POOL (Accurately Proportioned Azure Pool)
    // ==========================================
    // Pool dimensions: Length 10.2m (along X), Width 5.0m (along Z), Depth 1.6m
    // Shifted rightwards to X = 6.5, Z = 3.8 to align with the corner of the bedroom wing
    // This allows a broad 4.0m direct pathway on the left to the main villa
    const poolGroup = new THREE.Group();
    poolGroup.position.set(6.5, 0, 3.8);
    scene.add(poolGroup);

    // A. 4-Piece Granite Coping Curb (Forms the hollow raised frame around the pool opening)
    const poolCopingMats = createMatSet(0xe2e8f0, {
      roughness: 0.35,
      metalness: 0.05
    });

    const northCurbGeo = new THREE.BoxGeometry(10.8, 0.16, 0.4);
    const northCurb = new THREE.Mesh(northCurbGeo, poolCopingMats.realMat);
    northCurb.position.set(0, 0.08, 2.45);
    northCurb.receiveShadow = true;
    poolGroup.add(northCurb);
    registerMultiStyleMesh(northCurb, poolCopingMats.realMat, poolCopingMats.toonMat, poolCopingMats.pixarMat);

    const southCurbGeo = new THREE.BoxGeometry(10.8, 0.16, 0.4);
    const southCurb = new THREE.Mesh(southCurbGeo, poolCopingMats.realMat);
    southCurb.position.set(0, 0.08, -2.45);
    southCurb.receiveShadow = true;
    poolGroup.add(southCurb);
    registerMultiStyleMesh(southCurb, poolCopingMats.realMat, poolCopingMats.toonMat, poolCopingMats.pixarMat);

    const westCurbGeo = new THREE.BoxGeometry(0.4, 0.16, 4.6);
    const westCurb = new THREE.Mesh(westCurbGeo, poolCopingMats.realMat);
    westCurb.position.set(-5.2, 0.08, 0);
    westCurb.receiveShadow = true;
    poolGroup.add(westCurb);
    registerMultiStyleMesh(westCurb, poolCopingMats.realMat, poolCopingMats.toonMat, poolCopingMats.pixarMat);

    const eastCurbGeo = new THREE.BoxGeometry(0.4, 0.16, 4.6);
    const eastCurb = new THREE.Mesh(eastCurbGeo, poolCopingMats.realMat);
    eastCurb.position.set(5.2, 0.08, 0);
    eastCurb.receiveShadow = true;
    poolGroup.add(eastCurb);
    registerMultiStyleMesh(eastCurb, poolCopingMats.realMat, poolCopingMats.toonMat, poolCopingMats.pixarMat);

    // B. Hollow Pool Basin (Recessed Floor & 4 Interior Mosaic Walls - Pure Mediterranean Cobalt Blue Tiles)
    const poolTileMats = createMatSet(0x0047ab, {
      roughness: 0.15,
      metalness: 0.05,
      emissive: 0x002880,
      emissiveIntensity: 0.45,
      toonColor: 0x0052cc,
      pixarColor: 0x0040aa
    });

    // Sunken Floor
    const floorGeo = new THREE.BoxGeometry(10.0, 0.1, 4.6);
    const poolFloor = new THREE.Mesh(floorGeo, poolTileMats.realMat);
    poolFloor.position.set(0, -1.65, 0);
    poolFloor.receiveShadow = true;
    poolGroup.add(poolFloor);
    registerMultiStyleMesh(poolFloor, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    // 4 Interior Vertical Walls
    const wallNGeo = new THREE.BoxGeometry(10.0, 1.7, 0.08);
    const poolWallN = new THREE.Mesh(wallNGeo, poolTileMats.realMat);
    poolWallN.position.set(0, -0.77, 2.26);
    poolGroup.add(poolWallN);
    registerMultiStyleMesh(poolWallN, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    const poolWallS = new THREE.Mesh(wallNGeo, poolTileMats.realMat);
    poolWallS.position.set(0, -0.77, -2.26);
    poolGroup.add(poolWallS);
    registerMultiStyleMesh(poolWallS, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    const wallWGeo = new THREE.BoxGeometry(0.08, 1.7, 4.6);
    const poolWallW = new THREE.Mesh(wallWGeo, poolTileMats.realMat);
    poolWallW.position.set(-4.96, -0.77, 0);
    poolGroup.add(poolWallW);
    registerMultiStyleMesh(poolWallW, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    const poolWallE = new THREE.Mesh(wallWGeo, poolTileMats.realMat);
    poolWallE.position.set(4.96, -0.77, 0);
    poolGroup.add(poolWallE);
    registerMultiStyleMesh(poolWallE, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    // Submerged Entry Steps & Lounge Shelf (at East end)
    const step1Geo = new THREE.BoxGeometry(1.4, 0.35, 4.5);
    const poolStep1 = new THREE.Mesh(step1Geo, poolTileMats.realMat);
    poolStep1.position.set(4.2, -1.4, 0);
    poolGroup.add(poolStep1);
    registerMultiStyleMesh(poolStep1, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    const step2Geo = new THREE.BoxGeometry(0.9, 0.35, 4.5);
    const poolStep2 = new THREE.Mesh(step2Geo, poolTileMats.realMat);
    poolStep2.position.set(4.5, -1.05, 0);
    poolGroup.add(poolStep2);
    registerMultiStyleMesh(poolStep2, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    const step3Geo = new THREE.BoxGeometry(0.45, 0.35, 4.5);
    const poolStep3 = new THREE.Mesh(step3Geo, poolTileMats.realMat);
    poolStep3.position.set(4.75, -0.7, 0);
    poolGroup.add(poolStep3);
    registerMultiStyleMesh(poolStep3, poolTileMats.realMat, poolTileMats.toonMat, poolTileMats.pixarMat);

    // C. Sunken Water Mesh (Crystal-Clear Vibrant Pure Sky Blue Water - Zero Green)
    const waterGeo = new THREE.PlaneGeometry(9.9, 4.5, 32, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0055ff, // Ultra-saturated radiant pure pool blue (zero green)
      emissive: 0x0033cc, // Pure deep blue depth radiance
      emissiveIntensity: 0.42,
      roughness: 0.08, // Glass-clear, pristine water surface
      metalness: 0.0,
      transparent: true,
      opacity: 0.52, // Crystal-clear transparency revealing deep blue mosaic floor & steps
      side: THREE.DoubleSide
    });
    const poolWater = new THREE.Mesh(waterGeo, waterMat);
    poolWater.rotation.x = -Math.PI / 2;
    poolWater.position.set(0, -0.15, 0);
    poolWater.renderOrder = 2;
    poolGroup.add(poolWater);
    poolWaterRef.current = poolWater;

    // Realistic Underwater Sun Caustics and Shimmer Glow Layer (Pure Sky Blue)
    const causticsGeo = new THREE.PlaneGeometry(9.8, 4.4, 1, 1);
    const causticsMat = new THREE.MeshBasicMaterial({
      color: 0x80b5ff, // Crisp sunlit sky blue
      transparent: true,
      opacity: 0.60,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const causticsPlane = new THREE.Mesh(causticsGeo, causticsMat);
    causticsPlane.rotation.x = -Math.PI / 2;
    causticsPlane.position.set(0, -1.58, 0);
    poolGroup.add(causticsPlane);

    // Underwater Luminous Blue Spotlights (Pure Electric Sapphire Blue)
    const poolLight1 = new THREE.PointLight(0x0055ff, 2.5, 18, 1.2);
    poolLight1.position.set(-3, -0.6, 0);
    poolGroup.add(poolLight1);
    underwaterLightsRef.current.push(poolLight1);

    const poolLight2 = new THREE.PointLight(0x0055ff, 2.5, 18, 1.2);
    poolLight2.position.set(3, -0.6, 0);
    poolGroup.add(poolLight2);
    underwaterLightsRef.current.push(poolLight2);

    const poolLightCenter = new THREE.PointLight(0x0066ff, 2.2, 16, 1.2);
    poolLightCenter.position.set(0, -0.6, 0);
    poolGroup.add(poolLightCenter);
    underwaterLightsRef.current.push(poolLightCenter);

    // Curved Stainless Steel Pool Ladder (Placed on left edge near villa walkway as seen in photo)
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(-5.0, 0.08, -1.2);
    const ladderMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.95, roughness: 0.05 });

    const handrailGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.8, 12);
    const rail1 = new THREE.Mesh(handrailGeo, ladderMat);
    rail1.position.set(0, -0.2, -0.25);
    ladderGroup.add(rail1);
    const rail2 = new THREE.Mesh(handrailGeo, ladderMat);
    rail2.position.set(0, -0.2, 0.25);
    ladderGroup.add(rail2);

    const stepGeo = new THREE.BoxGeometry(0.06, 0.025, 0.5);
    for (let s = 0; s < 4; s++) {
      const step = new THREE.Mesh(stepGeo, ladderMat);
      step.position.set(0, -0.15 - s * 0.3, 0);
      ladderGroup.add(step);
    }
    poolGroup.add(ladderGroup);

    // ==========================================
    // D. VIBRANT LUXURY POOL TUBE FLOAT (NO PEOPLE)
    // ==========================================
    // Vibrant Coral Flamingo & Crisp White Striped Luxury Pool Tube Float
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(2.2, -0.15, 0.5);
    poolGroup.add(tubeGroup);
    poolTubeRef.current = tubeGroup;

    const tubeCoralMat = new THREE.MeshStandardMaterial({
      color: 0xff3366, // Vibrant flamingo coral-pink
      roughness: 0.22,
      metalness: 0.05,
      emissive: 0x880e4f,
      emissiveIntensity: 0.18
    });
    const tubeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Crisp clean white
      roughness: 0.20,
      metalness: 0.05
    });

    // 8-segment alternating striped luxury pool float ring
    const segmentAngle = Math.PI / 4;
    for (let seg = 0; seg < 8; seg++) {
      const segGeo = new THREE.TorusGeometry(0.72, 0.23, 16, 8, segmentAngle + 0.02);
      segGeo.rotateX(Math.PI / 2);
      segGeo.rotateY(seg * segmentAngle);
      const segMesh = new THREE.Mesh(segGeo, seg % 2 === 0 ? tubeCoralMat : tubeWhiteMat);
      tubeGroup.add(segMesh);
    }

    // White perimeter safety grab rope around float
    const tubeRopeGeo = new THREE.TorusGeometry(0.98, 0.025, 8, 32);
    tubeRopeGeo.rotateX(Math.PI / 2);
    const tubeRope = new THREE.Mesh(tubeRopeGeo, tubeWhiteMat);
    tubeGroup.add(tubeRope);

    // ==========================================
    // 5. DIRECT BROAD STONE SLAB PATHWAY TO MAIN VILLA
    // ==========================================
    // Authentic rustic natural flagstone slabs matching the uploaded farmhouse photograph
    // Broad ~4.0m pathway corridor on the left of the pool leading directly to the Main Villa
    const stoneGeo = new THREE.BoxGeometry(0.9, 0.06, 0.7);
    const stoneMats = createMatSet(0xd9cfc1, {
      roughness: 0.75,
      metalness: 0.05
    });

    // A. Main Walkway: Triple row of stone slabs running directly alongside the pool from front lawn to Main Villa Veranda
    // Spanning from Z = 7.8 (front lawn) all the way to Z = -0.4 (main villa veranda)
    for (let s = 0; s < 10; s++) {
      const zPos = 7.2 - s * 0.85;

      // Row 1 (Right inner stone next to pool curb at X = 0.5)
      const stone1 = new THREE.Mesh(stoneGeo, stoneMats.realMat);
      stone1.position.set(0.5, 0.03, zPos);
      stone1.rotation.y = (s % 2 === 0 ? 0.03 : -0.02);
      stone1.receiveShadow = true;
      scene.add(stone1);
      registerMultiStyleMesh(stone1, stoneMats.realMat, stoneMats.toonMat, stoneMats.pixarMat);

      // Row 2 (Middle stone at X = -0.5)
      const stone2 = new THREE.Mesh(stoneGeo, stoneMats.realMat);
      stone2.position.set(-0.5, 0.03, zPos);
      stone2.rotation.y = (s % 2 === 0 ? -0.02 : 0.03);
      stone2.receiveShadow = true;
      scene.add(stone2);
      registerMultiStyleMesh(stone2, stoneMats.realMat, stoneMats.toonMat, stoneMats.pixarMat);

      // Row 3 (Left outer stone near lawn & side wing at X = -1.5)
      const stone3 = new THREE.Mesh(stoneGeo, stoneMats.realMat);
      stone3.position.set(-1.5, 0.03, zPos);
      stone3.rotation.y = (s % 2 === 0 ? 0.02 : -0.02);
      stone3.receiveShadow = true;
      scene.add(stone3);
      registerMultiStyleMesh(stone3, stoneMats.realMat, stoneMats.toonMat, stoneMats.pixarMat);
    }

    // B. Corner Veranda Pathway Connector: Leads from the left walkway across the head of the pool to bedroom veranda
    for (let s = 0; s < 6; s++) {
      const stoneCorner = new THREE.Mesh(stoneGeo, stoneMats.realMat);
      stoneCorner.position.set(0.5 + s * 0.9, 0.03, 0.5);
      stoneCorner.receiveShadow = true;
      scene.add(stoneCorner);
      registerMultiStyleMesh(stoneCorner, stoneMats.realMat, stoneMats.toonMat, stoneMats.pixarMat);
    }

    // C. Right Walkway alongside pool leading to corner of poolside bedroom
    for (let s = 0; s < 8; s++) {
      const stone = new THREE.Mesh(stoneGeo, stoneMats.realMat);
      stone.position.set(12.3, 0.03, 7.2 - s * 1.0);
      stone.receiveShadow = true;
      scene.add(stone);
      registerMultiStyleMesh(stone, stoneMats.realMat, stoneMats.toonMat, stoneMats.pixarMat);
    }

    // D. Front Cross Walkway across the manicured lawn
    for (let s = 0; s < 16; s++) {
      const stone = new THREE.Mesh(stoneGeo, stoneMats.realMat);
      stone.position.set(-2.0 + s * 1.0, 0.03, 7.8);
      stone.receiveShadow = true;
      scene.add(stone);
      registerMultiStyleMesh(stone, stoneMats.realMat, stoneMats.toonMat, stoneMats.pixarMat);
    }

    // ==========================================
    // 6. VOLUMETRIC 3D TROPICAL PALMS, CANOPY TREES & 3D VERANDA PLANTS
    // ==========================================
    // A. 3D Potted Veranda Plants with Curved Stems and Volumetric 3D Foliage
    const potGeo = new THREE.CylinderGeometry(0.26, 0.19, 0.48, 14);
    const potSoilGeo = new THREE.CircleGeometry(0.24, 12);
    potSoilGeo.rotateX(-Math.PI / 2);
    const potSoilMat = new THREE.MeshStandardMaterial({ color: 0x221811, roughness: 0.95 });

    const potMats = createMatSet(0xc85a32, { roughness: 0.8 }); // Terracotta
    const potWhiteMats = createMatSet(0xffffff, { roughness: 0.4 }); // White fluted pot
    const plantStemMat = new THREE.MeshStandardMaterial({ color: 0x3d7031, roughness: 0.6 });
    const plantLeafMat = new THREE.MeshStandardMaterial({
      color: 0x286e24,
      roughness: 0.45,
      side: THREE.DoubleSide
    });

    const plantPositions = [
      { x: -0.2, z: -0.2, isWhite: false },
      { x: 1.0, z: -0.2, isWhite: true },
      { x: 2.2, z: -0.2, isWhite: false },
      { x: 3.5, z: -0.5, isWhite: true },
      { x: 7.5, z: -0.5, isWhite: false }
    ];

    plantPositions.forEach((pos) => {
      const potGroup = new THREE.Group();
      potGroup.position.set(pos.x, 0.25, pos.z);

      const potMatChoice = pos.isWhite ? potWhiteMats : potMats;
      const pot = new THREE.Mesh(potGeo, potMatChoice.realMat);
      pot.castShadow = true;
      potGroup.add(pot);
      registerMultiStyleMesh(pot, potMatChoice.realMat, potMatChoice.toonMat, potMatChoice.pixarMat);

      const soil = new THREE.Mesh(potSoilGeo, potSoilMat);
      soil.position.y = 0.23;
      potGroup.add(soil);

      // 3D Volumetric arching plant stems & broad leaves
      for (let s = 0; s < 6; s++) {
        const stemGroup = new THREE.Group();
        const angle = (s / 6) * Math.PI * 2 + (Math.random() * 0.3);
        const stemHeight = 0.45 + (s % 3) * 0.15;

        // Curved 3D Stem
        const stemGeo = new THREE.CylinderGeometry(0.015, 0.025, stemHeight, 6);
        const stem = new THREE.Mesh(stemGeo, plantStemMat);
        stem.position.set(0, stemHeight / 2, 0);
        stemGroup.add(stem);

        // Volumetric 3D Leaf Blade (Curved multi-faceted 3D geometry)
        const leafGeo = new THREE.ConeGeometry(0.18, 0.5, 4);
        leafGeo.scale(1.0, 1.0, 0.15); // Flatten into a thick 3D leaf blade
        const leaf = new THREE.Mesh(leafGeo, plantLeafMat);
        leaf.position.set(0, stemHeight + 0.18, 0);
        leaf.rotation.x = 0.6;
        leaf.castShadow = true;
        stemGroup.add(leaf);

        stemGroup.position.set(Math.cos(angle) * 0.08, 0.22, Math.sin(angle) * 0.08);
        stemGroup.rotation.y = angle;
        stemGroup.rotation.z = 0.35 + (s % 2) * 0.2;
        potGroup.add(stemGroup);
      }

      villaGroup.add(potGroup);
    });

    // B. High-Fidelity Volumetric 3D Palm Trees (True 3D Segmented Trunk & Arched Fronds)
    const create3DPalmTree = (x: number, z: number, scale: number = 1, rotationOffset: number = 0) => {
      const palmGroup = new THREE.Group();
      palmGroup.position.set(x, 0, z);
      palmGroup.rotation.y = rotationOffset;

      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x544030,
        roughness: 0.88,
        metalness: 0.05
      });
      const crownShaftMat = new THREE.MeshStandardMaterial({
        color: 0x486b24,
        roughness: 0.65
      });
      const frondMat = new THREE.MeshStandardMaterial({
        color: 0x2e6b22,
        roughness: 0.45,
        side: THREE.DoubleSide
      });
      const frondLightMat = new THREE.MeshStandardMaterial({
        color: 0x3d822d,
        roughness: 0.45,
        side: THREE.DoubleSide
      });
      const coconutMat = new THREE.MeshStandardMaterial({
        color: 0x4f4227,
        roughness: 0.75
      });

      // 1. Segmented 3D Ringed Trunk with Natural Organic Sway
      const segments = 12;
      const trunkHeight = 6.2 * scale;
      const segHeight = trunkHeight / segments;
      let currX = 0;
      let currZ = 0;
      let currY = 0;
      const swayDirX = (Math.random() - 0.5) * 0.08 * scale;
      const swayDirZ = (Math.random() - 0.5) * 0.08 * scale;

      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const radiusBottom = (0.32 - t * 0.14) * scale;
        const radiusTop = (0.32 - (t + 1 / segments) * 0.14) * scale;
        const segGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, segHeight * 1.05, 9);
        const seg = new THREE.Mesh(segGeo, trunkMat);

        seg.position.set(currX, currY + segHeight / 2, currZ);
        seg.castShadow = true;
        seg.receiveShadow = true;
        palmGroup.add(seg);

        // Trunk Ring Ridge Collar for 3D tactile bark texture
        const ringGeo = new THREE.TorusGeometry(radiusBottom * 1.04, 0.025 * scale, 5, 12);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, trunkMat);
        ring.position.set(currX, currY, currZ);
        palmGroup.add(ring);

        currY += segHeight;
        currX += swayDirX * (i * 0.4);
        currZ += swayDirZ * (i * 0.4);
      }

      // 2. Green Crownshaft Collar at Top of Trunk
      const crownShaftGeo = new THREE.CylinderGeometry(0.16 * scale, 0.18 * scale, 0.8 * scale, 10);
      const crownShaft = new THREE.Mesh(crownShaftGeo, crownShaftMat);
      crownShaft.position.set(currX, currY + 0.4 * scale, currZ);
      crownShaft.castShadow = true;
      palmGroup.add(crownShaft);

      const topY = currY + 0.8 * scale;

      // 3. Volumetric Coconuts Cluster
      for (let c = 0; c < 5; c++) {
        const cAngle = (c / 5) * Math.PI * 2;
        const cocoGeo = new THREE.SphereGeometry(0.16 * scale, 8, 8);
        cocoGeo.scale(1, 1.2, 1);
        const coco = new THREE.Mesh(cocoGeo, coconutMat);
        coco.position.set(
          currX + Math.cos(cAngle) * 0.22 * scale,
          topY - 0.25 * scale,
          currZ + Math.sin(cAngle) * 0.22 * scale
        );
        coco.castShadow = true;
        palmGroup.add(coco);
      }

      // 4. Volumetric 3D Arching Palm Fronds in 3 Radial Tiers (Total 18 3D Fronds)
      const frondTiers = [
        { count: 6, pitch: 0.35, droop: 0.4, length: 2.8 * scale },  // Upper rising
        { count: 7, pitch: 0.85, droop: 0.8, length: 3.4 * scale },  // Mid arching
        { count: 6, pitch: 1.35, droop: 1.3, length: 3.0 * scale }   // Lower drooping
      ];

      frondTiers.forEach((tier, tierIdx) => {
        for (let f = 0; f < tier.count; f++) {
          const frondGroup = new THREE.Group();
          frondGroup.position.set(currX, topY, currZ);

          const angle = (f / tier.count) * Math.PI * 2 + (tierIdx * 0.35);
          frondGroup.rotation.y = angle;

          // Frond 3D Curved Spine (Formed by connected tapered cylinder segments)
          const spineSegments = 5;
          const segLen = tier.length / spineSegments;
          let spX = 0;
          let spY = 0;
          let spZ = 0;

          const spineMat = tierIdx % 2 === 0 ? frondMat : frondLightMat;

          for (let s = 0; s < spineSegments; s++) {
            const st = s / spineSegments;
            const spineRadius = (0.04 - st * 0.025) * scale;
            const spineGeo = new THREE.CylinderGeometry(spineRadius * 0.8, spineRadius, segLen, 5);
            spineGeo.rotateX(Math.PI / 2);

            const spineSeg = new THREE.Mesh(spineGeo, crownShaftMat);
            const droopAngle = tier.pitch + st * tier.droop;
            spineSeg.rotation.x = droopAngle;
            spineSeg.position.set(0, spY - Math.sin(droopAngle) * (segLen / 2), spZ + Math.cos(droopAngle) * (segLen / 2));
            frondGroup.add(spineSeg);

            // Volumetric 3D Feathered Leaf Pinnae (Leaves along the frond stem)
            const leavesPerSeg = 4;
            for (let lp = 0; lp < leavesPerSeg; lp++) {
              const leafT = (s * leavesPerSeg + lp) / (spineSegments * leavesPerSeg);
              const leafLen = (1.0 - Math.abs(leafT - 0.45) * 1.2) * 0.85 * scale;
              if (leafLen > 0.15) {
                // Left Leaf Pinna (Volumetric 3D diamond wedge)
                const pinnaGeo = new THREE.ConeGeometry(0.08 * scale, leafLen, 3);
                pinnaGeo.scale(1, 1, 0.2);

                const pinnaLeft = new THREE.Mesh(pinnaGeo, spineMat);
                pinnaLeft.position.set(
                  -leafLen * 0.45,
                  spY - Math.sin(droopAngle) * (lp * segLen / leavesPerSeg),
                  spZ + Math.cos(droopAngle) * (lp * segLen / leavesPerSeg)
                );
                pinnaLeft.rotation.z = -0.85;
                pinnaLeft.rotation.x = droopAngle + 0.15;
                pinnaLeft.castShadow = true;
                frondGroup.add(pinnaLeft);

                // Right Leaf Pinna
                const pinnaRight = new THREE.Mesh(pinnaGeo, spineMat);
                pinnaRight.position.set(
                  leafLen * 0.45,
                  spY - Math.sin(droopAngle) * (lp * segLen / leavesPerSeg),
                  spZ + Math.cos(droopAngle) * (lp * segLen / leavesPerSeg)
                );
                pinnaRight.rotation.z = 0.85;
                pinnaRight.rotation.x = droopAngle + 0.15;
                pinnaRight.castShadow = true;
                frondGroup.add(pinnaRight);
              }
            }

            spY -= Math.sin(droopAngle) * segLen;
            spZ += Math.cos(droopAngle) * segLen;
          }

          palmGroup.add(frondGroup);
        }
      });

      scene.add(palmGroup);
    };

    // C. Volumetric 3D Deciduous Orchard Canopy Trees (Branched Trunks & Volumetric Polyhedral Canopy Foliage)
    const create3DCanopyTree = (x: number, z: number, scale: number = 1) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);

      const woodMat = new THREE.MeshStandardMaterial({ color: 0x48382b, roughness: 0.9 });
      const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x2d6824, roughness: 0.7, flatShading: true });
      const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x3a7e2e, roughness: 0.65, flatShading: true });
      const foliageMat3 = new THREE.MeshStandardMaterial({ color: 0x4e963c, roughness: 0.6, flatShading: true });

      // Trunk Base & Flare
      const trunkGeo = new THREE.CylinderGeometry(0.35 * scale, 0.55 * scale, 2.8 * scale, 8);
      const trunk = new THREE.Mesh(trunkGeo, woodMat);
      trunk.position.y = 1.4 * scale;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      // 4 Main 3D Branch Limbs
      const branchAngles = [0, 1.6, 3.2, 4.8];
      branchAngles.forEach((bAngle, bIdx) => {
        const branchGeo = new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 2.2 * scale, 6);
        const branch = new THREE.Mesh(branchGeo, woodMat);
        branch.position.set(
          Math.cos(bAngle) * 0.6 * scale,
          2.6 * scale,
          Math.sin(bAngle) * 0.6 * scale
        );
        branch.rotation.z = Math.cos(bAngle) * 0.6;
        branch.rotation.x = Math.sin(bAngle) * 0.6;
        branch.castShadow = true;
        treeGroup.add(branch);

        // Volumetric 3D Foliage Clumps on each branch limb
        const foliageMatChoice = bIdx % 3 === 0 ? foliageMat1 : (bIdx % 3 === 1 ? foliageMat2 : foliageMat3);
        const clumpGeo = new THREE.DodecahedronGeometry(1.4 * scale, 1);
        const clump = new THREE.Mesh(clumpGeo, foliageMatChoice);
        clump.position.set(
          Math.cos(bAngle) * 1.5 * scale,
          3.6 * scale + (bIdx % 2) * 0.4 * scale,
          Math.sin(bAngle) * 1.5 * scale
        );
        clump.rotation.set(bIdx * 0.4, bIdx * 0.7, 0);
        clump.castShadow = true;
        clump.receiveShadow = true;
        treeGroup.add(clump);
      });

      // Central Crown Top Foliage Clump
      const topClumpGeo = new THREE.DodecahedronGeometry(1.8 * scale, 1);
      const topClump = new THREE.Mesh(topClumpGeo, foliageMat2);
      topClump.position.set(0, 4.5 * scale, 0);
      topClump.castShadow = true;
      topClump.receiveShadow = true;
      treeGroup.add(topClump);

      scene.add(treeGroup);
    };

    // Instantiate Realistic 3D Trees around the Estate
    create3DPalmTree(-18, 12, 1.25, 0.4);
    create3DPalmTree(-15, 16, 1.1, -0.6);
    create3DPalmTree(18, 14, 1.35, 1.2);
    create3DPalmTree(16, -14, 1.2, -0.3);
    create3DPalmTree(-13, -16, 1.05, 0.8);
    create3DPalmTree(21, 6, 1.15, -1.1);

    create3DCanopyTree(-22, -6, 1.3);
    create3DCanopyTree(24, -8, 1.4);
    create3DCanopyTree(-8, 22, 1.1);

    // ==========================================
    // 12. VIBRANT SOLID COUNTRYSIDE VILLAGE (OPTIMIZED 60 FPS)
    // ==========================================
    const createVillageSettlement = () => {
      const villageGroup = new THREE.Group();

      // A. Vast Rolling Countryside Meadow Base (Hollow estate center so it NEVER overlaps or covers the pool)
      const meadowShape = new THREE.Shape();
      meadowShape.moveTo(-160, -160);
      meadowShape.lineTo(160, -160);
      meadowShape.lineTo(160, 160);
      meadowShape.lineTo(-160, 160);
      meadowShape.closePath();

      // Hollow cutout path for the entire central estate grounds (X: -45 to 45, Z: -45 to 45)
      const estateHole = new THREE.Path();
      estateHole.moveTo(-45, -45);
      estateHole.lineTo(45, -45);
      estateHole.lineTo(45, 45);
      estateHole.lineTo(-45, 45);
      estateHole.closePath();
      meadowShape.holes.push(estateHole);

      const outerMeadowGeo = new THREE.ShapeGeometry(meadowShape);
      outerMeadowGeo.rotateX(-Math.PI / 2);
      const outerMeadowMat = new THREE.MeshStandardMaterial({
        color: 0x1f341b,
        roughness: 0.95
      });
      const outerMeadow = new THREE.Mesh(outerMeadowGeo, outerMeadowMat);
      outerMeadow.position.set(0, -0.06, 0);
      villageGroup.add(outerMeadow);

      // B. Distant Horizon Rolling Green Hills (Organic Horizon Silhouettes)
      const hillMat1 = new THREE.MeshStandardMaterial({ color: 0x1a2e1d, roughness: 0.95, flatShading: true });
      const hillMat2 = new THREE.MeshStandardMaterial({ color: 0x243e26, roughness: 0.9, flatShading: true });

      const hillsData = [
        { x: -80, z: -45, r: 42, h: 22, mat: hillMat1 },
        { x: -95, z: 15, r: 48, h: 26, mat: hillMat2 },
        { x: -80, z: 70, r: 40, h: 20, mat: hillMat1 },
        { x: -20, z: -100, r: 52, h: 28, mat: hillMat2 },
        { x: 50, z: -90, r: 46, h: 24, mat: hillMat1 },
        { x: 100, z: -35, r: 50, h: 26, mat: hillMat2 },
        { x: 95, z: 40, r: 44, h: 22, mat: hillMat1 },
        { x: 40, z: 95, r: 48, h: 24, mat: hillMat2 },
        { x: -35, z: 100, r: 46, h: 23, mat: hillMat1 }
      ];

      hillsData.forEach(({ x, z, r, h, mat }) => {
        const hillGeo = new THREE.ConeGeometry(r, h, 10);
        const hill = new THREE.Mesh(hillGeo, mat);
        hill.position.set(x, h * 0.42, z);
        hill.scale.set(1.4, 0.7, 1.2);
        villageGroup.add(hill);
      });

      // C. Winding Countryside Dirt Paths
      const pathMat = new THREE.MeshStandardMaterial({ color: 0x6e5641, roughness: 0.95 });
      const pathSegments = [
        { x: -30, z: 6, w: 3.5, l: 24, rot: 0.3 },
        { x: -44, z: 18, w: 3.2, l: 28, rot: 0.6 },
        { x: -40, z: -10, w: 3.2, l: 30, rot: -0.2 },
        { x: -52, z: -25, w: 3.0, l: 32, rot: -0.5 },
        { x: -10, z: -38, w: 3.0, l: 40, rot: 1.57 },
        { x: 25, z: -35, w: 3.0, l: 36, rot: 1.4 }
      ];

      pathSegments.forEach(p => {
        const pGeo = new THREE.PlaneGeometry(p.w, p.l);
        pGeo.rotateX(-Math.PI / 2);
        const pMesh = new THREE.Mesh(pGeo, pathMat);
        pMesh.position.set(p.x, -0.02, p.z);
        pMesh.rotation.y = p.rot;
        villageGroup.add(pMesh);
      });

      // D. Fully Enclosed Solid Architectural Cottages (100% Solid Geometry, Zero Holes)
      const warmWindowMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
      const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d281a, roughness: 0.9 });
      const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x6b5d52, roughness: 0.9 });

      const createSolidCottage = (
        cx: number,
        cz: number,
        cRot: number,
        scale: number = 1,
        wallColor: number = 0xa87d58,
        roofColor: number = 0xad4d2b
      ) => {
        const hutGroup = new THREE.Group();
        hutGroup.position.set(cx, 0, cz);
        hutGroup.rotation.y = cRot;

        // 1. Solid Main Walls (Fully enclosed box)
        const bw = 5.4 * scale;
        const bh = 2.8 * scale;
        const bd = 4.2 * scale;
        const bodyGeo = new THREE.BoxGeometry(bw, bh, bd);
        const bodyMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.85 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = bh / 2;
        hutGroup.add(body);

        // 2. Solid Hipped Terracotta Roof (Fully closed 4-sided pitched roof with overhanging eaves)
        const roofRadius = Math.hypot(bw, bd) * 0.52 + 0.35 * scale;
        const roofH = 2.4 * scale;
        const roofGeo = new THREE.ConeGeometry(roofRadius, roofH, 4);
        roofGeo.rotateY(Math.PI / 4); // Align 4 slopes with walls
        const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.65 });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.scale.set((bw + 0.9 * scale) / (roofRadius * 1.414), 1, (bd + 0.9 * scale) / (roofRadius * 1.414));
        roofMesh.position.y = bh + roofH / 2 - 0.1 * scale;
        hutGroup.add(roofMesh);

        // 3. Wooden Eaves Fascia Board
        const trimGeo = new THREE.BoxGeometry(bw + 0.9 * scale, 0.12 * scale, bd + 0.9 * scale);
        const trim = new THREE.Mesh(trimGeo, darkWoodMat);
        trim.position.y = bh;
        hutGroup.add(trim);

        // 4. Covered Front Porch
        const postGeo = new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 2.0 * scale, 6);
        const postL = new THREE.Mesh(postGeo, darkWoodMat);
        postL.position.set(-1.6 * scale, 1.0 * scale, bd / 2 + 1.2 * scale);
        hutGroup.add(postL);

        const postR = new THREE.Mesh(postGeo, darkWoodMat);
        postR.position.set(1.6 * scale, 1.0 * scale, bd / 2 + 1.2 * scale);
        hutGroup.add(postR);

        const porchRoofGeo = new THREE.BoxGeometry(3.6 * scale, 0.12 * scale, 1.4 * scale);
        const porchRoof = new THREE.Mesh(porchRoofGeo, roofMat);
        porchRoof.position.set(0, 2.0 * scale, bd / 2 + 0.7 * scale);
        porchRoof.rotation.x = 0.16;
        hutGroup.add(porchRoof);

        // 5. Front Wooden Door
        const doorGeo = new THREE.BoxGeometry(1.1 * scale, 1.9 * scale, 0.1);
        const door = new THREE.Mesh(doorGeo, darkWoodMat);
        door.position.set(0, 0.95 * scale, bd / 2 + 0.05);
        hutGroup.add(door);

        // 6. Warm Glowing Windows (MeshBasicMaterial glows brilliantly with ZERO GPU cost)
        const winGeo = new THREE.BoxGeometry(0.9 * scale, 0.9 * scale, 0.08);

        const win1 = new THREE.Mesh(winGeo, warmWindowMat);
        win1.position.set(-1.6 * scale, 1.5 * scale, bd / 2 + 0.06);
        hutGroup.add(win1);

        const win2 = new THREE.Mesh(winGeo, warmWindowMat);
        win2.position.set(1.6 * scale, 1.5 * scale, bd / 2 + 0.06);
        hutGroup.add(win2);

        // Side window
        const winSide = new THREE.Mesh(winGeo, warmWindowMat);
        winSide.position.set(bw / 2 + 0.06, 1.5 * scale, 0);
        winSide.rotation.y = Math.PI / 2;
        hutGroup.add(winSide);

        // 7. Solid Brick Chimney
        const chimneyGeo = new THREE.BoxGeometry(0.6 * scale, 2.2 * scale, 0.6 * scale);
        const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
        chimney.position.set(1.3 * scale, bh + 1.2 * scale, -0.6 * scale);
        hutGroup.add(chimney);

        villageGroup.add(hutGroup);
      };

      // Instantiate Solid Cottages around the Outer Grounds
      // Left Corridor Area (West side - beautifully visible through the veranda):
      createSolidCottage(-34, 14, 0.25, 1.05, 0xa87d58, 0xad4d2b);
      createSolidCottage(-44, 2, -0.2, 1.1, 0x8b6b55, 0x803d20);
      createSolidCottage(-50, 24, 0.6, 1.0, 0x766c62, 0xad4d2b);
      createSolidCottage(-38, -18, -0.4, 1.05, 0xa87d58, 0x803d20);
      createSolidCottage(-30, -32, 0.75, 1.15, 0x8b6b55, 0xad4d2b);

      // Northern Countryside Perimeter:
      createSolidCottage(-10, -38, 0.1, 1.1, 0xa87d58, 0xad4d2b);
      createSolidCottage(16, -34, -0.35, 1.05, 0x766c62, 0x803d20);
      createSolidCottage(38, -28, 0.45, 1.0, 0x8b6b55, 0xad4d2b);
      createSolidCottage(-56, 8, -0.15, 0.95, 0xa87d58, 0xad4d2b);

      // 2 Soft Village Area Point Lights (Only 2 lights total = 60 FPS silky smooth!)
      const villageLight1 = new THREE.PointLight(0xffa844, 1.4, 45);
      villageLight1.position.set(-36, 6, 8);
      villageGroup.add(villageLight1);

      const villageLight2 = new THREE.PointLight(0xffbe58, 1.2, 45);
      villageLight2.position.set(0, 6, -32);
      villageGroup.add(villageLight2);

      // E. Rustic Village Windmill
      const windmillGroup = new THREE.Group();
      windmillGroup.position.set(-52, 0, -8);

      const knollGeo = new THREE.CylinderGeometry(5.5, 7.5, 1.4, 12);
      const knollMat = new THREE.MeshStandardMaterial({ color: 0x274122, roughness: 0.9 });
      const knoll = new THREE.Mesh(knollGeo, knollMat);
      knoll.position.y = 0.7;
      windmillGroup.add(knoll);

      const towerGeo = new THREE.CylinderGeometry(2.1, 3.0, 10.5, 10);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x948574, roughness: 0.85 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 6.6;
      windmillGroup.add(tower);

      const capGeo = new THREE.ConeGeometry(2.5, 2.4, 10);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1d, roughness: 0.9 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 13.0;
      windmillGroup.add(cap);

      // Rotating Windmill Sails
      const sailsGroup = new THREE.Group();
      sailsGroup.position.set(0, 12.0, 2.3);

      const bladeGeo = new THREE.BoxGeometry(0.3, 7.0, 0.08);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd9cfc1, roughness: 0.8 });

      const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
      blade1.position.y = 3.5;
      sailsGroup.add(blade1);

      const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
      blade2.position.y = -3.5;
      sailsGroup.add(blade2);

      const blade3 = new THREE.Mesh(bladeGeo, bladeMat);
      blade3.rotation.z = Math.PI / 2;
      blade3.position.x = 3.5;
      sailsGroup.add(blade3);

      const blade4 = new THREE.Mesh(bladeGeo, bladeMat);
      blade4.rotation.z = Math.PI / 2;
      blade4.position.x = -3.5;
      sailsGroup.add(blade4);

      windmillGroup.add(sailsGroup);
      windmillSailsRef.current = sailsGroup;

      const wLamp = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.35), warmWindowMat);
      wLamp.position.set(0, 2.4, 3.1);
      windmillGroup.add(wLamp);

      villageGroup.add(windmillGroup);

      // F. Traditional Stone Water Well Outside Corridor
      const wellGroup = new THREE.Group();
      wellGroup.position.set(-31, 0, 4);

      const wellBaseGeo = new THREE.CylinderGeometry(1.0, 1.1, 0.85, 10);
      const wellBaseMat = new THREE.MeshStandardMaterial({ color: 0x7a6d5f, roughness: 0.9 });
      const wellBase = new THREE.Mesh(wellBaseGeo, wellBaseMat);
      wellBase.position.y = 0.42;
      wellGroup.add(wellBase);

      const wellPostGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6);
      const wellPost1 = new THREE.Mesh(wellPostGeo, darkWoodMat);
      wellPost1.position.set(-0.8, 1.2, 0);
      wellGroup.add(wellPost1);

      const wellPost2 = new THREE.Mesh(wellPostGeo, darkWoodMat);
      wellPost2.position.set(0.8, 1.2, 0);
      wellGroup.add(wellPost2);

      const wellRoofGeo = new THREE.ConeGeometry(1.2, 0.9, 4);
      wellRoofGeo.rotateY(Math.PI / 4);
      const wellRoofMat = new THREE.MeshStandardMaterial({ color: 0xad4d2b, roughness: 0.65 });
      const wellRoof = new THREE.Mesh(wellRoofGeo, wellRoofMat);
      wellRoof.position.y = 2.3;
      wellGroup.add(wellRoof);

      villageGroup.add(wellGroup);

      // G. Golden Farm Haystacks
      const haystackGeo = new THREE.ConeGeometry(1.4, 2.0, 8);
      const haystackMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.95 });
      const hayPositions = [
        { x: -38, z: 28 },
        { x: -41, z: 29.5 },
        { x: -48, z: -14 },
        { x: -26, z: -25 },
        { x: 28, z: -40 }
      ];

      hayPositions.forEach(hp => {
        const hay = new THREE.Mesh(haystackGeo, haystackMat);
        hay.position.set(hp.x, 1.0, hp.z);
        villageGroup.add(hay);
      });

      // H. Village Wooden Rail Fences along the Lane
      const fenceMat = new THREE.MeshStandardMaterial({ color: 0x4d3826, roughness: 0.9 });
      const fencePostGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.1, 6);
      const fenceRailGeo = new THREE.BoxGeometry(0.06, 0.08, 2.4);

      const createFenceLine = (startX: number, startZ: number, count: number, stepX: number, stepZ: number) => {
        for (let f = 0; f < count; f++) {
          const fx = startX + f * stepX;
          const fz = startZ + f * stepZ;
          const post = new THREE.Mesh(fencePostGeo, fenceMat);
          post.position.set(fx, 0.55, fz);
          villageGroup.add(post);

          if (f < count - 1) {
            const rail1 = new THREE.Mesh(fenceRailGeo, fenceMat);
            rail1.position.set(fx + stepX * 0.5, 0.4, fz + stepZ * 0.5);
            rail1.rotation.y = Math.atan2(stepX, stepZ);
            villageGroup.add(rail1);

            const rail2 = new THREE.Mesh(fenceRailGeo, fenceMat);
            rail2.position.set(fx + stepX * 0.5, 0.8, fz + stepZ * 0.5);
            rail2.rotation.y = Math.atan2(stepX, stepZ);
            villageGroup.add(rail2);
          }
        }
      };

      createFenceLine(-28, 8, 7, -1.8, 2.0);
      createFenceLine(-34, -4, 6, -1.5, -2.2);

      // I. Warm Village Lantern Posts with Self-Illuminated Glowing Lanterns
      const lanternPositions = [
        { x: -28, z: 2 },
        { x: -36, z: 16 },
        { x: -45, z: 12 },
        { x: -35, z: -12 },
        { x: -14, z: -32 },
        { x: 12, z: -28 }
      ];

      lanternPositions.forEach(lp => {
        const lPost = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.0, 6), darkWoodMat);
        lPost.position.set(lp.x, 1.5, lp.z);
        villageGroup.add(lPost);

        const lLamp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.3), warmWindowMat);
        lLamp.position.set(lp.x + 0.35, 2.8, lp.z);
        villageGroup.add(lLamp);
      });

      // J. Clusters of Countryside Trees
      const villageTreePositions = [
        { x: -30, z: 22, s: 1.2 },
        { x: -42, z: 10, s: 1.35 },
        { x: -46, z: -6, s: 1.15 },
        { x: -35, z: -26, s: 1.3 },
        { x: -22, z: -36, s: 1.25 },
        { x: 4, z: -42, s: 1.2 },
        { x: 26, z: -38, s: 1.3 }
      ];

      villageTreePositions.forEach(tp => {
        create3DCanopyTree(tp.x, tp.z, tp.s);
      });

      // K. Floating Fairy Lights / Fireflies around Corridor
      const fireflyCount = 36;
      const fireflyGeo = new THREE.BufferGeometry();
      const fireflyPositions = new Float32Array(fireflyCount * 3);

      for (let i = 0; i < fireflyCount; i++) {
        fireflyPositions[i * 3] = -12 - Math.random() * 30;
        fireflyPositions[i * 3 + 1] = 0.8 + Math.random() * 2.5;
        fireflyPositions[i * 3 + 2] = -20 + Math.random() * 45;
      }

      fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
      const fireflyMat = new THREE.PointsMaterial({
        color: 0xffea78,
        size: 0.35,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
      villageGroup.add(fireflyPoints);
      firefliesRef.current = fireflyPoints;

      scene.add(villageGroup);
    };

    // Instantiate Countryside Village
    createVillageSettlement();
  };

  // Mouse Orbit Drag Controls, 2-Finger Pinch Zoom & 3D Direct Object Selection
  const handlePointerDown = (e: React.PointerEvent) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore pointer capture errors on older browsers
    }

    if (activePointers.current.size === 1) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragDist.current = 0;
    } else if (activePointers.current.size === 2) {
      // 2-finger pinch zoom initiation
      isDragging.current = false;
      const pts: Array<{ x: number; y: number }> = Array.from(activePointers.current.values());
      if (pts.length >= 2) {
        initialPinchDist.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        initialPinchRadius.current = orbitRadius.current;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mousePos.current.targetX = nx;
    mousePos.current.targetY = ny;

    // Handle 2-finger pinch zoom on mobile devices
    if (activePointers.current.size >= 2 && initialPinchDist.current && initialPinchDist.current > 0) {
      const pts: Array<{ x: number; y: number }> = Array.from(activePointers.current.values());
      if (pts.length >= 2) {
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (currentDist > 5) {
          const scale = initialPinchDist.current / currentDist;
          const newRadius = Math.max(12, Math.min(46, initialPinchRadius.current * scale));
          orbitRadius.current = newRadius;
          if (!isCinematicTour) {
            const x = newRadius * Math.sin(orbitAngles.current.phi) * Math.sin(orbitAngles.current.theta);
            const y = newRadius * Math.cos(orbitAngles.current.phi);
            const z = newRadius * Math.sin(orbitAngles.current.phi) * Math.cos(orbitAngles.current.theta);
            targetCamPos.current.set(targetLookAt.current.x + x, Math.max(1.8, targetLookAt.current.y + y), targetLookAt.current.z + z);
          }
        }
      }
      return;
    }

    if (isDragging.current) {
      const rawDx = e.clientX - dragStart.current.x;
      const rawDy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };

      const dx = shouldRotateLandscape ? rawDy : rawDx;
      const dy = shouldRotateLandscape ? -rawDx : rawDy;

      dragDist.current += Math.hypot(dx, dy);

      orbitAngles.current.theta -= dx * 0.007;
      orbitAngles.current.phi = Math.max(0.15, Math.min(Math.PI / 2.2, orbitAngles.current.phi + dy * 0.007));

      if (!isCinematicTour) {
        const x = orbitRadius.current * Math.sin(orbitAngles.current.phi) * Math.sin(orbitAngles.current.theta);
        const y = orbitRadius.current * Math.cos(orbitAngles.current.phi);
        const z = orbitRadius.current * Math.sin(orbitAngles.current.phi) * Math.cos(orbitAngles.current.theta);
        targetCamPos.current.set(targetLookAt.current.x + x, Math.max(1.8, targetLookAt.current.y + y), targetLookAt.current.z + z);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);
    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }

    if (activePointers.current.size < 2) {
      initialPinchDist.current = null;
    }
    if (activePointers.current.size === 0) {
      isDragging.current = false;
    }

    // Check for direct tap/click on 3D Villa model
    if (dragDist.current < 6 && containerRef.current && cameraRef.current && villaGroupRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      let ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (shouldRotateLandscape) {
        const tempX = nx;
        nx = -ny;
        ny = tempX;
      }
      const mouse = new THREE.Vector2(nx, ny);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(villaGroupRef.current.children, true);
      if (intersects.length > 0) {
        const villaSpot = LANDMARK_HOTSPOTS.find(h => h.id === 'geometric_villa');
        if (villaSpot) {
          onSelectHotspot(activeHotspotId === 'geometric_villa' ? null : villaSpot);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Smooth zoom in/out with mouse wheel or trackpad pinch
    const zoomDelta = Math.sign(e.deltaY) * 1.5;
    orbitRadius.current = Math.max(12, Math.min(46, orbitRadius.current + zoomDelta));
    if (!isCinematicTour) {
      const x = orbitRadius.current * Math.sin(orbitAngles.current.phi) * Math.sin(orbitAngles.current.theta);
      const y = orbitRadius.current * Math.cos(orbitAngles.current.phi);
      const z = orbitRadius.current * Math.sin(orbitAngles.current.phi) * Math.cos(orbitAngles.current.theta);
      targetCamPos.current.set(targetLookAt.current.x + x, Math.max(1.8, targetLookAt.current.y + y), targetLookAt.current.z + z);
    }
  };

  const resetCamera = () => {
    setIsCinematicTour(false);
    onSelectHotspot(null);
    const w = containerRef.current?.clientWidth || window.innerWidth;
    const h = containerRef.current?.clientHeight || window.innerHeight;
    const aspect = w / h;
    const isMobile = w < 640 || aspect < 0.9;
    const defaultR = isMobile ? 32 : 28;
    orbitRadius.current = defaultR;
    orbitAngles.current = { theta: 0.85, phi: 0.48 };

    const x = defaultR * Math.sin(0.48) * Math.sin(0.85);
    const y = defaultR * Math.cos(0.48);
    const z = defaultR * Math.sin(0.48) * Math.cos(0.85);
    targetCamPos.current.set(x, Math.max(1.8, y + 2), z);
    targetLookAt.current.set(0, 2, 0);
  };

  const lockLandscape = async () => {
    try {
      const orientation = window.screen?.orientation as unknown as { lock?: (o: string) => Promise<void> } | undefined;
      if (orientation && typeof orientation.lock === 'function') {
        await orientation.lock('landscape');
      } else if ((window.screen as any)?.lockOrientation) {
        (window.screen as any).lockOrientation('landscape');
      } else if ((window.screen as any)?.mozLockOrientation) {
        (window.screen as any).mozLockOrientation('landscape');
      } else if ((window.screen as any)?.msLockOrientation) {
        (window.screen as any).msLockOrientation('landscape');
      }
    } catch {
      // Browser or iframe may restrict orientation lock
    }
  };

  const unlockOrientation = () => {
    try {
      const orientation = window.screen?.orientation as unknown as { unlock?: () => void } | undefined;
      if (orientation && typeof orientation.unlock === 'function') {
        orientation.unlock();
      } else if ((window.screen as any)?.unlockOrientation) {
        (window.screen as any).unlockOrientation();
      }
    } catch {
      // Ignore
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement && !isFullscreen) {
      setIsFullscreen(true);
      if (containerRef.current.requestFullscreen) {
        try {
          await containerRef.current.requestFullscreen();
          await lockLandscape();
        } catch {
          setIsFullscreen(true);
          await lockLandscape();
        }
      } else {
        setIsFullscreen(true);
        await lockLandscape();
      }
    } else {
      setIsFullscreen(false);
      unlockOrientation();
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // Ignore
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      style={
        shouldRotateLandscape
          ? {
              position: 'fixed',
              left: '50%',
              top: '50%',
              width: `${viewportSize.height}px`,
              height: `${viewportSize.width}px`,
              transform: 'translate(-50%, -50%) rotate(90deg)',
              transformOrigin: 'center center',
              zIndex: 9999,
              maxWidth: 'none',
              maxHeight: 'none',
            }
          : isFullscreen
          ? {
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
            }
          : undefined
      }
      className={`relative overflow-hidden select-none cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#0a1e14] via-[#0f2a1d] to-[#0a1e14] touch-none ${
        isFullscreen
          ? 'm-0 p-0 rounded-none border-none shadow-none'
          : 'h-full w-full rounded-2xl sm:rounded-3xl'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Fullscreen Floating Exit Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 pointer-events-auto bg-[#0d1410]/90 text-[#f5d7a1] hover:text-white p-2.5 sm:p-3 rounded-full border border-[#2d4032] hover:bg-[#c89b58] hover:border-[#c89b58] shadow-2xl transition-all flex items-center gap-1.5 group"
          title="Exit Fullscreen (Esc)"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
          <span className="text-[11px] sm:text-xs font-mono font-medium pr-1">Exit</span>
        </button>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between gap-2 pointer-events-none z-20">
        {/* Top Left: Clean Cozy Cottage 3D Badge */}
        <div className="pointer-events-auto bg-[#091610]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#52b788]/25 shadow-xl flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#52b788] animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-[#f5f0e8] uppercase font-bold whitespace-nowrap">Cozy Cottage 3D</span>
        </div>

        {/* Right: Mood Time-of-Day & View Controls */}
        <div className={`flex items-center gap-1 sm:gap-1.5 pointer-events-auto bg-[#091610]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-[#52b788]/25 shadow-xl ${isFullscreen ? 'mr-14' : ''}`}>
          {/* Time of Day Moods */}
          <div className="flex items-center gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-[#52b788]/20">
            <button
              onClick={() => onMoodChange('dawn')}
              title="Sunny Forest Daylight"
              aria-label="Daylight Mood"
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs transition-all ${
                mood === 'dawn' ? 'bg-[#52b788] text-[#07150e] font-bold' : 'text-[#a3b18a] hover:bg-[#12281d] hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => onMoodChange('golden')}
              title="Amber Sunset"
              aria-label="Golden Sunset Mood"
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs transition-all ${
                mood === 'golden' ? 'bg-[#dda15e] text-[#1a0f05] font-bold' : 'text-[#a3b18a] hover:bg-[#12281d] hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => onMoodChange('night')}
              title="Night Illumination & Warm Embers"
              aria-label="Night Mood"
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs transition-all ${
                mood === 'night' ? 'bg-[#74c69d] text-[#07150e] font-bold' : 'text-[#a3b18a] hover:bg-[#12281d] hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Reset Perspective */}
          <button
            onClick={resetCamera}
            title="Reset Perspective"
            aria-label="Reset Camera"
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-[#a3b18a] hover:bg-[#12281d] hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Mobile Landscape Orientation Mode Toggle */}
          {isFullscreen && isMobile && (
            <button
              onClick={() => setForceOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
              title={shouldRotateLandscape ? "Switch to Portrait View" : "Switch to Landscape View"}
              aria-label="Toggle Landscape View"
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs transition-all flex items-center gap-1 ${
                shouldRotateLandscape
                  ? 'bg-[#52b788]/20 text-[#74c69d] border border-[#52b788]/50'
                  : 'text-[#a3b18a] hover:bg-[#12281d] hover:text-white'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${shouldRotateLandscape ? 'rotate-90' : ''}`} />
              <span className="text-[10px] font-mono hidden xs:inline">{shouldRotateLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label="Toggle Fullscreen"
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-[#a3b18a] hover:bg-[#12281d] hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#52b788]" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>

      {/* Floating 2D Screen Interactive Hotspots mapped on the 3D Model */}
      {screenHotspots.map(spot => {
        if (!spot.visible) return null;
        const isActive = activeHotspotId === spot.id;
        const hotspotData = LANDMARK_HOTSPOTS.find(h => h.id === spot.id);

        return (
          <div
            key={spot.id}
            style={{
              left: `${spot.x}px`,
              top: `${spot.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute z-10 pointer-events-auto group touch-manipulation"
          >
            <button
              onClick={() => onSelectHotspot(isActive ? null : hotspotData || null)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer ${
                isActive
                  ? 'bg-[#52b788] text-[#07150e] scale-105 sm:scale-110 ring-2 sm:ring-4 ring-[#52b788]/30 font-bold'
                  : 'bg-[#091610]/90 border border-[#52b788]/30 text-[#d8d3c5] hover:border-[#52b788] hover:text-white hover:scale-105'
              }`}
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0 ${isActive ? 'bg-[#07150e]' : 'bg-[#52b788] animate-ping'}`} />
              <span className="text-[10px] sm:text-[11px] font-mono whitespace-nowrap tracking-wide">{spot.name}</span>
            </button>
          </div>
        );
      })}

      {/* Bottom Center Interaction Tip Badge */}
      <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-15 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#091610]/80 backdrop-blur-md border border-[#52b788]/20 text-[10px] text-[#d8d3c5]/80 font-mono shadow-md">
        <span>👆 Drag to rotate</span>
        <span className="text-[#52b788]">·</span>
        <span>Scroll / Pinch to zoom</span>
        <span className="text-[#52b788]">·</span>
        <span>Tap points to explore</span>
      </div>

      {/* Bottom Active Hotspot Details (When selected) */}
      {activeHotspotId && (
        <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 flex justify-start pointer-events-none z-20">
          {(() => {
            const currentSpot = LANDMARK_HOTSPOTS.find(h => h.id === activeHotspotId);
            if (!currentSpot) return null;
            return (
              <div className="pointer-events-auto w-full sm:max-w-md p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#091610]/95 border border-[#52b788]/50 backdrop-blur-md shadow-2xl space-y-1.5 sm:space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-[#12281d] text-[#74c69d] border border-[#52b788]/30">
                    {currentSpot.category}
                  </span>
                  <button
                    onClick={() => onSelectHotspot(null)}
                    className="text-xs text-[#a3b18a] hover:text-white px-2 py-0.5 rounded-md hover:bg-[#12281d] cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
                <h4 className="text-base sm:text-lg font-serif text-[#f7f5ee]">{currentSpot.name}</h4>
                <p className="text-xs text-[#d8d3c5] leading-relaxed line-clamp-2">{currentSpot.description}</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
