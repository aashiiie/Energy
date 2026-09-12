/* =========================================
   CONVALT ENERGY
   Interactive 3D Experience
========================================= */


/* =========================
   STORY DATA
========================= */

const chapters = [

    {
        tag: "Chapter 01 — Solar Manufacturing",
        title: "Next-Gen Photovoltaic Modules",
        desc: "Precision-engineered solar silicon cells driving high-density clean energy generation with minimal environmental footprint.",
        cameraPos: { x: 0, y: 2.2, z: 7 },
        rotation: 0
    },

    {
        tag: "Chapter 02 — Grid Power Generation",
        title: "Utility-Scale Infrastructure",
        desc: "Seamless integration with regional power grids, delivering constant renewable energy flow with intelligent load distribution.",
        cameraPos: { x: 5.5, y: 3.8, z: 5.5 },
        rotation: Math.PI * 0.18
    },

    {
        tag: "Chapter 03 — Sustainable Data Centers",
        title: "Zero-Carbon Computing",
        desc: "Powering modern AI and hyperscale cloud infrastructure directly with local, dedicated renewable power plants.",
        cameraPos: { x: -5.5, y: 3.2, z: 6 },
        rotation: Math.PI * 0.35
    },

    {
        tag: "Chapter 04 — Circular Lifecycle",
        title: "Complete Recycling System",
        desc: "A closed-loop system recycling up to 98% of component materials, ensuring total end-to-end sustainability.",
        cameraPos: { x: 0, y: 6.5, z: 3.5 },
        rotation: Math.PI * 0.55
    }

];


let currentIdx = 0;
let isAnimating = false;


/* =========================
   THREE.JS SETUP
========================= */

const container = document.getElementById("canvas-container");

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x080d0b, 0.045);


const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 2.2, 7);


/* Renderer */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputEncoding = THREE.sRGBEncoding;

container.appendChild(renderer.domElement);


/* =========================
   LIGHTING
========================= */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.55
    );

scene.add(ambientLight);


const greenLight =
    new THREE.PointLight(
        0x62d99d,
        2.4,
        18
    );

greenLight.position.set(
    4,
    5,
    5
);

scene.add(greenLight);


const softLight =
    new THREE.PointLight(
        0x1d8c64,
        1.5,
        16
    );

softLight.position.set(
    -5,
    -2,
    2
);

scene.add(softLight);


/* =========================
   MAIN GROUP
========================= */

const mainGroup =
    new THREE.Group();

scene.add(mainGroup);


/* =========================
   SOLAR PANEL
========================= */

const solarGroup =
    new THREE.Group();

mainGroup.add(solarGroup);


/* Outer frame */

const frameGeometry =
    new THREE.BoxGeometry(
        4.6,
        0.12,
        2.8
    );

const frameMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x26382f,
        roughness: 0.28,
        metalness: 0.85
    });

const frame =
    new THREE.Mesh(
        frameGeometry,
        frameMaterial
    );

solarGroup.add(frame);


/* Glass panel */

const panelGeometry =
    new THREE.BoxGeometry(
        4.35,
        0.055,
        2.55
    );

const panelMaterial =
    new THREE.MeshPhysicalMaterial({
        color: 0x0b1913,
        roughness: 0.12,
        metalness: 0.72,
        clearcoat: 0.8,
        clearcoatRoughness: 0.18
    });

const panel =
    new THREE.Mesh(
        panelGeometry,
        panelMaterial
    );

panel.position.y = 0.085;

solarGroup.add(panel);


/* =========================
   PANEL GRID
========================= */

const gridMaterial =
    new THREE.LineBasicMaterial({
        color: 0x4bc78d,
        transparent: true,
        opacity: 0.28
    });


/* vertical lines */

for (let i = -3; i <= 3; i++) {

    const points = [

        new THREE.Vector3(
            i * 0.62,
            0.125,
            -1.22
        ),

        new THREE.Vector3(
            i * 0.62,
            0.125,
            1.22
        )

    ];

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    const line =
        new THREE.Line(
            geometry,
            gridMaterial
        );

    solarGroup.add(line);
}


/* horizontal lines */

for (let i = -2; i <= 2; i++) {

    const points = [

        new THREE.Vector3(
            -2.1,
            0.126,
            i * 0.48
        ),

        new THREE.Vector3(
            2.1,
            0.126,
            i * 0.48
        )

    ];

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    const line =
        new THREE.Line(
            geometry,
            gridMaterial
        );

    solarGroup.add(line);
}


/* =========================
   ENERGY CORE
========================= */

const coreGeometry =
    new THREE.SphereGeometry(
        0.28,
        32,
        32
    );

const coreMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x7af0b0
    });

const core =
    new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

core.position.set(
    0,
    0.35,
    0
);

solarGroup.add(core);


/* Glow rings */

const ringMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x55d99a,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide
    });


for (let i = 0; i < 3; i++) {

    const ring =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                0.55 + i * 0.22,
                0.008,
                12,
                80
            ),
            ringMaterial
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.position.y =
        0.13 + i * 0.03;

    solarGroup.add(ring);
}


/* =========================
   PARTICLES
========================= */

const particlesCount = 650;

const positions =
    new Float32Array(
        particlesCount * 3
    );

for (
    let i = 0;
    i < particlesCount * 3;
    i++
) {

    positions[i] =
        (Math.random() - 0.5) * 18;

}


const particleGeometry =
    new THREE.BufferGeometry();

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({

        size: 0.025,

        color: 0x66dca0,

        transparent: true,

        opacity: 0.42,

        depthWrite: false

    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =========================
   INITIAL MODEL POSITION
========================= */

solarGroup.rotation.x =
    -0.28;

solarGroup.rotation.y =
    -0.42;


/* =========================
   ANIMATION LOOP
========================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    /* Solar panel floating */

    solarGroup.position.y =
        Math.sin(time * 0.8) * 0.09;


    /* Slow rotation */

    solarGroup.rotation.y +=
        0.0018;


    /* Small tilt */

    solarGroup.rotation.x =
        -0.28 +
        Math.sin(time * 0.7) * 0.035;


    /* Energy core pulse */

    const scale =
        1 +
        Math.sin(time * 2.5) * 0.12;

    core.scale.set(
        scale,
        scale,
        scale
    );


    /* Particle movement */

    particles.rotation.y =
        time * 0.015;

    particles.rotation.x =
        Math.sin(time * 0.1) * 0.08;


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================
   CHAPTER NAVIGATION
========================= */

function goToChapter(index) {

    if (
        index < 0 ||
        index >= chapters.length ||
        isAnimating
    ) {
        return;
    }


    isAnimating = true;

    currentIdx = index;

    const target =
        chapters[index];


    const narrative =
        document.getElementById(
            "narrative"
        );


    /* Text exit */

    gsap.to(
        narrative,
        {
            opacity: 0,
            y: 15,
            duration: 0.28,

            onComplete: () => {

                document.getElementById(
                    "chap-tag"
                ).innerText =
                    target.tag;


                /* Split first words visually */

                const words =
                    target.title.split(" ");


                document.getElementById(
                    "chap-title"
                ).innerHTML =
                    words.slice(0, -2).join(" ") +
                    "<br><strong>" +
                    words.slice(-2).join(" ") +
                    "</strong>";


                document.getElementById(
                    "chap-desc"
                ).innerText =
                    target.desc;


                document.getElementById(
                    "curr-step"
                ).innerText =
                    `0${index + 1}`;


                gsap.to(
                    narrative,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.48,
                        ease: "power2.out"
                    }
                );

            }
        }
    );


    /* Camera */

    gsap.to(
        camera.position,
        {
            x: target.cameraPos.x,
            y: target.cameraPos.y,
            z: target.cameraPos.z,

            duration: 1.45,

            ease: "power3.inOut",

            onUpdate: () => {

                camera.lookAt(
                    0,
                    0,
                    0
                );

            },

            onComplete: () => {

                isAnimating = false;

            }
        }
    );


    /* Model rotation */

    gsap.to(
        solarGroup.rotation,
        {
            z: target.rotation,

            duration: 1.45,

            ease: "power3.inOut"
        }
    );

}


/* =========================
   BUTTONS
========================= */

document
    .getElementById("btn-next")
    .addEventListener(
        "click",
        () => {

            goToChapter(
                (currentIdx + 1) %
                chapters.length
            );

        }
    );


document
    .getElementById("btn-prev")
    .addEventListener(
        "click",
        () => {

            goToChapter(
                (currentIdx - 1 +
                    chapters.length) %
                chapters.length
            );

        }
    );


/* =========================
   MOUSE PARALLAX
========================= */

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (event.clientX /
                window.innerWidth -
                0.5) *
            2;

        mouseY =
            (event.clientY /
                window.innerHeight -
                0.5) *
            2;

    }
);


function parallax() {

    mainGroup.rotation.y +=
        (
            mouseX * 0.045 -
            mainGroup.rotation.y
        ) * 0.025;


    mainGroup.rotation.x +=
        (
            -mouseY * 0.025 -
            mainGroup.rotation.x
        ) * 0.025;


    requestAnimationFrame(
        parallax
    );

}

parallax();


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================
   KEYBOARD NAVIGATION
========================= */

window.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "ArrowRight") {

            goToChapter(
                (currentIdx + 1) %
                chapters.length
            );

        }

        if (event.key === "ArrowLeft") {

            goToChapter(
                (currentIdx - 1 +
                    chapters.length) %
                chapters.length
            );

        }

    }
);
