

THREE.NativeDeviceOrientationControls = function( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;


	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis
		// var q1 = new THREE.Quaternion(0, Math.sqrt( 0.5 ), 0, Math.sqrt( 0.5 ) ); // - PI/2 around the y-axis

		return function( quaternion, alpha, beta, gamma, orient, newQuaternion ) {

			// eulerAngles: {pitch: number, roll: number, yaw: number},

			// euler.set( beta, -gamma, alpha, 'YXZ' ); // 'XYZ' for the device, but 'YXZ' for us
			euler.set( beta, alpha, -gamma, 'YXZ' ); // 'XYZ' for the device, but 'YXZ' for us
			
			quaternion.setFromEuler( euler ); // orient the device
			// quaternion.copy(newQuaternion);

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			// quaternion.multiply( q0.setFromAxisAngle( zee, orient ) ); // adjust for screen orientation

		}

	}();

	this.connect = function() {

		scope.enabled = true;

	};


	this.update = function() {

		var attitude = interpretData(buffer.read());
		if (attitude ==  null) {
			// this.update();
			return;
		}

		var eulerAngles = attitude.eulerAngles;
		var quaternion = new THREE.Quaternion(attitude.quaternion.x, attitude.quaternion.y, attitude.quaternion.z, attitude.quaternion.w);
		// quaternion = quaternion.inverse();
		// quaternion.set(attitude.quaternion.z, attitude.quaternion.y, attitude.quaternion.x, attitude.quaternion.w);
		// var quaternion = attitude.quaternion;

		

		if ( scope.enabled === false ) return;

		var orient = Math.PI / 2;
		orient = eulerAngles.yaw;

		setObjectQuaternion( scope.object.quaternion, eulerAngles.yaw, eulerAngles.pitch, eulerAngles.roll, orient, quaternion );

	};

	this.connect();

};
