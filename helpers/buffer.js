function BufferLvl2(maxBuffLength) {

	var writeIdx =  0;
	var readIdx = 0;
	var innerReadIdx = 0;

	var maxBuffLen = maxBuffLength;
	
	var container = new Array(maxBuffLen);

	this.write = function(obj) {
		container[writeIdx] = obj;
		writeIdx = (writeIdx + 1) % maxBuffLen;
	}

	this.read = function() {

		let obj = null;
		let readPortion = container[readIdx];
		if (readPortion != null) {
			obj = readPortion[innerReadIdx];
			innerReadIdx = innerReadIdx + 1;
			let dataLen = readPortion.length;
			if (innerReadIdx == dataLen) {
				container[readIdx] = null;
				innerReadIdx = 0;
				container[readIdx] = null;
				readIdx = (readIdx + 1) % maxBuffLen;
			}
		}

		return obj;
	}

};
