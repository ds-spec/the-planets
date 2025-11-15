import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true, // it basically smoothens the edges
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

const controls = new OrbitControls(camera, renderer.domElement);

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

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
