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
import { initI18n, toggleLanguage, getCurrentLanguage, formatDateLocalized, formatAge, t } from './utils/i18n.js';

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

// ============================================
// Initialization
// ============================================

async function init() {
    // Initialize i18n (language support)
    initI18n();

    // Initialize visit tracking
    visitState = initVisit();

    // Setup Three.js
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

    // Setup info panel statistics
    setupStatistics();

    // Start loading sequence
    await startLoadingSequence();

    // Start animation loop
    animate();
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.colors.background);
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
        powerPreference: 'high-performance'
    });
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
                        // Create filled shape
                        const geometry = new THREE.ShapeGeometry(shape);
                        const fillMaterial = new THREE.MeshStandardMaterial({
                            color: CONFIG.colors.mapFill,
                            roughness: 0.8,
                            metalness: 0.1,
                            side: THREE.DoubleSide
                        });

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

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.tulipStem,
        roughness: 0.7
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.75;
    group.add(stem);

    // Tulip petals (simplified as overlapping cones/spheres)
    const petalGroup = new THREE.Group();
    petalGroup.position.y = 1.5;

    // Main bulb shape
    const bulbGeometry = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const petalMaterial = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.tulipRed,
        roughness: 0.4,
        metalness: 0.1,
        emissive: CONFIG.colors.tulipRed,
        emissiveIntensity: 0.1
    });
    const bulb = new THREE.Mesh(bulbGeometry, petalMaterial);
    bulb.scale.y = 1.4;
    petalGroup.add(bulb);

    // Petal tips (elongated shapes pointing up)
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const petalTip = new THREE.Mesh(
            new THREE.ConeGeometry(0.15, 0.5, 6),
            petalMaterial.clone()
        );
        petalTip.position.set(
            Math.cos(angle) * 0.2,
            0.3,
            Math.sin(angle) * 0.2
        );
        petalTip.rotation.x = Math.PI * 0.1;
        petalTip.rotation.z = Math.cos(angle) * 0.2;
        petalGroup.add(petalTip);
    }

    group.add(petalGroup);

    // Position the tulip
    group.position.set(position.x, 1, position.z);

    // Start with zero scale for animation
    group.scale.set(0, 0, 0);

    // Store victim data
    group.userData = { victim, isTulip: true };

    return group;
}

async function createTulips() {
    // Fetch victims from Supabase (falls back to local data)
    const activeVictims = await getSupabaseVictims();

    // Create tulips for each victim
    activeVictims.forEach((victim, index) => {

        // Get city coordinates
        const city = getCityById(victim.city);
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
        }, CONFIG.animation.loadingDuration);

        // Phase 2: Map rises
        setTimeout(() => {
            gsap.to(iranMapGroup.position, {
                y: 0,
                duration: 2,
                ease: 'power2.out'
            });

            // Show intro text
            introText.classList.add('visible');
        }, CONFIG.animation.loadingDuration + 500);

        // Phase 3: Tulips grow
        setTimeout(() => {
            revealTulips();
        }, CONFIG.animation.loadingDuration + 2000);

        // Phase 4: Enable controls and show UI
        setTimeout(() => {
            controls.enabled = true;
            introText.classList.add('fade-out');

            setTimeout(() => {
                controlsHint.classList.add('visible');
                infoButton.classList.add('visible');
                soundToggle.classList.add('visible');
                langToggle.classList.add('visible');
            }, 1500);

            resolve();
        }, CONFIG.animation.loadingDuration + CONFIG.animation.tulipGrowDuration + 3000);
    });
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

    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);

    // Language toggle
    langToggle.addEventListener('click', () => {
        toggleLanguage();
        // Update victim popup if it's currently visible
        updateVictimPopupLanguage();
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
            showVictimPopup(tulip.userData.victim, event.clientX, event.clientY);
        }
    }
}

function checkTulipHover() {
    raycaster.setFromCamera(mouse, camera);
    const tulipMeshes = tulips.flatMap(t => t.children);
    const intersects = raycaster.intersectObjects(tulipMeshes, true);

    // Reset all tulips
    tulips.forEach(tulip => {
        gsap.to(tulip.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.2
        });
    });

    if (intersects.length > 0) {
        // Find the parent tulip group
        let tulip = intersects[0].object;
        while (tulip.parent && !tulip.userData.isTulip) {
            tulip = tulip.parent;
        }

        if (tulip.userData.isTulip) {
            gsap.to(tulip.scale, {
                x: 1.3,
                y: 1.3,
                z: 1.3,
                duration: 0.2
            });
            document.body.style.cursor = 'pointer';
            return;
        }
    }

    document.body.style.cursor = 'grab';
}

// ============================================
// Victim Popup
// ============================================

function showVictimPopup(victim, x, y) {
    // Store for language updates
    currentlyDisplayedVictim = victim;

    const city = getCityById(victim.city);
    const currentLang = getCurrentLanguage();

    // Update popup content based on language
    const victimNameEl = document.getElementById('victim-name');
    const victimNameEnEl = document.getElementById('victim-name-en');

    if (currentLang === 'fa') {
        victimNameEl.textContent = victim.nameFa || victim.name;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? city.nameFa : victim.city;
    } else {
        victimNameEl.textContent = victim.name;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? `${city.name}` : victim.city;
    }

    document.getElementById('victim-age').textContent = formatAge(victim.age);
    document.getElementById('victim-date').textContent = formatDateLocalized(victim.date);

    // Handle Victim Image
    const imageContainer = document.getElementById('victim-image-container');
    const imageEl = document.getElementById('victim-image');

    if (victim.imageUrl) {
        // If it's a Supabase storage path or a full URL
        const imageUrl = victim.imageUrl.startsWith('http')
            ? victim.imageUrl
            : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/victim-images/${victim.imageUrl}`;

        imageEl.src = imageUrl;
        imageContainer.classList.remove('hidden');
    } else {
        imageContainer.classList.add('hidden');
    }


    // Position popup
    const popup = victimPopup;
    popup.style.left = `${Math.min(x + 20, window.innerWidth - 320)}px`;
    popup.style.top = `${Math.min(y - 20, window.innerHeight - 200)}px`;

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
    const city = getCityById(victim.city);
    const currentLang = getCurrentLanguage();

    // Update popup content based on new language
    const victimNameEl = document.getElementById('victim-name');
    const victimNameEnEl = document.getElementById('victim-name-en');

    if (currentLang === 'fa') {
        victimNameEl.textContent = victim.nameFa || victim.name;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? city.nameFa : victim.city;
    } else {
        victimNameEl.textContent = victim.name;
        victimNameEnEl.style.display = 'none';
        document.getElementById('victim-city').textContent = city ? `${city.name}` : victim.city;
    }

    document.getElementById('victim-age').textContent = formatAge(victim.age);
    document.getElementById('victim-date').textContent = formatDateLocalized(victim.date);

    // Image logic remains the same (handled in showVictimPopup)

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

    // Subtle tulip sway animation
    tulips.forEach((tulip, i) => {
        if (tulip.scale.x > 0.5) { // Only animate if visible
            const swayAmount = 0.02;
            tulip.rotation.x = Math.sin(time * 1.5 + i * 0.1) * swayAmount;
            tulip.rotation.z = Math.cos(time * 1.2 + i * 0.15) * swayAmount;
        }
    });

    // Render
    renderer.render(scene, camera);
}

// ============================================
// Start Application
// ============================================

init().catch(console.error);
