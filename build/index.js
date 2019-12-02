(function() {
  module.exports = function(container) {
    var AnimationManager, GLTFLoader, HEIGHT, OrbitControls, Reflector, THREE, WIDTH, animate, animationManager, barMesh, camera, clock, controls, cubeCamera, easing, init, loaded, mirrorMat, objects, onWindowResize, render, renderer, scene, stateManager;
    THREE = window.THREE = require('three');
    OrbitControls = require('three-orbitcontrols');
    GLTFLoader = require('./gltfloader');
    Reflector = require('./reflector');
    AnimationManager = require('./animation-manager');
    easing = require('./easing');
    camera = null;
    cubeCamera = null;
    scene = null;
    renderer = null;
    controls = null;
    barMesh = null;
    mirrorMat = null;
    clock = new THREE.Clock();
    WIDTH = null;
    HEIGHT = null;
    objects = {};
    loaded = false;
    animationManager = AnimationManager(objects, clock);
    stateManager = require('./state-manager')(animationManager, objects);
    //copper diffuse 140705
    init = function() {
      var addObject, backLight, barGeometry, barMaterial, barMirror, barMirrorGeometry, baseMaterial, cubeGeometry, cubemap, fillLight, frontLight, loader, material, rodMaterial, rodnormal, urls;
      //container = document.querySelector '#viz-container'
      WIDTH = container.offsetWidth;
      HEIGHT = container.offsetHeight;
      camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
      camera.position.set(0, 9, 35.0);
      scene = new THREE.Scene();
      backLight = new THREE.SpotLight(0xffffff);
      backLight.position.set(10, 60.0, -60.0);
      //backLight.castShadow = true
      scene.add(backLight);
      frontLight = new THREE.SpotLight(0xffffff);
      frontLight.position.set(0, 10, 60);
      scene.add(frontLight);
      fillLight = new THREE.SpotLight(0xffffff);
      fillLight.position.set(60, 10, 0);
      scene.add(fillLight);
      urls = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'];
      cubemap = new THREE.CubeTextureLoader().load(urls);
      cubemap.format = THREE.RGBFormat;
      rodnormal = new THREE.TextureLoader().load('rodnormal.png');
      rodnormal.format = THREE.sRGBFormat;
      cubeGeometry = new THREE.BoxBufferGeometry(150, 150, 150);
      material = new THREE.MeshPhongMaterial({
        shininess: 50,
        color: 0x000000,
        specular: 0x999999
      });
      addObject = function(geometry, material, x, y, z, ry) {
        var tmpMesh;
        tmpMesh = new THREE.Mesh(geometry, material);
        tmpMesh.material.color.offsetHSL(0.1, -0.1, 0);
        tmpMesh.position.set(x, y, z);
        tmpMesh.rotation.y = ry;
        tmpMesh.castShadow = true;
        tmpMesh.receiveShadow = true;
        scene.add(tmpMesh);
        return tmpMesh;
      };
      barMirrorGeometry = new THREE.PlaneBufferGeometry(50.0, 5.2);
      barMirror = new Reflector(barMirrorGeometry, {
        clipBias: 0.003,
        textureWidth: WIDTH * window.devicePixelRatio,
        textureHeight: HEIGHT * window.devicePixelRatio,
        color: 0xdb8778,
        recursion: 1
      });
      barMirror.rotateX(-Math.PI / 2);
      scene.add(barMirror);
      barGeometry = new THREE.BoxBufferGeometry(500, 6, 50);
      barMaterial = new THREE.MeshStandardMaterial({
        color: 0xfe8778,
        metalness: 0.9,
        envMap: cubemap,
        roughness: 0.2
      });
      baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.8,
        envMap: cubemap,
        roughness: 0.5
      });
      rodMaterial = new THREE.MeshStandardMaterial({
        color: 0xfe8778,
        metalness: 1.0,
        envMap: cubemap,
        roughness: 0.2,
        normalMap: rodnormal
      });
      objects.camera = camera;
      loader = new THREE.GLTFLoader();
      loader.load('earthbar3.glb', function(object) {
        var i, key, myrod, obj;
        object.scenes[0].traverse(function(child) {
          if (child.isMesh) {
            objects[child.name] = child;
            child.castShadow = true;
            return child.receiveShadow = true;
          }
        });
        loaded = true;
        objects.base.material = baseMaterial;
        objects.base.material.morphTargets = true;
        scene.add(objects.base);
        barMirror.position.set(objects.mirror.position.x, objects.mirror.position.y, objects.mirror.position.z + 0.1);
        objects.plate.material = barMaterial;
        objects.plate.material.morphTargets = true;
        scene.add(objects.plate);
        objects.cone.material = baseMaterial;
        scene.add(objects.cone);
        objects.cone2.material = baseMaterial;
        scene.add(objects.cone2);
        objects.bignut.material = baseMaterial;
        scene.add(objects.bignut);
        objects.cone3 = objects.cone.clone();
        objects.cone3.position.x += 35;
        scene.add(objects.cone3);
        objects.cone4 = objects.cone2.clone();
        objects.cone4.position.x += 35;
        scene.add(objects.cone4);
        objects.bignut2 = objects.bignut.clone();
        objects.bignut2.position.x += 35;
        scene.add(objects.bignut2);
        objects.rods = [];
        objects.rod.material = rodMaterial;
        objects.hexnut.material = baseMaterial;
        objects.nubble.material = barMaterial;
        i = -2;
        while (i++ < 6) {
          myrod = {
            rod: objects.rod.clone(),
            nut1: objects.hexnut.clone(),
            nut2: objects.hexnut.clone(),
            nut3: objects.hexnut.clone(),
            nubble: objects.nubble.clone()
          };
          myrod.nut1.position.y += 1.2;
          myrod.nut3.position.y -= 1.4;
          for (key in myrod) {
            obj = myrod[key];
            scene.add(obj);
            obj.position.x += 5 * i;
            if (/nut/.test(key)) {
              obj.rotation.y += Math.random() * Math.PI;
            }
            if (i === -1 || i === 6) {
              if (key !== 'nubble') {
                obj.position.y -= 1.06;
              }
            }
          }
          objects.rods.push(myrod);
        }
        return stateManager.init();
      });
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(WIDTH, HEIGHT);
      container.appendChild(renderer.domElement);
      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.setClearColor(0xffffff);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
      window.addEventListener('resize', onWindowResize, false);
      return objects.controls = controls;
    };
    onWindowResize = function() {
      WIDTH = container.offsetWidth;
      HEIGHT = container.offsetHeight;
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      return renderer.setSize(WIDTH, HEIGHT);
    };
    animate = function() {
      requestAnimationFrame(animate);
      return render();
    };
    render = function() {
      var delta;
      delta = clock.getDelta();
      controls.update();
      if (loaded) {
        animationManager.update();
      }
      return renderer.render(scene, camera);
    };
    init();
    animate();
    return window.transitionTo = stateManager.transitionTo;
  };

}).call(this);

//# sourceMappingURL=index.js.map
