

var buffer = new BufferLvl2(2);

setInterval(fetchData, 500);

function fetchData() {

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    try {
        if (xhr.readyState == XMLHttpRequest.DONE) {
           if (xhr.status == 200) {

            if (xhr.responseType == "json") {

              let responseJson = xhr.response;
              if (responseJson == null || JSON.stringify(responseJson) == JSON.stringify({})) {
                throw Error("NO DATA");
              }

              dataArr = JSON.parse(responseJson);
              buffer.write(dataArr);

            } else {
              throw Error("Expected response type to always be JSON");
            }
            
          } else {
            throw Error(xhr.statusText);
          }
        }
      } catch (error) {
        console.error(error);
      }
  }
  xhr.open('GET', 'http://192.168.1.11:3000/getMotionData', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = "json";
  xhr.send(null);
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
      transform4DArr[i] = positionArr[idx2];
      idx2++;
    } else if (i === 15) {
      transform4DArr[i] = 1;
    }
  }
  let transform4DMat = new three.Matrix4();
  transform4DMat.fromArray(transform4DArr);
  transform4DMat.setPosition(positionVec);

  let translation = new THREE.Vector3();
  let quaternion = new THREE.Quaternion();
  let scale = new THREE.Vector3();

  transform4DMat.decompose(translation, quaternion, scale);

  // return transform4DMat;
  return {translation: translation, quaternion: quaternion, scale: scale, transformMatrix: transform4DMat};
}
