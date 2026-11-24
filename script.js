import * as THREE from "three";
import { initAmmo, createBoxWithPhysics, updatePhysics } from "./ammo_logic.js";
import { generateLevel } from "./level_generator.js";

let camera, scene, renderer;
const clock = new THREE.Clock();

initGraphics();

initAmmo(scene, camera).then(() => {
  createGround();
  generateLevel();
  animationLoop();
});

function initGraphics() {
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.2, 2000);
  camera.position.set(0, 10, 15);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x707070));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-10, 18, 5);
  light.castShadow = true;
  scene.add(light);

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

function createGround() {
  const ground = createBoxWithPhysics(
    40,
    1,
    40,
    0,
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Quaternion(0, 0, 0, 1),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  ground.receiveShadow = true;
}

function animationLoop() {
  requestAnimationFrame(animationLoop);
  updatePhysics(clock.getDelta());
  renderer.render(scene, camera);
}
