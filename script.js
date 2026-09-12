// Story Data Chapters (Directly mapped from Client's SOW Scope Document)
const chapters = [
    {
        tag: "Chapter 01 — Solar Manufacturing",
        title: "Next-Gen Photovoltaic Modules",
        desc: "Precision-engineered solar silicon cells driving high-density clean energy generation with minimal environmental footprint.",
        cameraPos: { x: 0, y: 2, z: 7 },
        targetPos: { x: 0, y: 0, z: 0 }
    },
    {
        tag: "Chapter 02 — Grid Power Generation",
        title: "Utility-Scale Infrastructure",
        desc: "Seamless integration with regional power grids, delivering constant renewable energy flow with intelligent load distribution.",
        cameraPos: { x: 6, y: 4, z: 5 },
        targetPos: { x: 0, y: 0, z: 0 }
    },
    {
        tag: "Chapter 03 — Sustainable Data Centers",
        title: "Zero-Carbon Computing",
        desc: "Powering modern AI and hyperscale cloud infrastructure directly with local, dedicated renewable power plants.",
        cameraPos: { x: -6, y: 3, z: 6 },
        targetPos: { x: 0, y: 0, z: 0 }
    },
    {
        tag: "Chapter 04 — Circular Lifecycle",
        title: "Complete Recycling System",
        desc: "A closed-loop system recycling up to 98% of component materials, ensuring total end-to-end sustainability.",
        cameraPos: { x: 0, y: 8, z: 2 },
        targetPos: { x: 0, y: 0, z: 0 }
    }
];

let currentIdx = 0;
let isAnimating = false;

// Initialize Three.js Scene Setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0d0f12, 0.05);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(chapters[0].cameraPos.x, chapters[0].cameraPos.y, chapters[0].cameraPos.z);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Professional Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
dirLight.position.set(10, 15, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const secondaryLight = new THREE.DirectionalLight(0xa855f7, 0.5);
secondaryLight.position.set(-10, -5, -10);
scene.add(secondaryLight);

// 3D Visual Mesh Creation (Minimalist Solar Panel Rig)
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const solarGroup = new THREE.Group();
const frameGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
const frame = new THREE.Mesh(frameGeo, frameMat);
solarGroup.add(frame);

const panelGeo = new THREE.BoxGeometry(3.8, 0.05, 2.3);
const panelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
const panel = new THREE.Mesh(panelGeo, panelMat);
panel.position.y = 0.05;
solarGroup.add(panel);

// Grid Overlay Lines
const gridHelper = new THREE.GridHelper(4, 10, 0x38bdf8, 0x1e293b);
gridHelper.position.y = 0.08;
solarGroup.add(gridHelper);

mainGroup.add(solarGroup);

// Ambient Particle Dust Effect
const particlesCount = 400;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.6
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// Smooth Rendering & Animation Loop (60 FPS Goal)
function animate() {
    requestAnimationFrame(animate);

    // Subtle Continuous Floating Motion
    solarGroup.rotation.y += 0.003;
    solarGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;
    particlesMesh.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

animate();

// Camera & Chapter Transition Controller using GSAP
function goToChapter(index) {
    if(index < 0 || index >= chapters.length || isAnimating) return;
    isAnimating = true;

    const target = chapters[index];
    currentIdx = index;

    // Smooth UI Text Fade Animation
    const narrativeEl = document.getElementById('narrative');
    gsap.to(narrativeEl, { opacity: 0, y: 15, duration: 0.3, onComplete: () => {
        document.getElementById('chap-tag').innerText = target.tag;
        document.getElementById('chap-title').innerText = target.title;
        document.getElementById('chap-desc').innerText = target.desc;
        document.getElementById('curr-step').innerText = `0${index + 1}`;

        gsap.to(narrativeEl, { opacity: 1, y: 0, duration: 0.4 });
    }});

    // Dynamic Camera Motion Animation
    gsap.to(camera.position, {
        x: target.cameraPos.x,
        y: target.cameraPos.y,
        z: target.cameraPos.z,
        duration: 1.6,
        ease: 'power3.inOut',
        onUpdate: () => {
            camera.lookAt(target.targetPos.x, target.targetPos.y, target.targetPos.z);
        },
        onComplete: () => {
            isAnimating = false;
        }
    });

    // Model Dynamic Transition
    gsap.to(solarGroup.rotation, {
        z: index * Math.PI * 0.25,
        duration: 1.6,
        ease: 'power3.inOut'
    });
}

// Button Click Event Handlers
document.getElementById('btn-next').addEventListener('click', () => {
    goToChapter((currentIdx + 1) % chapters.length);
});

document.getElementById('btn-prev').addEventListener('click', () => {
    goToChapter((currentIdx - 1 + chapters.length) % chapters.length);
});

// Mouse Scroll Event Navigation
let scrollTimeout;
window.addEventListener('wheel', (e) => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if(e.deltaY > 0) {
            goToChapter(Math.min(currentIdx + 1, chapters.length - 1));
        } else if(e.deltaY < 0) {
            goToChapter(Math.max(currentIdx - 1, 0));
        }
    }, 50);
});

// Window Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Loader Animation Dismissal
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 600);
});