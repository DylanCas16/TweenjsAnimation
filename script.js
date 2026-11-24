import * as THREE from "three";
import {
  initAmmo,
  createBoxWithPhysics,
  updatePhysics,
  clearDynamicBodies,
} from "./ammo_logic.js";
import { generateLevel1, generateLevel2, generateLevel3 } from "./level_generator.js";

let camera, scene, renderer;
const clock = new THREE.Clock();

const levels = { 1: generateLevel1, 2: generateLevel2, 3: generateLevel3 };
let currentLevel = 1;

initGraphics();
initUI();

initAmmo(scene, camera).then(() => {
  createGround();
  loadLevel(currentLevel);
  animationLoop();
});

function loadLevel(n) {
  currentLevel = n;
  clearDynamicBodies();
  levels[n]();
}

function initUI() {
  const panel = document.createElement("div");
  panel.style.cssText =
    "position:fixed;top:10px;left:10px;display:flex;gap:6px;align-items:center;" +
    "background:rgba(255,255,255,0.85);padding:8px;border-radius:6px;font-family:sans-serif;";

  const select = document.createElement("select");
  for (const n of Object.keys(levels)) {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = `Level ${n}`;
    select.appendChild(opt);
  }
  select.addEventListener("change", () => {
    loadLevel(Number(select.value));
    select.blur();
  });

  const button = document.createElement("button");
  button.textContent = "Restart";
  button.addEventListener("click", () => {
    loadLevel(currentLevel);
    button.blur();
  });

  // Evita que pulsar en el panel dispare una bola
  panel.addEventListener("pointerdown", (e) => e.stopPropagation());

  panel.append(select, button);
  document.body.appendChild(panel);
}

function initGraphics() {
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.2, 2000);
  camera.position.set(0, 10, 20);
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

  const platform1 = createBoxWithPhysics(
    10,
    0.5,
    10,
    0,
    new THREE.Vector3(-10, 5, -15),
    new THREE.Quaternion(0, 0, 0, 1),
    new THREE.MeshPhongMaterial({ color: 0xFF8888 })
  );
  platform1.receiveShadow = true;

  const platform2 = createBoxWithPhysics(
    10,
    0.5,
    10,
    0,
    new THREE.Vector3(10, 5, -15),
    new THREE.Quaternion(0, 0, 0, 1),
    new THREE.MeshPhongMaterial({ color: 0xFF8888 })
  );
  platform2.receiveShadow = true;

  const platform3 = createBoxWithPhysics(
    5,
    0.5,
    10,
    0,
    new THREE.Vector3(0, 10, -15),
    new THREE.Quaternion(0, 0, 0, 1),
    new THREE.MeshPhongMaterial({ color: 0xFF8888 })
  );
  platform3.receiveShadow = true;
}

function animationLoop() {
  requestAnimationFrame(animationLoop);
  updatePhysics(clock.getDelta());
  renderer.render(scene, camera);
}
