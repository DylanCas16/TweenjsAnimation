import * as THREE from "three";
import { createBoxWithPhysics } from "./ammo_logic.js";

const BLOCK_MASS = 2;
const GAP = 0.02; // pequeña holgura para evitar que las cajas se "peguen" al apilarse
const noRotation = new THREE.Quaternion(0, 0, 0, 1);

const colors = [0xd9534f, 0xf0ad4e, 0x5cb85c, 0x5bc0de, 0x428bca, 0x9b59b6];

function createBlock(size, x, y, z, color) {
  const block = createBoxWithPhysics(
    size.x,
    size.y,
    size.z,
    BLOCK_MASS,
    new THREE.Vector3(x, y, z),
    noRotation,
    new THREE.MeshPhongMaterial({ color })
  );
  block.castShadow = true;
  block.receiveShadow = true;
  return block;
}

export function createWall({
  origin = new THREE.Vector3(0, 0, 0),
  columns = 6,
  rows = 6,
  blockSize = new THREE.Vector3(1.2, 0.6, 0.6),
} = {}) {
  const blocks = [];
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : blockSize.x * 0.5;
    const y = origin.y + blockSize.y * (row + 0.5) + GAP * row;
    for (let col = 0; col < columns; col++) {
      const x =
        origin.x + (col - (columns - 1) / 2) * (blockSize.x + GAP) + offset;
      blocks.push(
        createBlock(blockSize, x, y, origin.z, colors[row % colors.length])
      );
    }
  }
  return blocks;
}

export function createTower({
  origin = new THREE.Vector3(0, 0, 0),
  height = 8,
  blockSize = new THREE.Vector3(1, 1, 1),
} = {}) {
  const blocks = [];
  for (let i = 0; i < height; i++) {
    const y = origin.y + blockSize.y * (i + 0.5) + GAP * i;
    blocks.push(
      createBlock(blockSize, origin.x, y, origin.z, colors[i % colors.length])
    );
  }
  return blocks;
}

export function createPyramid({
  origin = new THREE.Vector3(0, 0, 0),
  levels = 5,
  blockSize = new THREE.Vector3(1, 1, 1),
} = {}) {
  const blocks = [];
  for (let level = 0; level < levels; level++) {
    const count = levels - level;
    const y = origin.y + blockSize.y * (level + 0.5) + GAP * level;
    for (let i = 0; i < count; i++) {
      const x = origin.x + (i - (count - 1) / 2) * (blockSize.x + GAP);
      blocks.push(
        createBlock(blockSize, x, y, origin.z, colors[level % colors.length])
      );
    }
  }
  return blocks;
}

export function generateLevel1() {
  return [
    ...createWall({ origin: new THREE.Vector3(0, 0, -6), columns: 10, rows: 10 }),
    ...createTower({ origin: new THREE.Vector3(-8, 0, -2), height: 10 }),
    ...createTower({ origin: new THREE.Vector3(8, 0, -2), height: 10 }),
    ...createPyramid({ origin: new THREE.Vector3(0, 0, 2), levels: 4 }),
  ];
}

export function generateLevel2() {
  return [
    ...createWall({ origin: new THREE.Vector3(0, 5, -6), columns: 10, rows: 10 }),
    ...createTower({ origin: new THREE.Vector3(10, 5, -15), height: 10 }),
    ...createTower({ origin: new THREE.Vector3(-10, 5, -15), height: 10 }),
    ...createPyramid({ origin: new THREE.Vector3(0, 10, -15), levels: 4 }),
  ];
}

export function generateLevel3() {
  return [
    ...createTower({ origin: new THREE.Vector3(0, 10, -15), height: 10 }),
    ...createPyramid({ origin: new THREE.Vector3(10, 5, -15), levels: 8 }),
    ...createPyramid({ origin: new THREE.Vector3(-10, 5, -15), levels: 8 }),
    ...createWall({ origin: new THREE.Vector3(0, 0, -6), columns: 20, rows: 20 }),
    ...createTower({ origin: new THREE.Vector3(-8, 0, -2), height: 20 }),
    ...createTower({ origin: new THREE.Vector3(8, 0, -2), height: 20 }),
  ];
}