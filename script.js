import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Ammo from "ammojs-typed";
import { initAmmo, createBoxWithPhysics, updatePhysics } from "./ammo_logic.js"

let camera, scene, renderer, physicsWorld, transformAux1;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouseCoords = new THREE.Vector2();
const rigidBodies = [];
const margin = 0.05;

Ammo(Ammo).then(() => {
  initGraphics();
  initPhysics();
  createGround();
  initInput();
  animationLoop();
});

function initGraphics() {
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.2, 2000);
  camera.position.set(-14, 8, 16);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  new OrbitControls(camera, renderer.domElement);

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

function initPhysics() {
  const config = new Ammo.btDefaultCollisionConfiguration();
  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    new Ammo.btCollisionDispatcher(config),
    new Ammo.btDbvtBroadphase(),
    new Ammo.btSequentialImpulseConstraintSolver(),
    config
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, -7.8, 0));
  transformAux1 = new Ammo.btTransform();
}

function createRigidBody(mesh, shape, mass, pos, quat) {
  mesh.position.copy(pos);
  mesh.quaternion.copy(quat);

  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

  const inertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, inertia);

  const info = new Ammo.btRigidBodyConstructionInfo(
    mass,
    new Ammo.btDefaultMotionState(transform),
    shape,
    inertia
  );
  const body = new Ammo.btRigidBody(info);
  body.setFriction(0.5);

  mesh.userData.physicsBody = body;
  scene.add(mesh);
  if (mass > 0) {
    rigidBodies.push(mesh);
    body.setActivationState(4);
  }
  physicsWorld.addRigidBody(body);
  return body;
}

function createGround() {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(40, 1, 40),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  mesh.receiveShadow = true;
  const shape = new Ammo.btBoxShape(new Ammo.btVector3(20, 0.5, 20));
  shape.setMargin(margin);
  createRigidBody(mesh, shape, 0, new THREE.Vector3(0, -0.5, 0), new THREE.Quaternion(0, 0, 0, 1));
}

function initInput() {
  addEventListener("pointerdown", (event) => {
    mouseCoords.set(
      (event.clientX / innerWidth) * 2 - 1,
      -(event.clientY / innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouseCoords, camera);
    const { origin, direction } = raycaster.ray;

    const radius = 0.4;
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 14, 10),
      new THREE.MeshPhongMaterial({ color: 0x202020 })
    );
    ball.castShadow = true;

    const shape = new Ammo.btSphereShape(radius);
    shape.setMargin(margin);

    const pos = direction.clone().add(origin);
    const body = createRigidBody(ball, shape, 35, pos, new THREE.Quaternion(0, 0, 0, 1));

    const v = direction.clone().multiplyScalar(24);
    body.setLinearVelocity(new Ammo.btVector3(v.x, v.y, v.z));
  });
}

function animationLoop() {
  requestAnimationFrame(animationLoop);
  physicsWorld.stepSimulation(clock.getDelta(), 10);

  for (const mesh of rigidBodies) {
    const ms = mesh.userData.physicsBody.getMotionState();
    if (ms) {
      ms.getWorldTransform(transformAux1);
      const p = transformAux1.getOrigin();
      const q = transformAux1.getRotation();
      mesh.position.set(p.x(), p.y(), p.z());
      mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
  
  renderer.render(scene, camera);
}