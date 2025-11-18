/**
 * VRButton.js — versão não-module para THREE.js global
 * Compatível com WebXR + Oculus/Meta Quest
 */

var VRButton = {

	createButton: function ( renderer ) {

		function showEnterVR( device ) {

			button.style.display = "";

			button.style.cursor = "pointer";
			button.style.left = "calc(50% - 50px)";
			button.style.width = "100px";

			button.textContent = 'ENTER VR';

			button.onmouseenter = function () {

				button.style.opacity = '1.0';

			};

			button.onmouseleave = function () {

				button.style.opacity = '0.5';

			};

			button.onclick = function () {

				if ( device.isPresenting ) {

					device.end();

				} else {

					device.requestSession( configuration ).then( function ( session ) {

						renderer.xr.setSession( session );

					} );

				}

			};

			renderer.xr.setDevice( device );

		}

		function disableButton() {

			button.style.display = "";

			button.style.cursor = "auto";
			button.style.left = "calc(50% - 75px)";
			button.style.width = "150px";

			button.onmouseenter = null;
			button.onmouseleave = null;
			button.onclick = null;

		}

		function showWebXRNotFound() {

			disableButton();

			button.textContent = 'VR NOT SUPPORTED';

		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '20px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'rgba(0 0 0 / 0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';

		}

		if ( 'xr' in navigator ) {

			var button = document.createElement( 'button' );
			button.style.display = 'none';

			stylizeElement( button );

			var configuration = {
				optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ]
			};

			navigator.xr.isSessionSupported( 'immersive-vr' ).then( function ( supported ) {

				supported ? showEnterVR( renderer.xr.getDevice() ) : showWebXRNotFound();

			} );

			return button;

		} else {

			var message = document.createElement( 'a' );
			if ( window.isSecureContext === false ) {
				message.href = document.location.href.replace( /^http:/, 'https:' );
			}
			message.innerHTML = 'WEBXR NEEDS HTTPS';
			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			stylizeElement( message );

			return message;

		}

	}

};
