/**
 * Geography of Absence - Main Entry Point
 * An immersive 3D memorial for those lost in the 2026 Iran massacres
 * 
 * Concept: Red Tulips on Iran Map
 * - Each tulip represents one person killed
 * - Tulip is placed at the location where they died
 * - Click a tulip to see victim information
 */

import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import gsap from 'gsap';
import { cities, victims, getVictimsByCity, getCityById, statistics, getSupabaseVictims } from './data/victims.js';
import { initVisit, markCityViewed, getSoundEnabled, setSoundEnabled } from './utils/persistence.js';
import { initI18n, toggleLanguage, getCurrentLanguage, formatDateLocalized, formatAge, t, setLanguage } from './utils/i18n.js';
import { NarrativeManager } from './utils/narrative.js';

// ============================================
// Configuration
// ============================================

const CONFIG = {
    colors: {
        background: 0x0a0a0a,
        mapFill: 0x1a1a1a,
        mapBorder: 0xffffff,
        tulipRed: 0x8b0000,
        tulipRedBright: 0xcc0000,
        tulipStem: 0x1a3d1a,
        fog: 0x0a0a0a
    },
    camera: {
        fov: 45,
        near: 0.1,
        far: 1000,
        startPosition: { x: 0, y: 80, z: 100 },
        lookAt: { x: 0, y: 0, z: 0 }
    },
    map: {
        scale: 0.15, // Scale factor for SVG (800x600 scaled down)
        offsetX: -60, // Center horizontally
        offsetZ: -45  // Center vertically (negative because SVG Y flips)
    },
    animation: {
        loadingDuration: 3000,
        tulipGrowDuration: 2000
    }
};

// ============================================
// Global State
// ============================================

let scene, camera, renderer, controls;
let iranMapGroup, tulips = [];
let raycaster, mouse;
let selectedTulip = null;
let visitState;
let currentlyDisplayedVictim = null; // Track current victim for language updates
let narrative;
let zoomedTulip = null;
let lastClickTime = 0;

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const introText = document.getElementById('intro-text');
const controlsHint = document.getElementById('controls-hint');
const infoButton = document.getElementById('info-button');
const infoPanel = document.getElementById('info-panel');
const closePanel = document.getElementById('close-panel');
const victimPopup = document.getElementById('victim-popup');
const closeVictimPopup = document.getElementById('close-victim-popup');
const soundToggle = document.getElementById('sound-toggle');
const ambientAudio = document.getElementById('ambient-audio');
const langToggle = document.getElementById('lang-toggle');
const hoverLabel = document.getElementById('victim-hover-label');
const memorialTagline = document.getElementById('memorial-tagline');

// Onboarding Elements
const onboardingOverlay = document.getElementById('onboarding-overlay');
const onboardingStepLang = document.getElementById('onboarding-step-lang');
const onboardingStepSound = document.getElementById('onboarding-step-sound');
const btnLangEn = document.getElementById('btn-lang-en');
const btnLangFa = document.getElementById('btn-lang-fa');
const btnSoundOn = document.getElementById('btn-sound-on');
const btnSoundOff = document.getElementById('btn-sound-off');

// ============================================
// Initialization
// ============================================

async function init() {
    // Initialize i18n (language support)
    initI18n();

    // Initialize visit tracking
    visitState = initVisit();

    // Initialize Narrative Manager
    narrative = new NarrativeManager();
    narrative.onComplete = () => {
        transitionTo3D();
    };

    // Setup Three.js (Keep it hidden initially)
    setupScene();
    setupCamera();
    setupRenderer();
    setupControls();
    setupLighting();
    setupRaycaster();

    // Load Iran map from SVG and create tulips
    await loadIranMap();
    await createTulips();

    // Setup event listeners
    setupEventListeners();

    // Setup onboarding logic
    setupOnboarding();

    // Setup info panel statistics
    setupStatistics();

    // Start loading sequence
    await startLoadingSequence();

    // Start animation loop
    animate();
}

/**
 * Handle Onboarding Flow
 */
function setupOnboarding() {
    // Language Selection
    btnLangEn.addEventListener('click', () => {
        setLanguage('en');
        updateNamesBackgroundLanguage(); // Sync background early
        goToOnboardingStep(onboardingStepSound);
    });

    btnLangFa.addEventListener('click', () => {
        setLanguage('fa');
        updateNamesBackgroundLanguage(); // Sync background early
        goToOnboardingStep(onboardingStepSound);
    });

    // Sound Selection
    btnSoundOn.addEventListener('click', () => {
        setSoundEnabled(true);
        updateSoundUI();
        finishOnboarding();
    });

    btnSoundOff.addEventListener('click', () => {
        setSoundEnabled(false);
        updateSoundUI();
        finishOnboarding();
    });
}

function goToOnboardingStep(nextStep) {
    const currentStep = document.querySelector('.onboarding-step:not(.hidden)');

    gsap.to(currentStep, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
            currentStep.classList.add('hidden');
            nextStep.classList.remove('hidden');
            gsap.fromTo(nextStep,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    });
}

async function finishOnboarding() {
    // Fade out onboarding overlay
    onboardingOverlay.classList.add('fade-out');

    // Start narrative engine - don't await to avoid blocking transition
    narrative.init();

    // Play initial subtle audio if enabled
    if (getSoundEnabled()) {
        ambientAudio.volume = 0;
        ambientAudio.play().catch(e => console.warn('Audio auto-play prevented:', e));
        gsap.to(ambientAudio, { volume: 0.1, duration: 2 }); // Very quiet wind-like start
    }

    // Completely remove overlay after transition to ensure no click interference
    setTimeout(() => {
        onboardingOverlay.style.display = 'none';
    }, 1000);
}

function setupScene() {
    scene = new THREE.Scene();
    // Remove background color to allow the names-background layer to show through
    scene.background = null;
    scene.fog = new THREE.FogExp2(CONFIG.colors.fog, 0.004);
}

function setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, aspect, CONFIG.camera.near, CONFIG.camera.far);
    camera.position.set(
        CONFIG.camera.startPosition.x,
        CONFIG.camera.startPosition.y,
        CONFIG.camera.startPosition.z
    );
    camera.lookAt(CONFIG.camera.lookAt.x, CONFIG.camera.lookAt.y, CONFIG.camera.lookAt.z);
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true // Enable transparency
    });
    renderer.setClearColor(0x000000, 0); // Explicitly set clear alpha to 0 for transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
}

function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = Math.PI / 6;
    controls.enablePan = false;
    controls.enabled = false; // Disabled until loading complete
}

function setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambient);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(30, 50, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Subtle red accent from below
    const accentLight = new THREE.PointLight(CONFIG.colors.tulipRed, 0.3, 100);
    accentLight.position.set(0, -10, 0);
    scene.add(accentLight);

    // Hemisphere light for natural feel
    const hemiLight = new THREE.HemisphereLight(0x606060, 0x404040, 0.5);
    scene.add(hemiLight);
}

function setupRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

// ============================================
// Load Iran Map from SVG
// ============================================

async function loadIranMap() {
    return new Promise((resolve, reject) => {
        const loader = new SVGLoader();

        loader.load(
            '/svg/iran-map.svg',
            (data) => {
                iranMapGroup = new THREE.Group();

                const paths = data.paths;

                paths.forEach((path) => {
                    const shapes = SVGLoader.createShapes(path);

                    shapes.forEach((shape) => {
                        // Create filled shape - using a custom shader or enhanced material for "wounded" look
                        const geometry = new THREE.ShapeGeometry(shape, 12); // Increase segments for better lighting/textures

                        const fillMaterial = new THREE.MeshStandardMaterial({
                            color: CONFIG.colors.mapFill,
                            roughness: 0.9,
                            metalness: 0.05,
                            side: THREE.DoubleSide,
                            emissive: 0x000000
                        });

                        // Add "cracked" feel via custom shader modification
                        fillMaterial.onBeforeCompile = (shader) => {
                            shader.uniforms.uTime = { value: 0 };
                            fillMaterial.userData.shader = shader; // Store for updates

                            shader.vertexShader = `
                                varying vec3 vPos;
                                ${shader.vertexShader}
                            `.replace(
                                `#include <begin_vertex>`,
                                `
                                #include <begin_vertex>
                                vPos = position;
                                `
                            );

                            shader.fragmentShader = `
                                uniform float uTime;
                                varying vec3 vPos;
                                ${shader.fragmentShader}
                            `.replace(
                                `#include <color_fragment>`,
                                `
                                #include <color_fragment>
                                // Simple procedural crack/noise logic using position instead of UVs
                                float noise = sin(vPos.x * 10.0) * sin(vPos.y * 10.0);
                                if (noise > 0.98) {
                                    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2, 0.0, 0.0), 0.6);
                                }
                                `
                            );
                        };

                        const mesh = new THREE.Mesh(geometry, fillMaterial);
                        iranMapGroup.add(mesh);
                    });

                    // Create stroke/border
                    const strokeColor = path.userData.style.stroke;
                    if (strokeColor !== undefined && strokeColor !== 'none') {
                        const material = new THREE.LineBasicMaterial({
                            color: CONFIG.colors.mapBorder,
                            linewidth: 1,
                            transparent: true,
                            opacity: 0.7
                        });

                        path.subPaths.forEach((subPath) => {
                            const points = subPath.getPoints();
                            const geometry = new THREE.BufferGeometry().setFromPoints(points);
                            const line = new THREE.Line(geometry, material);
                            iranMapGroup.add(line);
                        });
                    }
                });

                // Transform: rotate to lay flat, scale (with Y flip to mirror), and center
                iranMapGroup.rotation.x = -Math.PI / 2;
                iranMapGroup.scale.set(CONFIG.map.scale, -CONFIG.map.scale, CONFIG.map.scale);
                iranMapGroup.position.set(CONFIG.map.offsetX, 0, CONFIG.map.offsetZ);

                // Start below view for animation
                iranMapGroup.position.y = -15;

                scene.add(iranMapGroup);
                resolve();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading SVG:', error);
                reject(error);
            }
        );
    });
}

// ============================================
// Convert geo coordinates to map position
// ============================================

function geoToMapPosition(lon, lat) {
    // Iran bounds approximately: 44-64 longitude, 25-40 latitude
    // The SVG is 800x600 with viewBox "0 0 800 600"
    // Iran in the SVG spans roughly x: 100-700, y: 30-580

    // After SVG group is rotated -90° on X axis:
    // - SVG X remains scene X
    // - SVG Y becomes -scene Z (since we look down positive Y axis)

    // Normalize geo coordinates
    const normalizedLon = (lon - 44) / (64 - 44);  // West to East: 0 to 1
    const normalizedLat = (lat - 25) / (40 - 25);  // South to North: 0 to 1

    // Map to SVG pixel coordinates
    // Longitude maps to X: 100 (west) to 700 (east)
    // Latitude maps to Y: 580 (south) to 30 (north) - NOTE: SVG Y is inverted
    const svgX = 100 + normalizedLon * 600;
    const svgY = 580 - normalizedLat * 550;

    // Apply transformations matching the map group:
    // 1. Scale by CONFIG.map.scale
    // 2. Add offset
    // After -90° X rotation: SVG (x, y) -> scene (x, -y) for the flat surface
    // But since map sits at y=0, we use Z instead of -Y
    const x = (svgX * CONFIG.map.scale) + CONFIG.map.offsetX;
    const z = (svgY * CONFIG.map.scale) + CONFIG.map.offsetZ;

    return { x, z };
}

// ============================================
// Tulip Creation
// ============================================

function createTulip(victim, position) {
    const group = new THREE.Group();

    // Low-poly stem (hexagonal prism for geometric look)
    const stemGeometry = new THREE.CylinderGeometry(0.04, 0.06, 1.5, 6);
    const stemMaterial = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.tulipStem,
        roughness: 0.6,
        flatShading: true
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.75;
    group.add(stem);

    // Leaf material (bright green for contrast)
    const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d5a27,
        roughness: 0.5,
        flatShading: true,
        side: THREE.DoubleSide
    });

    // Create 3D geometric leaf using ExtrudeGeometry with curved shape
    function createLeaf3D() {
        const leafShape = new THREE.Shape();
        // Pointed leaf shape
        leafShape.moveTo(0, 0);
        leafShape.quadraticCurveTo(0.12, 0.5, 0.06, 1.0);
        leafShape.lineTo(0, 1.3);  // tip
        leafShape.lineTo(-0.06, 1.0);
        leafShape.quadraticCurveTo(-0.12, 0.5, 0, 0);

        // Extrude for 3D depth
        const extrudeSettings = {
            steps: 2,
            depth: 0.06,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 1
        };

        const leafGeometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
        // Curve the leaf slightly for more natural 3D look
        const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
        return leafMesh;
    }

    // Left leaf - 3D, pointing upward, close to stem
    const leftLeaf = createLeaf3D();
    leftLeaf.position.set(-0.08, 0.2, -0.03);
    leftLeaf.rotation.y = Math.PI * 0.15;
    leftLeaf.rotation.z = Math.PI * 0.06;
    leftLeaf.scale.set(0.8, 0.9, 1);
    group.add(leftLeaf);

    // Right leaf - 3D, pointing upward, close to stem
    const rightLeaf = createLeaf3D();
    rightLeaf.position.set(0.08, 0.2, -0.03);
    rightLeaf.rotation.y = -Math.PI * 0.15;
    rightLeaf.rotation.z = -Math.PI * 0.06;
    rightLeaf.scale.set(0.8, 0.9, 1);
    group.add(rightLeaf);

    // Tulip flower head - fully 3D low-poly cup shape
    const petalGroup = new THREE.Group();
    petalGroup.position.y = 1.5;

    // Petal material (red)
    const petalMaterial = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.tulipRed,
        roughness: 0.4,
        metalness: 0.05,
        emissive: CONFIG.colors.tulipRed,
        emissiveIntensity: 0.1,
        flatShading: true
    });

    // Create tulip cup using LatheGeometry for proper 3D shape
    // Define the profile of the tulip cup
    const points = [];
    points.push(new THREE.Vector2(0.02, 0));      // Bottom center (narrow)
    points.push(new THREE.Vector2(0.08, 0.1));    // Start widening
    points.push(new THREE.Vector2(0.18, 0.25));   // Belly
    points.push(new THREE.Vector2(0.22, 0.4));    // Widest part
    points.push(new THREE.Vector2(0.18, 0.55));   // Start tapering inward
    points.push(new THREE.Vector2(0.12, 0.65));   // Near top (petal tips curve in slightly)
    points.push(new THREE.Vector2(0.15, 0.72));   // Petal tips flare out slightly

    // Create lathe geometry with low segment count for angular/low-poly look
    const tulipCupGeometry = new THREE.LatheGeometry(points, 6); // 6 segments for hexagonal look
    const tulipCup = new THREE.Mesh(tulipCupGeometry, petalMaterial);
    petalGroup.add(tulipCup);

    // Add inner core/center for visual depth
    const coreGeometry = new THREE.ConeGeometry(0.06, 0.25, 5);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x660000,
        roughness: 0.6,
        flatShading: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.y = 0.35;
    petalGroup.add(core);

    // Store references for breathing animation
    group.userData.bulb = petalGroup;
    group.userData.petalMaterial = petalMaterial;

    group.add(petalGroup);

    // Position the tulip on the map surface (y=0)
    group.position.set(position.x, 0, position.z);

    // Start with zero scale for animation
    group.scale.set(0, 0, 0);

    // Store victim data
    group.userData = { victim, isTulip: true };

    return group;
}

async function createTulips() {
    // Fetch victims from Supabase (falls back to local data)
    const activeVictims = await getSupabaseVictims();

    // Initialize names background with victim data
    initNamesBackground(activeVictims);

    // Create tulips for each victim
    activeVictims.forEach((victim, index) => {

        // Get city coordinates
        const city = getCityById(victim.city_id);
        if (!city) return;

        // Convert geo coordinates to map position
        const pos = geoToMapPosition(city.coordinates[0], city.coordinates[1]);

        // Add some random offset so tulips don't overlap perfectly
        const offsetX = (Math.random() - 0.5) * 4;
        const offsetZ = (Math.random() - 0.5) * 4;

        const position = { x: pos.x + offsetX, z: pos.z + offsetZ };

        const tulip = createTulip(victim, position);
        tulip.userData.index = index;

        tulips.push(tulip);
        scene.add(tulip);
    });
}

function revealTulips() {
    tulips.forEach((tulip, index) => {
        // Stagger the growth animation
        const delay = index * 0.02;

        gsap.to(tulip.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            delay: delay,
            ease: 'elastic.out(1, 0.5)'
        });
    });
}

// ============================================
// Loading Sequence
// ============================================

async function startLoadingSequence() {
    return new Promise(resolve => {
        // Phase 1: Loading bar completes
        setTimeout(() => {
            loadingOverlay.classList.add('fade-out');

            // Reveal onboarding
            onboardingOverlay.classList.remove('hidden');
            gsap.fromTo(onboardingOverlay, { opacity: 0 }, { opacity: 1, duration: 1 });

            resolve();
        }, 2000);
    });
}

/**
 * Transition from Narrative to 3D World (Act III)
 */
async function transitionTo3D() {
    // 1. Narrative faints away
    narrative.transitionToMap();

    // 2. Audio fades in/deepens
    if (getSoundEnabled()) {
        gsap.to(ambientAudio, { volume: 0.5, duration: 4 });
    }

    // 3. Reveal Names Background and Canvas
    showNamesBackground();
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.classList.remove('hidden');
    gsap.fromTo(canvasContainer, { opacity: 0 }, { opacity: 1, duration: 3 });

    // 4. Map rises from depth
    gsap.to(iranMapGroup.position, {
        y: 0,
        duration: 4,
        ease: 'power2.out'
    });

    // 5. Tulips growth
    setTimeout(() => {
        revealTulips();
    }, 2000);

    // 6. Final UI revealing
    setTimeout(() => {
        controls.enabled = true;
        infoButton.classList.add('visible');
        soundToggle.classList.add('visible');
        langToggle.classList.add('visible');

        const tagline = document.getElementById('memorial-tagline');
        tagline.classList.remove('hidden');
        tagline.classList.add('visible');
    }, 5000);
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Mouse move for hover effects
    window.addEventListener('mousemove', onMouseMove);

    // Click for tulip selection
    window.addEventListener('click', onMouseClick);

    // Info panel
    infoButton.addEventListener('click', () => {
        infoPanel.classList.remove('hidden');
        infoPanel.classList.add('visible');
        animateStatistics();
    });

    closePanel.addEventListener('click', () => {
        infoPanel.classList.remove('visible');
        setTimeout(() => infoPanel.classList.add('hidden'), 600);
    });

    // Close victim popup when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#victim-popup') && !e.target.closest('canvas')) {
            hideVictimPopup();
        }
    });

    // Close victim popup when clicking the close button
    closeVictimPopup.addEventListener('click', hideVictimPopup);

    // Close on clicking outside
    window.addEventListener('mousedown', (e) => {
        if (!e.target.closest('#victim-popup') && !e.target.closest('canvas')) {
            if (zoomedTulip) resetCamera();
            hideVictimPopup();
        }
    });

    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);

    // Language toggle
    langToggle.addEventListener('click', () => {
        toggleLanguage();
        // Update victim popup if it's currently visible
        updateVictimPopupLanguage();
        // Update names background
        updateNamesBackgroundLanguage();
    });

    // Initialize sound state
    updateSoundUI();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update names background parallax
    updateNamesParallax(event.clientX, event.clientY);

    if (controls.enabled) {
        checkTulipHover();
    }
}

function onMouseClick(event) {
    if (!controls.enabled) return;

    raycaster.setFromCamera(mouse, camera);
    const tulipMeshes = tulips.flatMap(t => t.children);
    const intersects = raycaster.intersectObjects(tulipMeshes, true);

    if (intersects.length > 0) {
        // Find the parent tulip group
        let tulip = intersects[0].object;
        while (tulip.parent && !tulip.userData.isTulip) {
            tulip = tulip.parent;
        }

        if (tulip.userData.isTulip) {
            handleTulipInteraction(tulip, event.clientX, event.clientY);
        }
    } else {
        // Clicked empty space
        if (zoomedTulip) {
            resetCamera();
        }
        hideVictimPopup();
    }
}

function handleTulipInteraction(tulip, x, y) {
    const victim = tulip.userData.victim;

    // Glow corresponding name in the background
    glowNameForVictim(victim.id);

    if (zoomedTulip === tulip) {
        // Second click: Show story panel
        showVictimPopup(victim, x, y, true);
    } else {
        // First click: Zoom in and show age/city
        zoomedTulip = tulip;
        zoomToTulip(tulip);
        showVictimPopup(victim, x, y, false); // false = basic info only
    }
}

function zoomToTulip(tulip) {
    const targetPos = new THREE.Vector3().copy(tulip.position);

    // Position camera offset from tulip
    const cameraPos = new THREE.Vector3().copy(targetPos).add(new THREE.Vector3(0, 10, 15));

    gsap.to(camera.position, {
        x: cameraPos.x,
        y: cameraPos.y,
        z: cameraPos.z,
        duration: 2,
        ease: 'power2.inOut'
    });

    gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => controls.update()
    });
}

function resetCamera() {
    zoomedTulip = null;
    gsap.to(camera.position, {
        x: CONFIG.camera.startPosition.x,
        y: CONFIG.camera.startPosition.y,
        z: CONFIG.camera.startPosition.z,
        duration: 2,
        ease: 'power2.inOut'
    });

    gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => controls.update()
    });
}

function checkTulipHover() {
    raycaster.setFromCamera(mouse, camera);
    const tulipMeshes = tulips.flatMap(t => t.children);
    const intersects = raycaster.intersectObjects(tulipMeshes, true);

    if (intersects.length > 0) {
        // Find the parent tulip group
        let tulip = intersects[0].object;
        while (tulip.parent && !tulip.userData.isTulip) {
            tulip = tulip.parent;
        }

        if (tulip.userData.isTulip) {
            // Hover state: Tulip brightens slightly, Name appears only
            gsap.to(tulip.scale, {
                x: 1.1,
                y: 1.1,
                z: 1.1,
                duration: 0.2
            });

            if (tulip.userData.petalMaterial) {
                tulip.userData.petalMaterial.emissiveIntensity = 0.5;
            }

            showHoverLabel(tulip.userData.victim);
            document.body.style.cursor = 'pointer';
            return;
        }
    }

    // Reset all tulips
    tulips.forEach(tulip => {
        if (tulip.userData.petalMaterial) {
            // Only reset if not breathing phase or just let breathing handle it
        }
    });

    hideHoverLabel();
    document.body.style.cursor = 'grab';
}

function showHoverLabel(victim) {
    const currentLang = getCurrentLanguage();
    hoverLabel.textContent = currentLang === 'fa' ? victim.name_fa : victim.name_en;
    hoverLabel.style.left = `${(mouse.x + 1) * window.innerWidth / 2}px`;
    hoverLabel.style.top = `${(-mouse.y + 1) * window.innerHeight / 2}px`;
    hoverLabel.classList.add('visible');
    hoverLabel.classList.remove('hidden');
}

function hideHoverLabel() {
    hoverLabel.classList.remove('visible');
}

// ============================================
// Victim Popup
// ============================================

function showVictimPopup(victim, x, y, isFullStory = false) {
    // Store for language updates
    currentlyDisplayedVictim = victim;

    const city = getCityById(victim.city_id);
    const currentLang = getCurrentLanguage();

    // Update popup content based on language
    const victimNameEl = document.getElementById('victim-name');
    const victimNameEnEl = document.getElementById('victim-name-en');

    if (currentLang === 'fa') {
        victimNameEl.textContent = victim.name_fa;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? city.nameFa : victim.city_name_fa;
    } else {
        victimNameEl.textContent = victim.name_en;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? `${city.name}` : victim.city_name_en;
    }

    document.getElementById('victim-age').textContent = formatAge(victim.age);
    document.getElementById('victim-date').textContent = formatDateLocalized(victim.death_date);

    // Handle Victim Image and Story (Only if isFullStory)
    const imageContainer = document.getElementById('victim-image-container');
    const imageEl = document.getElementById('victim-image');

    // Add story text element if it doesn't exist
    let storyEl = document.getElementById('victim-story');
    if (!storyEl) {
        storyEl = document.createElement('p');
        storyEl.id = 'victim-story';
        storyEl.className = 'victim-story';
        document.querySelector('.victim-info').appendChild(storyEl);
    }

    if (isFullStory) {
        victimPopup.classList.add('full-story');
        if (victim.image_url) {
            const imageUrl = victim.image_url.startsWith('http')
                ? victim.image_url
                : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/victim-images/${victim.image_url}`;
            imageEl.src = imageUrl;
            imageContainer.classList.remove('hidden');
        } else {
            imageContainer.classList.add('hidden');
        }

        storyEl.textContent = currentLang === 'fa' ? (victim.story_fa || "") : (victim.story_en || "");
        storyEl.classList.remove('hidden');
    } else {
        victimPopup.classList.remove('full-story');
        imageContainer.classList.add('hidden');
        storyEl.classList.add('hidden');
    }


    // Position popup
    const popup = victimPopup;
    if (!isFullStory) {
        popup.style.left = `${Math.min(x + 20, window.innerWidth - 320)}px`;
        popup.style.top = `${Math.min(y - 20, window.innerHeight - 200)}px`;
    } else {
        // Center for full story
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    // Show popup
    popup.classList.remove('hidden');
    popup.classList.add('visible');

    // Mark city as viewed
    if (city) {
        markCityViewed(city.id);
    }
}

function hideVictimPopup() {
    victimPopup.classList.remove('visible');
    currentlyDisplayedVictim = null;
}

// Update victim popup content when language changes
function updateVictimPopupLanguage() {
    if (!currentlyDisplayedVictim || !victimPopup.classList.contains('visible')) {
        return;
    }

    const victim = currentlyDisplayedVictim;
    const city = getCityById(victim.city_id);
    const currentLang = getCurrentLanguage();

    // Update popup content based on new language
    const victimNameEl = document.getElementById('victim-name');
    const victimNameEnEl = document.getElementById('victim-name-en');

    if (currentLang === 'fa') {
        victimNameEl.textContent = victim.name_fa;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? city.nameFa : victim.city_name_fa;
    } else {
        victimNameEl.textContent = victim.name_en;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? `${city.name}` : victim.city_name_en;
    }

    document.getElementById('victim-age').textContent = formatAge(victim.age);
    document.getElementById('victim-date').textContent = formatDateLocalized(victim.death_date);

    // Update story if visible
    const storyEl = document.getElementById('victim-story');
    if (storyEl && !storyEl.classList.contains('hidden')) {
        storyEl.textContent = currentLang === 'fa' ? (victim.story_fa || "") : (victim.story_en || "");
    }
}

function formatDate(dateStr) {
    // Use localized date formatting from i18n
    return formatDateLocalized(dateStr);
}

// ============================================
// Sound
// ============================================

function toggleSound() {
    const isEnabled = getSoundEnabled();
    setSoundEnabled(!isEnabled);

    if (!isEnabled) {
        ambientAudio.play().catch(() => {
            setSoundEnabled(false);
            updateSoundUI();
        });
    } else {
        ambientAudio.pause();
    }

    updateSoundUI();
}

function updateSoundUI() {
    const isEnabled = getSoundEnabled();
    document.getElementById('sound-on').classList.toggle('hidden', !isEnabled);
    document.getElementById('sound-off').classList.toggle('hidden', isEnabled);
}

// ============================================
// Names Background - "The Names That Never Stop Passing"
// ============================================

const namesBackground = document.getElementById('names-background');
let namesLayer = null;
let victimNameElements = new Map(); // victimId -> array of span elements
let allVictimsData = []; // Store victims data for language switching

/**
 * Configuration for names background
 */
const NAMES_CONFIG = {
    // Number of rows - reduced on mobile for performance
    rows: window.innerWidth < 768 ? 12 : 18,
    // Speed range in seconds (slower = more readable)
    // Increased significantly for a very slow, haunting movement
    speedMin: 1920,
    speedMax: 5600,
    // Parallax intensity (% of viewport)
    parallaxIntensity: 0.015,
    // Minimum names to fill a row (will repeat if fewer victims)
    minNamesPerRow: 40
};

/**
 * Initialize the names background layer
 * Called after victims are loaded from Supabase
 */
function initNamesBackground(victimsList) {
    if (!namesBackground || !victimsList || victimsList.length === 0) return;

    allVictimsData = victimsList; // Store for language updates

    // Create the parallax container
    namesLayer = document.createElement('div');
    namesLayer.className = 'names-layer';
    namesBackground.appendChild(namesLayer);

    const currentLang = getCurrentLanguage();

    // Get victim names based on current language
    let displayNames = getNamesForCurrentLanguage(victimsList, currentLang);

    console.log(`Initializing names background with ${displayNames.length} names in ${currentLang}`);

    // Generate rows
    const viewportHeight = window.innerHeight;
    const rowSpacing = viewportHeight / NAMES_CONFIG.rows;

    for (let i = 0; i < NAMES_CONFIG.rows; i++) {
        const row = createNameRow(
            displayNames,
            i % 2 === 0, // Alternate direction
            i,
            rowSpacing * i + (rowSpacing / 2) // Y position
        );
        namesLayer.appendChild(row);
    }
}

/**
 * Helper to get names for background based on language
 */
function getNamesForCurrentLanguage(victimsList, lang) {
    let names = [];
    victimsList.forEach(v => {
        const name = lang === 'fa' ? (v.name_fa || v.name_en) : (v.name_en || v.name_fa);
        if (name) names.push({ name, id: v.id });
    });

    // Fallback names if empty
    if (names.length === 0) {
        const placeholdersEn = ['Nika Shakarami', 'Sarina Esmailzadeh', 'Hadis Najafi', 'Kian Pirfalak', 'Mahsa Amini', 'Mehdi Karami', 'Mohammad Hosseini', 'Majidreza Rahnavard'];
        const placeholdersFa = ['نیکا شاکرمی', 'سارینا اسماعیل‌زاده', 'حدیث نجفی', 'کیان پیرفلک', 'مهسا امینی', 'محمد مهدی کرمی', 'محمد حسینی', 'مجیدرضا رهنورد'];
        const placeholders = lang === 'fa' ? placeholdersFa : placeholdersEn;
        names = placeholders.map((name, i) => ({ name, id: `fallback-${i}` }));
    }
    return names;
}

/**
 * Create a single scrolling row of names
 */
function createNameRow(namesData, reverse, rowIndex, yPosition) {
    const row = document.createElement('div');
    row.className = `names-row ${reverse ? 'reverse' : ''} layer-${(rowIndex % 3) + 1}`;
    row.style.top = `${yPosition}px`;

    // Random speed within range
    const speed = NAMES_CONFIG.speedMin +
        Math.random() * (NAMES_CONFIG.speedMax - NAMES_CONFIG.speedMin);

    // The content container that will handle the animation
    const content = document.createElement('div');
    content.className = 'names-row-content';
    content.style.animationDuration = `${speed}s`;

    // Shuffle names for this row
    const shuffled = [...namesData].sort(() => Math.random() - 0.5);

    // Repeat names to ensure enough width for the loop
    const repeatCount = Math.max(1, Math.ceil(NAMES_CONFIG.minNamesPerRow / shuffled.length));
    const rowNames = [];
    for (let r = 0; r < repeatCount; r++) {
        rowNames.push(...shuffled);
    }

    // Populate the content with name spans
    rowNames.forEach(({ name, id }) => {
        const span = document.createElement('span');
        span.textContent = name;
        span.dataset.victimId = id;
        content.appendChild(span);

        // Store reference for glow effect (only the first few rows to keep the map small)
        if (!victimNameElements.has(id)) {
            victimNameElements.set(id, []);
        }
        victimNameElements.get(id).push(span);
    });

    // CRITICAL: Duplicate children for seamless loop
    const originalCount = content.children.length;
    for (let i = 0; i < originalCount; i++) {
        const clone = content.children[i].cloneNode(true);
        content.appendChild(clone);
        // Note: we don't add clones to victimNameElements to keep interaction focused
    }

    row.appendChild(content);
    return row;
}

/**
 * Update parallax effect based on mouse position
 */
function updateNamesParallax(mouseX, mouseY) {
    if (!namesBackground || namesBackground.classList.contains('hidden')) return;

    // Calculate offset from center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (mouseX - centerX) * NAMES_CONFIG.parallaxIntensity;
    const offsetY = (mouseY - centerY) * NAMES_CONFIG.parallaxIntensity;

    // Apply via CSS custom properties for smooth performance
    namesBackground.style.setProperty('--parallax-x', `${-offsetX}px`);
    namesBackground.style.setProperty('--parallax-y', `${-offsetY}px`);
}

/**
 * Glow a name when corresponding tulip is clicked
 */
function glowNameForVictim(victimId) {
    const elements = victimNameElements.get(victimId);
    if (!elements || elements.length === 0) return;

    // Pick one random element to glow (not all instances)
    const randomIndex = Math.floor(Math.random() * elements.length);
    const element = elements[randomIndex];

    // Add glow class (animation handles the rest)
    element.classList.add('glow');

    // Remove class after animation completes
    setTimeout(() => {
        element.classList.remove('glow');
    }, 1500);
}

/**
 * Show the names background with fade-in
 */
function showNamesBackground() {
    if (!namesBackground) {
        console.error('Names background element not found');
        return;
    }
    console.log('Showing names background...');
    namesBackground.classList.remove('hidden');
    gsap.fromTo(namesBackground,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: 'power2.out' }
    );
}

/**
 * Update the background names when language changes
 */
function updateNamesBackgroundLanguage() {
    if (!namesLayer || !allVictimsData.length) return;

    const currentLang = getCurrentLanguage();
    const newNames = getNamesForCurrentLanguage(allVictimsData, currentLang);

    // We update the spans in each row to the new language without regenerating rows
    // This maintains animation state and is much smoother
    const rows = namesLayer.querySelectorAll('.names-row');

    rows.forEach(row => {
        const spans = row.querySelectorAll('span');
        // We shuffle for each row to maintain variety
        const shuffled = [...newNames].sort(() => Math.random() - 0.5);

        spans.forEach((span, index) => {
            const data = shuffled[index % shuffled.length];
            span.textContent = data.name;
            span.dataset.victimId = data.id;
        });
    });
}

// ============================================
// Statistics Animation
// ============================================

function setupStatistics() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const key = stat.dataset.count;
        if (statistics[key]) {
            stat.dataset.count = statistics[key];
        }
    });
}

function animateStatistics() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const duration = 2000;
        const start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            stat.textContent = Math.floor(target * eased).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    });
}

// ============================================
// Animation Loop
// ============================================

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // Update controls
    controls.update();

    // Subtle tulip sway and breathing animation
    tulips.forEach((tulip, i) => {
        if (tulip.scale.x > 0.5) { // Only animate if visible
            const swayAmount = 0.02;
            tulip.rotation.x = Math.sin(time * 1.5 + i * 0.1) * swayAmount;
            tulip.rotation.z = Math.cos(time * 1.2 + i * 0.15) * swayAmount;

            // Breathing (scale)
            const breathing = 1.0 + Math.sin(time * 0.5 + i * 0.5) * 0.05;
            tulip.scale.set(breathing, breathing, breathing);

            // Breathing (glow/opacity)
            if (tulip.userData.petalMaterial) {
                tulip.userData.petalMaterial.emissiveIntensity = 0.1 + Math.sin(time * 0.5 + i * 0.5) * 0.05;
            }
        }
    });

    // Update map shaders uTime
    if (iranMapGroup) {
        iranMapGroup.traverse((child) => {
            if (child.isMesh && child.material && child.material.userData && child.material.userData.shader) {
                child.material.userData.shader.uniforms.uTime.value = time;
            }
        });
    }

    // Render
    renderer.render(scene, camera);
}

// ============================================
// Start Application
// ============================================

init().catch(console.error);
