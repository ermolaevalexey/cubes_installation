$(function(){

	var scene,
		camera,
		controls,
		renderer,
		grid,
		color,
		axis,
		geometry,
		material,
		cubeBumper,
		plane,
		planeGeo,
		planeMaterial,
		pos,
		phymat,
		cubesArr,
		group,
		spotLight,
		selection,
		offset,
		spotLightBack,
		raycaster = new THREE.Raycaster();

	init();	
	animate();		

	function init() {
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
			controls;
			renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
			grid = new THREE.GridHelper(50, 5);
			color = new THREE.Color('rgb(255, 0, 0)');
			axis = new THREE.AxisHelper(10);
			geometry = new THREE.BoxGeometry(3,3,3);
			material = new THREE.MeshLambertMaterial({color: 0xFFC532});
			cubeBumper = new THREE.Mesh( geometry, material);
			cubesArr = [];
			planeGeo = new THREE.PlaneBufferGeometry(500, 500, 8, 8);
			planeMaterial = new THREE.MeshNormalMaterial({transparent: true, opacity: 0.0});
			plane = new THREE.Mesh(planeGeo, planeMaterial);
			spotLight = new THREE.SpotLight(0xffffff);
			spotLightBack = new THREE.SpotLight(0xffffff);
			pos = new THREE.Vector3( 0, 0 ,0 );
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.shadowMap.enabled = true;
			renderer.shadowMapSoft = true;
			console.log(raycaster);
			plane.position.set(0,0,0);
			offset = new THREE.Vector3();

			$('#graph-container').append(renderer.domElement);
			$('.addObj').click(function(){
				addCube();
			});

			for (var i = 0; i < 50; i++) {
				var defCube = new THREE.Mesh( geometry, material);
				defCube.position.set(100 * Math.random() - 50, 
								100 * Math.random() - 50, 
								100 * Math.random() - 50);
				scene.add(defCube);
				cubesArr.push(defCube);
			}

			//adding new cube
			function addCube () {
				var newCube = new THREE.Mesh(geometry, material);
				newCube.position.set(100 * Math.random() - 50, 
								100 * Math.random() - 50, 
								100 * Math.random() - 50);
				newCube.lookAt(cubeBumper.position);
				console.log(cubesArr);
				scene.add(newCube);
				cubesArr.push(newCube);
			}

			$(renderer.domElement).mousedown(function(event){
				//mouse position
				event.preventDefault();
				$(this).css('cursor', 'pointer');
				var mouseX = (event.pageX / window.innerWidth) * 2 - 1;
  				var mouseY = -(event.pageY / window.innerHeight) * 2 + 1;
				//get 3d vector from mouse position
				var vector = new THREE.Vector3(mouseX, mouseY, 1);
				vector.unproject(camera);
				//raycaster position
				raycaster.set(camera.position, vector.sub( camera.position ).normalize());
				//find all intersected objects
				var intersects = raycaster.intersectObjects(cubesArr);
				if(intersects.length > 0) {
					//Disable camera controls
					controls.enabled = false;
					//Set the selection - first intersected object
					selection = intersects[0].object;
					var intersects = raycaster.intersectObject(plane);
    				offset.copy(intersects[0].point).sub(plane.position);
				}
				console.log(plane);
			});

    		$(renderer.domElement).mousemove(function(event){
    			event.preventDefault();
    			//mouse position
				var mouseX = (event.pageX / window.innerWidth) * 2 - 1;
  				var mouseY = -(event.pageY / window.innerHeight) * 2 + 1;
				//get 3d vector from mouse position
				var vector = new THREE.Vector3(mouseX, mouseY, 1);
				vector.unproject(camera);
				//raycaster position
				raycaster.set(camera.position, vector.sub(camera.position).normalize());
				if(selection) {
					var intersects = raycaster.intersectObject(plane);
					console.log(intersects);
					selection.position.copy(intersects[0].point.sub(offset));
					$(this).css('cursor', 'move');
				} else {
					var intersects = raycaster.intersectObjects(cubesArr);
					if(intersects.length > 0) {
						plane.position.copy(intersects[0].object.position);
						plane.lookAt(camera.position);
						$(this).css('cursor', 'default');
					}
				}
    		});

    		$(renderer.domElement).on('mouseup', function(){
    			$(this).css('cursor', 'default');
    			controls.enabled = true;
  				selection = null;
    		});

		
			grid.setColors(color, 0x000000);
		
			spotLight.castShadow = true;
			spotLightBack.castShadow = true;
			spotLight.position.set(100,50,150);
			spotLightBack.position.set(-1550,-250,650);
		
			//scene.add(grid);
			//scene.add(axis);
			scene.add(plane);
			scene.add(cubeBumper);
			scene.add(spotLight);
			scene.add(spotLightBack);
		
			camera.position.set(-50, 7, 100);
			controls = new THREE.OrbitControls( camera, renderer.domElement );
			controls.dampingFactor = 0.5;
    		controls.target.set( pos.x, pos.y, pos.z );
		
			var guiConrols = new function(){
				this.rotationX = 0.01;
				this.rotationY = 0.01;
				this.rotationZ = 0.01;
			}
		
			var gui = new dat.GUI();

			gui.add(camera.position, 'x', -50,500).step(5);
    		gui.add(camera.position, 'y', -500,500).step(5);
    		gui.add(camera.position, 'z', 100,500).step(5);
		
			camera.lookAt(scene.position);
	}

	function animate() {
	    requestAnimationFrame(animate);
	    controls.update();
	    cubesArr.forEach(function(item){
	    	item.rotation.x += 0.01;
	    });
	    renderer.render(scene, camera);
	}

});