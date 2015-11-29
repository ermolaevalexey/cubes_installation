	if (!Detector.webgl) {
	    Detector.addGetWebGLMessage();
	}

	var renderer, scene, camera, controls;
	var plane, sphere, item;
	var symbols = [];
	var symbol = new THREE.Object3D();
	var group = new THREE.Object3D();

	init();
	animate();

	function init() {
	    if (!Detector.webgl) {
	        renderer = new THREE.CanvasRenderer({
	            antialias: true
	        });
	    } else {
	        renderer = new THREE.WebGLRenderer({
	            antialias: true
	        });
	    }

	    var geometry, material, mesh, info;

	    renderer.setSize(window.innerWidth, window.innerHeight);
	    document.body.appendChild(renderer.domElement);
	    scene = new THREE.Scene();

	    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
	    camera.position.set(-100, 100, 100);
	    controls = new THREE.TrackballControls(camera, renderer.domElement);

	    var css = document.body.appendChild(document.createElement('style'));
	    css.innerHTML = 'body {font: 600 12pt monospace; margin: 0; overflow: hidden; text-align: center; }';

	    // add stuff that provides a visual frame of reference 
	    material = new THREE.MeshBasicMaterial({
	        color: Math.random() * 0xffffff,
	        side: THREE.DoubleSide
	    });
	    geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
	    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	    plane = new THREE.Mesh(geometry, material);
	    scene.add(plane);

	    geometry = new THREE.SphereGeometry(8);
	    material = new THREE.MeshNormalMaterial();
	    sphere = new THREE.Mesh(geometry, material);
	    scene.add(sphere);

	    // create the 'symbol' and add to array of symbols		
	    geometryTorus = new THREE.TorusGeometry(4, 0.5, 15, 30);
	    materialTorus = new THREE.MeshBasicMaterial({
	        color: 0x000000
	    });

	    geometryCircle = new THREE.CircleGeometry(4);
	    materialCircle1 = new THREE.MeshBasicMaterial({
	        color: 0x00ffff,
	        opacity: 0.2,
	        side: THREE.FrontSide,
	        transparent: true
	    });
	    materialCircle2 = new THREE.MeshBasicMaterial({
	        color: 0xffff00,
	        opacity: 0.2,
	        side: THREE.BackSide,
	        transparent: true
	    });

	    for (var i = 0; i < 300; i++) {
	        symbol = new THREE.Object3D();

	        item = new THREE.Mesh(geometryTorus, materialTorus);
	        symbol.add(item);

	        item = new THREE.Mesh(geometryCircle, materialCircle1);
	        symbol.add(item);

	        item = new THREE.Mesh(geometryCircle, materialCircle2);
	        symbol.add(item);

	        symbols.push(symbol);
	    }
	}

	function disperseRandom() {
	    for (var i = 0, len = symbols.length; i < len; i++) {
	        var sym = symbols[i];
	        sym.position.set(100 * Math.random() - 50, 100 * Math.random() - 50, 100 * Math.random() - 50);
	        sym.lookAt(sphere.position);
	        group.add(sym);
	    }
	    scene.add(group);
	}

	function disperseLine() {
	    var j = 0,
	        delta = 2 * Math.PI * 10 / symbols.length;
	    for (var i = 0, len = symbols.length; i < len; i++) {
	        var sym = symbols[i];
	        j += delta;
	        sym.position.set(Math.sin(j * 0.70) * 50, Math.cos(j * 0.30) * 50, Math.sin(j * 0.20) * 50)
	        if (i > 0) sym.lookAt(symbols[i - 1].position);
	        group.add(sym);
	    }
	    scene.add(group);
	}

	function animate() {
	    requestAnimationFrame(animate);
	    controls.update();
	    renderer.render(scene, camera);
	}