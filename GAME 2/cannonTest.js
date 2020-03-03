var world, body, shape, timeStep=1/60,camera, scene, renderer, geometry, material, mesh;
var velocity = new THREE.Vector3(0,0,0)
var clock = new THREE.Clock({
    autoStart: true
});
var delta
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x597073)
document.body.appendChild( renderer.domElement );
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set(60,10,0);
scene.add( camera );
var controls = new THREE.OrbitControls(camera,renderer.domElement)


function initCannon() {
    world = new CANNON.World();
    world.gravity.set(0,-100,0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    shape = new CANNON.Sphere(2,2,2);

    body = new CANNON.Body({
    mass: 1,position: new THREE.Vector3(40,10,0)
    });
    body.addShape(shape);
    body.angularVelocity.set(0,100,0);
    body.angularDamping = 0.5;
    world.addBody(body)

    // Create a slippery material (friction coefficient = 0.0)
    // physicsMaterial = new CANNON.Material("slipperyMaterial");
    // var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
    //                                                         physicsMaterial,
    //                                                         .1, // friction coefficient
    //                                                         0.9 // restitution
    //                                                         );
    // // We must add the contact materials to the world
    // world.addContactMaterial(physicsContactMaterial);
    material = new THREE.MeshBasicMaterial( { color: 0x133337,side: THREE.DoubleSide } );
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 , material: material});
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.addBody(groundBody);
}


    geometry = new THREE.SphereGeometry(5,32,32 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    geometryC = new THREE.PlaneGeometry(100,100,1 );
    materialC = new THREE.MeshBasicMaterial( { color: 0x0F0F0F ,side:THREE.DoubleSide} );
    chao = new THREE.Mesh( geometryC, materialC );
    chao.rotation.x += Math.PI/2
    chao.position.y = -3
    scene.add( chao );
   
var pode = true
onKeyDown = function (e) {
        switch (e.keyCode) {
         
            case 87:
            console.log("delta ", delta)
            console.log("vel ", velocity.y)
            console.log(body.position)
                break;
           
            case 68:
            if(pode && mesh.position.z > -40){
                velocity.z -= 70
                pode = false
                break;
            }
            else break
          
    
            case 65:
              
                if(pode && mesh.position.z < 40){
                    velocity.z += 70
                    pode = false
                    break;
                }
                else break
               
               
            case 32:
                velocity.y = 0
                velocity.y += 100;
              
                break;
        }
    }
document.addEventListener('keydown', onKeyDown, false);

function animate() {
    delta = clock.getDelta()
    controls.update()

    // Step the physics world
    world.step(timeStep);
    // if(velocity.y > 0){
    //     velocity.y -= 1000 * delta
    // }
    body.position.y += velocity.y * delta
    body.position.z += velocity.z * delta
  
    if(body.position.z > 40 ){
        body.position.z = 40
        velocity.z = 0
        pode = true
    }
    if( body.position.z < -40 ){
        body.position.z = -40
        velocity.z = 0
        pode = true
    }
    if(body.position.z > -1 && body.position.z < 1){
        body.position.z = 0
        velocity.z = 0
        pode = true
    }
//    if(body.position.y <= 2){
//        velocity.y = 0
//        body.position.y = 2
//    }
    
  
  // Copy coordinates from Cannon.js to Three.js
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

initCannon();
animate();

