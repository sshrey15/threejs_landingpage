import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, model;

let mouse = new THREE.Vector2();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('/src/models/space3.jpg', function(texture) {
    scene.background = texture;
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);


  const loader = new GLTFLoader();
  loader.load(
    //shrey
    "/src/models/shiva.glb",
    function (gltf) {
      model = gltf.scene;
      model.scale.set(0.07, 0.07, 0.07);
      model.position.set(0, 3, 0);
      // increase the scale of the model
      model.traverse(function(node){
        if(node instanceof THREE.Mesh){
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error("An error happened", error);
    }
  );

  camera.position.z = 1; // adjust the camera's position
}

let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    let time = clock.getElapsedTime();
    model.position.y = Math.sin(time * 0.1) * 0.05; // floating animation
    model.rotation.y += 0.01; // rotation animation
  }

  renderer.render(scene, camera);
}

window.addEventListener(
  "mousemove",
  function (e) {
    if (!model) return;
    var mousePos = getMousePos(e);
    model.position.set(mousePos.x, mousePos.y, 0);
  },
  false
);

init();
animate();
