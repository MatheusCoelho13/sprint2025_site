// DeviceOrientationControls — versão GLOBAL (sem imports, funciona com THREE global)

THREE.DeviceOrientationControls = function (object) {

    this.object = object;
    this.object.rotation.reorder('YXZ');

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    const scope = this;

    function onDeviceOrientation(event) {
        scope.deviceOrientation = event;
    }

    function onScreenOrientation() {
        scope.screenOrientation = window.orientation || 0;
    }

    this.connect = function () {
        onScreenOrientation();
        window.addEventListener('orientationchange', onScreenOrientation);
        window.addEventListener('deviceorientation', onDeviceOrientation);
        scope.enabled = true;
    };

    this.disconnect = function () {
        window.removeEventListener('orientationchange', onScreenOrientation);
        window.removeEventListener('deviceorientation', onDeviceOrientation);
        scope.enabled = false;
    };

    this.update = function () {
        if (!scope.enabled) return;

        const device = scope.deviceOrientation;
        if (!device) return;

        const alpha = THREE.MathUtils.degToRad(device.alpha || 0);
        const beta = THREE.MathUtils.degToRad(device.beta || 0);
        const gamma = THREE.MathUtils.degToRad(device.gamma || 0);
        const orient = THREE.MathUtils.degToRad(scope.screenOrientation || 0);

        const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        const correction = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(0, 0, 1), -orient);

        quaternion.multiply(correction);

        scope.object.quaternion.copy(quaternion);
    };

    this.connect();
};
