import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

// Variables
let nameMesh = new THREE.Mesh();
let name = "JOSHEL";
//let glow = 0.2;
let stars, starGeo;

// Setting up Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Calling all Functions in script
lighting();
text();
particles();

function particles() { 
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  starGeo.verticesNeedUpdate = true;
  stars.position.z -= 0.9;

  if(stars.position.z < -400) {
    stars.position.z = 200;
  }
  }

function text() { // replacing BoxGeometry with TextGeometry with same wooden texture
  const texture = new THREE.TextureLoader().load("../assets/textures/wooden.jpg");

  const floader = new FontLoader();
  floader.load('../assets/fonts/Poppins_Regular.json', function(font) {
    const textGeometry = new TextGeometry(name, {
      font: font,
      size:6,
      height:1,
    })
    textGeometry.center();
    //const textMaterial = new THREE.MeshPhongMaterial({ map: texture, emissive: 0xFF00D4, emissiveIntensity: glow });
    const textMaterial = new THREE.MeshPhongMaterial({ map: texture });
    nameMesh = new THREE.Mesh(textGeometry,textMaterial);
    scene.add(nameMesh);
  });
  camera.position.z = 25;
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function rainColorChange() { 
  stars.material.color.setRGB(Math.random(256), Math.random(256), Math.random(256)); // sets the particle color to random
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  nameMesh.rotation.x += 0.006;
  nameMesh.rotation.y += 0.006;
  nameMesh.rotation.z += 0.004;

  renderer.render(scene, camera);
}

animate();
setInterval(rainColorChange, 3000); // calls rainColorChange function every 3 seconds
