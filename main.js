import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import gsap from "gsap";

gsap.registerPlugin(ScrambleTextPlugin);

const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true, // it basically smoothens the edges
});

const text = document.querySelector(".loader-h1");
console.log(text);
const tl = gsap.timeline();
const progressBar = document.querySelector(".animate-width");
const loaderDiv = document.querySelector(".loader-div");
const planetsDiv = document.querySelector(".planets-div");
const nav = document.querySelectorAll("nav h4, nav a");
const headingsDiv = document.querySelectorAll(".headings-div");

// tl;

tl.to(text, {
  duration: 4,
  scrambleText: {
    text: "Planets",
  },
})
  .to(progressBar, {
    duration: 7,
    scaleX: 120,
    ease: "circ.inOut",
    transformOrigin: "center",
  })
  .to(loaderDiv, {
    duration: 0.4,
    y: "-100%",
    ease: "power1.inOut",
  })
  .to(loaderDiv, {
    display: "none",
  })
  .to(planetsDiv, {
    opacity: 1,
  })
  .from(nav, {
    duration: 0.5,
    y: -100,
    stagger: {
      amount: 0.5,
    },
  })
  .from(headingsDiv, {
    duration: 1,
    y: -300,
    ease: "power2.inOut",
  });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  28,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6;

// const controls = new OrbitControls(camera, renderer.domElement);

const starTexture = new THREE.TextureLoader().load("./stars.jpg");
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  transparent: true,
  opacity: 0.4,
  side: THREE.BackSide, // back side basically means that we are inside the sphere and we want to apply it at the back side
});

const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

const radius = 1;
const segments = 64;
const orbitRadius = 3;
const alphaTextures = [
  "./csilla/color.png",
  "./earth/map.jpg",
  "./venus/map.jpg",
  "./volcanic/color.png",
];
const spheres = new THREE.Group();
const spheresMesh = [];
console.log(spheresMesh);

const loader = new RGBELoader();

loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/moonlit_golf_2k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);

for (let i = 0; i < 4; i++) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(alphaTextures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

  spheresMesh.push(sphere);

  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.add(sphere);
}

spheres.rotation.x = 0.15;
spheres.position.y = -0.4;
scene.add(spheres);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

let lastScrollTime = 0;
let scrollCount = 0;

window.addEventListener("wheel", (e) => {
  const now = Date.now();
  if (now - lastScrollTime > 2000) {
    // scrollCount++;
    lastScrollTime = now;
    e.deltaY > 0 ? "down" : "up";
    scrollCount = (scrollCount + 1) % 4; // this is the logic for scrollCount and this mod is giving us the remainder
    console.log("Throttled wheel event triggered", scrollCount);
    const headings = document.querySelectorAll(".headings");

    gsap.to(headings, {
      duration: 1,
      y: `-=${100}%`,
      ease: "power2.inOut",
    });

    gsap.to(spheres.rotation, {
      duration: 1,
      y: `-=${Math.PI / 2}`,
      ease: "expo.inOut",
    });

    if (scrollCount === 0) {
      gsap.to(headings, {
        duration: 1,
        y: 0,
        ease: "power2.inOut",
      });
    }
  }
});

let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < 4; i++) {
    spheresMesh[i].rotation.y = clock.getElapsedTime() * 0.02;
  }
  renderer.render(scene, camera);
}

animate();
