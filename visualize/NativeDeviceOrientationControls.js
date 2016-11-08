

THREE.NativeDeviceOrientationControls = function( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;

	this.moveState = {forward: 0};
	this.movementSpeed = 100.0;
	this.moveVector = new THREE.Vector3( 0, 0, 0 );


	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient) {

			euler.set( beta, alpha, -gamma, 'YXZ' ); // 'XYZ' for the device, but 'YXZ' for us
			
			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

		}

	}();



	this.connect = function() {

		scope.enabled = true;

		// var _processTouchOnScreen = bind( this, this.processTouchOnScreen );
		// var _processTouchEnded = bind( this, this.processTouchEnded );

		var _processTouchOnScreen = this.processTouchOnScreen.bind(this);
		
		var _processTouchEnded = this.processTouchEnded.bind(this);
		// Register touch event handlers
		window.addEventListener('touchstart', _processTouchOnScreen, false);
		window.addEventListener('touchmove', _processTouchOnScreen, false);
		window.addEventListener('touchcancel', _processTouchEnded, false);
		window.addEventListener('touchend', _processTouchEnded, false);

	};

	this.disconnect = function() {


		window.removeEventListener('touchstart', _processTouchOnScreen, false);
		window.removeEventListener('touchmove', _processTouchOnScreen, false);
		window.removeEventListener('touchcancel', _processTouchEnded, false);
		window.removeEventListener('touchend', _processTouchEnded, false);

		scope.enabled = false;

	};

	this.processTouchOnScreen = function( event ) {

		console.log("processTouchOnScreen");

		this.moveState.forward = -1; // -1 bc that is the direction forward (from screen to back of phone)


		this.updateMovementVector();
	};

	this.processTouchEnded = function( event ) {

		console.log("processTouchEnded");

		this.moveState.forward = 0;
		this.updateMovementVector();

	};

	this.updateMovementVector = function() {

		this.moveVector.z = this.moveState.forward;

	};


	this.update = function() {

		var attitude = interpretData(buffer.read());
		if (attitude ==  null) {

			return;
		}

		var eulerAngles = attitude.eulerAngles;


		if ( scope.enabled === false ) return;

		var orient = Math.PI / 2;
		orient = eulerAngles.yaw;

		setObjectQuaternion( scope.object.quaternion, eulerAngles.yaw, eulerAngles.pitch, eulerAngles.roll, orient);

		scope.object.translateZ( this.moveVector.z * this.movementSpeed );

	};

	this.dispose = function() {

		this.disconnect();
	};

	this.connect();

};
