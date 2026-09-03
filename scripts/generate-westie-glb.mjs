import fs from "node:fs/promises";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onload?.({ target: this });
      this.onloadend?.({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString("base64")}`;
      this.onload?.({ target: this });
      this.onloadend?.({ target: this });
    });
  }
}

globalThis.FileReader = NodeFileReader;

const scene = new THREE.Scene();
const root = new THREE.Group();
root.name = "Westie";
scene.add(root);

const fur = new THREE.MeshStandardMaterial({ color: 0xeee9de, roughness: 0.97, metalness: 0 });
fur.name = "WarmWhiteFur";
const shadowFur = new THREE.MeshStandardMaterial({ color: 0xd8d1c4, roughness: 1 });
shadowFur.name = "FurShadow";
const ink = new THREE.MeshStandardMaterial({ color: 0x262321, roughness: 0.92 });
ink.name = "FaceInk";
const pink = new THREE.MeshStandardMaterial({ color: 0xc48d82, roughness: 0.9 });
pink.name = "EarPink";

const addMesh = (parent, geometry, material, name, position, scale, rotation = [0, 0, 0]) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

addMesh(root, new THREE.SphereGeometry(0.72, 24, 18), fur, "Body", [0, -0.35, 0], [0.78, 0.86, 0.68]);
addMesh(root, new THREE.SphereGeometry(0.55, 20, 16), shadowFur, "Chest", [0, -0.38, 0.48], [0.72, 0.88, 0.3]);

const head = new THREE.Group();
head.name = "HeadPivot";
head.position.set(0, 0.42, 0.08);
root.add(head);
addMesh(head, new THREE.SphereGeometry(0.72, 24, 18), fur, "Head", [0, 0, 0], [0.9, 0.75, 0.76]);
addMesh(head, new THREE.ConeGeometry(0.45, 0.88, 3), fur, "EarLeft", [-0.43, 0.49, -0.02], [0.38, 0.62, 0.3], [0, 0, -0.16]);
addMesh(head, new THREE.ConeGeometry(0.45, 0.88, 3), fur, "EarRight", [0.43, 0.49, -0.02], [0.38, 0.62, 0.3], [0, 0, 0.16]);
addMesh(head, new THREE.ConeGeometry(0.32, 0.62, 3), pink, "EarInnerLeft", [-0.43, 0.5, 0.17], [0.24, 0.44, 0.12], [0, 0, -0.16]);
addMesh(head, new THREE.ConeGeometry(0.32, 0.62, 3), pink, "EarInnerRight", [0.43, 0.5, 0.17], [0.24, 0.44, 0.12], [0, 0, 0.16]);

for (const [index, x] of [-0.36, -0.18, 0, 0.18, 0.36].entries()) {
  addMesh(head, new THREE.ConeGeometry(0.1, 0.35, 5), fur, `FaceTuft${index}`, [x, -0.34 + Math.abs(x) * 0.08, 0.48], [1, 1, 0.55], [Math.PI, 0, x * 0.25]);
}
addMesh(head, new THREE.SphereGeometry(1, 14, 10), ink, "EyeLeft", [-0.22, 0.08, 0.5], [0.055, 0.07, 0.035]);
addMesh(head, new THREE.SphereGeometry(1, 14, 10), ink, "EyeRight", [0.22, 0.08, 0.5], [0.055, 0.07, 0.035]);
addMesh(head, new THREE.SphereGeometry(1, 14, 10), ink, "Nose", [0, -0.14, 0.62], [0.11, 0.085, 0.075]);
addMesh(head, new THREE.CapsuleGeometry(0.06, 0.12, 4, 8), ink, "Mouth", [0, -0.27, 0.57], [0.8, 0.18, 0.28], [0, 0, Math.PI / 2]);

for (const [index, x] of [-0.39, 0.39].entries()) {
  addMesh(root, new THREE.CapsuleGeometry(0.25, 0.58, 8, 14), fur, `FrontLeg${index + 1}`, [x, -0.98, 0.24], [0.92, 1, 0.92]);
  addMesh(root, new THREE.SphereGeometry(0.3, 18, 12), fur, `Paw${index + 1}`, [x, -1.29, 0.34], [1.1, 0.48, 1.25]);
}

const tail = new THREE.Group();
tail.name = "TailPivot";
tail.position.set(0.58, -0.3, -0.25);
tail.rotation.z = -0.55;
root.add(tail);
addMesh(tail, new THREE.CapsuleGeometry(0.16, 0.66, 7, 12), fur, "Tail", [0.2, 0.28, 0], [1, 1, 1], [0, 0, -0.12]);

root.scale.setScalar(0.9);
root.position.y = 0.08;

const exporter = new GLTFExporter();
const binary = await exporter.parseAsync(scene, { binary: true, onlyVisible: true });
const output = path.resolve("public/assets/models/westie.glb");
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, Buffer.from(binary));
console.log(`${output} (${Buffer.byteLength(Buffer.from(binary))} bytes)`);
