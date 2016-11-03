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
