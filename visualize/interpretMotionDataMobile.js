// "use strict";

// import three from "../node_modules/three/build/three.js";

const three = THREE;

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;

var box, coordAxis;

var buffer = new BufferLvl2(2);

init();
animate();

function init() {

  // fetchData();
  setInterval(fetchData, 500);

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 0,0, 400);
  // camera.matrixAutoUpdate = false;

  scene = new THREE.Scene();
  scene.autoUpdate = false;

  scene.add( new THREE.AmbientLight( 0x404040 ) );

  var map = new THREE.TextureLoader().load( './textures/UV_Grid_Sm.jpg' );
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16;

  var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );

  box = new THREE.Mesh( new THREE.BoxGeometry( 40, 100, 10), material );
  box.position.set( 0, 0, 0 );
  box.matrixAutoUpdate = false;
  scene.add( box );


  coordAxis = new THREE.AxisHelper( 100 );
  coordAxis.position.set( 0, 0, 0 );
  coordAxis.matrixAutoUpdate = false;
  scene.add( coordAxis );

  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  var color = new THREE.Color("rgb(255, 255, 255)")
  renderer.setClearColor( color, 0 );

  container.appendChild( renderer.domElement );

  stats = new Stats();
  container.appendChild( stats.dom );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();
}


function render() {

  let transformMat = interpretData(buffer.read());
  
  if (transformMat == null) {
    // fetchData();
    transformMat = box.matrixWorld;
  } else {
    transformMat = transformMat.clone();
  }

  box.matrixWorld = transformMat;

  coordAxis.matrixWorld = transformMat;

 // camera.position.set(0, 0, box.position.z + 400);

  // camera.lookAt( box.position );
  camera.lookAt(scene);

  renderer.render( scene, camera );
}

function fetchData() {

fetch('http://localhost:3000/getMotionData', {
     method: 'GET',
     headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
   }).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then((responseJson) => {
    
    if (responseJson == null || JSON.stringify(responseJson) == JSON.stringify({})) {
      throw Error("NO DATA");
    }
    // console.log(responseJson);

    dataArr = JSON.parse(responseJson);
    buffer.write(dataArr);
  }).catch((error) => {
   console.error(error);
  });

}

function interpretData(data) {
  
  let currData = data;

  if (currData == null) {
    return null;
  }

  let timestamp = currData.timestamp;
  let positionArr = currData.position;
  let rotMatArr = currData.rotationMatrix;

  let positionVec = new three.Vector3();
  // position values are in meters. convert to centimeters for better visualization
  positionArr = positionArr.map((elt) => {
    return elt * 100;
  });
  positionVec.fromArray(positionArr);

  var transform4DArr = Array(16).fill(0);
  var idx = 0;
  var idx2 = 0;
  for (let i = 0; i < 16; i++) {
    if (((i + 1) % 4) !== 0 && i < 12) {
      transform4DArr[i] = rotMatArr[idx];
      idx++;
    } else if (((i + 1) % 4) === 0 && i < 12){
      // transform4DArr[i] = positionArr[idx2];
      idx2++;
    } else if (i === 15) {
      transform4DArr[i] = 1;
    }
  }
  let transform4DMat = new three.Matrix4();
  transform4DMat.fromArray(transform4DArr);
  // transform4DMat.setPosition(positionVec);


  return transform4DMat;
}
