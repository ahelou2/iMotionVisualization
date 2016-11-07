var buffer = new BufferLvl2(1);

setInterval(fetchData, 333);

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

              dataStruct = JSON.parse(responseJson);
              buffer.write(dataStruct);

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

  return {quaternion: data.motionData.quaternion, eulerAngles: data.motionData.eulerAngles};
}

