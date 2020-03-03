const VIEW_ANGLE = 45;              
const NEAR = 1;
const FAR = 10000;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = window.innerWidth / window.innerHeight;
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );
const pointLight =
            new THREE.PointLight(0xFFFFFF, 0.5);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#00001F")
const scene = new THREE.Scene();
// ** const container = document.querySelector('#container'); ** only document.body.appendChild ?
const ambientLight = new THREE.AmbientLight(0xffff44, 1.2);
let textureS = new THREE.TextureLoader().load('whiteC.jpg');
let materialS = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: textureS
})
starGeo = new THREE.BoxGeometry(300,300,300);
for(i=0; i<5000; i++){
    star = new THREE.Vector3(
        Math.random() * 400 - 200,
        Math.random() * 400 - 200,
        Math.random() * 400 - 200
    )
    star.velocity = 0.3;
    star.accelaration = 0.04;
    starGeo.vertices.push(star);
}
stars = new THREE.Points(starGeo, materialS)
// **********************************************************************

// INIT FUNCTION  
function init (){
    scene.add(camera)
    renderer.setSize(window.innerWidth, window.innerHeight);           
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    document.body.appendChild(renderer.domElement);

            //adjust window size
    window.addEventListener('resize', () =>{
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
})
camera.position.set(0,20,100)
controls.update()
scene.add(stars)
console.log(camera.position);
controls.update()
renderer.render(scene, camera)
}

// ANIMATE FUNCTION
function animate() {
    starGeo.vertices.forEach(p=>{
        p.velocity += p.accelaration;
        p.z += p.velocity;
        if(p.z > 200){
            p.z = -200;
            p.velocity = 0.3;
        }
    })
    starGeo.verticesNeedUpdate = true;
    requestAnimationFrame(animate)  
    controls.update()
    renderer.render(scene, camera)
    }

init()
animate() 