var scene,renderer, camera
Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
var tempoMorte
scene = new Physijs.Scene( {fixedTimeStep: 1 / 144})
scene.setGravity(new THREE.Vector3(0,-10000.0))

// scene.background = new THREE.CubeTextureLoader()
// 	.load( [
// 		'snow/posx.png',
// 		'snow/negx.png',
// 		'snow/posy.png',
// 		'snow/negy.png',
// 		'snow/posz.png',
// 		'snow/negz.png'
// 	] );
renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000)
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 240000);

var clock = new THREE.Clock({
    autoStart: true
});

var morteHTML = document.getElementById("morte")
let highscore = 0

var geometry = new THREE.BoxGeometry( 100000, 1, 2500 );
var material =  Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x000000, transparent: true}),.1,.9) 
var chao = new Physijs.BoxMesh( geometry,material);

var col = false
var cube = new Physijs.SphereMesh(new THREE.SphereGeometry(150,50,50), Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x263248}),.1,.1), 1000)
cube.position.set(4000,200,0)
cube.addEventListener('collision', function(obj,vel,ang){
    if(obj.name == "inimigo"){
        if(frame > highscore){
            highscore = frame
        }
        morteHTML.style.display = 'block'
        tempoMorte = 0
        // scene.remove(obj)
        // obj.vivo = false
        limparMapa()
    }
    
})
cube.vida = 100

var light = new THREE.AmbientLight( 0x404040 ); // soft white light

 //controls = new THREE.OrbitControls(camera, renderer.domElement)
ajustarJanela = function () {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
// sky

let materialS = new THREE.PointsMaterial({
    color: 0xF0F0F0,
    size: 50,
    map: new THREE.TextureLoader().load("whiteC.jpg"),
    transparent: true,
    opacity: .4
})
starGeo = new THREE.BoxGeometry(10000,10000,10000);
for(i=0; i<4000; i++){
    star = new THREE.Vector3(
        Math.random() * 60000 - 30000,
        Math.random() * 20000 - 10000,
        Math.random() * 30000 - 15000
    )
    star.velocity = 20;
    star.accelaration = 1.8;
    starGeo.vertices.push(star);
}
stars = new THREE.Points(starGeo, materialS)

limparMapa = function(){
    riscas.forEach(c=>{
        scene.remove(c.mesh)
    })
    objetos.forEach(c=>{
        if(c.mesh.vivo){
            scene.remove(c.mesh)
        }
    })
    camera.position.set( 6000, 475,0)
    camera.rotation.y = Math.PI/2
    if(startPlane.vivo){
        scene.remove(startPlane)
    }
    startPlane = new THREE.Mesh(new THREE.BoxGeometry(30000,10,2500), new THREE.MeshBasicMaterial({color:0x1F1F1F, map: new THREE.TextureLoader().load("images.jpg")}))
    startPlane.vivo = true
    startPlane.position.set(-10000,0,0)
    scene.add(startPlane)
    nivel = 1
    frame = 0
}
pode = true
function init() {
    scene.add(camera)
    scene.add( light )
    scene.add(cube)
    scene.add( chao );
    scene.add(stars)
    chao.setLinearFactor(new THREE.Vector3( 0, 0, 0 ))
    chao.setAngularFactor(new THREE.Vector3( 0, 0, 0 ))
    renderer.render(scene, camera)
}
var delta,velocity = new THREE.Vector3(0,0,0)

camera.position.set( 6000, 475,0)
camera.rotation.y = Math.PI/2
startPlane = new THREE.Mesh(new THREE.BoxGeometry(30000,10,2500), new THREE.MeshBasicMaterial({color:0x1F1F1F, map: new THREE.TextureLoader().load("images.jpg")}))
startPlane.vivo = true
startPlane.position.set(-10000,0,0)
scene.add(startPlane)
var frame = 0, i =0
var riscas = [],nivel = 1
function animate() {
    delta = clock.getDelta()
    cube.__dirtyPosition = true
    cube.__dirtyRotation = true;
    tempoMorte += 1
    if(tempoMorte == 180){
        morteHTML.style.display = 'none'
    }
    barraNivel.setValue(Math.floor(frame))
    barraHighscore.setValue(highscore)
    frame += 1
    if(startPlane.vivo){
        startPlane.position.x += 100
    }
    if(startPlane.position.x > 20000){
        scene.remove(startPlane)
    }
    riscass()
    criarObjetos()
    cube.position.z += velocity.z * delta
    if(cube.position.z > 800 ){
        velocity.z = 0
        cube.position.z = 800
        pode = true
    }
     if(cube.position.z < -800 ){
        velocity.z = 0
        cube.position.z = -800
        pode = true
    }
    if (cube.position.z <= 10 && cube.position.z >= -10){
        velocity.z = 0
        cube.position.z = 0
        pode = true
    }
    if (cube.position.x >= 4005 || cube.position.x <= -4005){
        cube.position.x = 4000
        
    }
    starGeo.vertices.forEach(p=>{
        p.velocity += p.accelaration;
        p.x += p.velocity;
        if(p.x > 20000){
            p.x = -20000;
            p.velocity = 30 * nivel;
        }
    })
    // if(frame%120 == 0){
    //     renderer.setClearColor(getRandomColor())
    // }
    objetos.forEach(p=>{
        if(p.mesh.vivo){
            p.mesh.__dirtyPosition = true
            p.mesh.position.x += 100 * nivel
            if(p.mesh.position.x> 10000){
                scene.remove(p.mesh)
                p.mesh.vivo = false    
            }    
           
        }

       
    })
    starGeo.verticesNeedUpdate = true;
    scene.simulate()
    ajustarJanela()
    renderer.render(scene,camera)
    requestAnimationFrame(animate)
}
criarObjetos = function(){
    if(frame <= 1200){
        inimigos1()
        nivel = 1
       
    }
    else if(frame > 1200 && frame <= 3600){
        inimigos2()
        nivel = 2
      
    }
    else if(frame > 3600 && frame <= 4800){
        inimigos3()
        nivel = 3
        
    }
    else if(frame > 4800){
        inimigos4()
        nivel = 4
    }

}
getRandomColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
risca = function(){
    this.geo = new THREE.BoxGeometry(2000,2,100)
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x17921f}))
    this.mesh = new Physijs.Mesh(this.geo,this.material)
}
obj = function(){
    this.geo = new THREE.BoxGeometry(300,400,700)
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: getRandomColor()}),.1,.5)
    this.mesh = new Physijs.BoxMesh(this.geo,this.material,0)
    this.mesh.vivo = true
    this.mesh.name = "inimigo"
}
objeto = function(){
    if (frame % 120 == 0){
        objetos[x]= new obj()
        objetos[x].mesh.position.set(-14000,posicoesY[Math.floor(Math.random() * 2)],posicoesZ[Math.floor(Math.random() * 3)])
        objetos[x].mesh.addEventListener('collision', function(obj,vel,ang){
        })
        // objetos[x].setCcdMotionThreshold(10);
        // objetos[x].setCcdSweptSphereRadius(2);
        scene.add(objetos[x].mesh) 
        objetos[x].mesh.setLinearFactor(new THREE.Vector3(0,0,0))
        x+=1
        
        
    }
}
let objetos =[]
let posicoesZ = [
    0,-800,800
] 
let posicoesY = [
    700,200
] 

let x = 0
inimigos1 = function(){
        objeto()  
}
inimigos2 = function(){
        objeto()
        objeto()   
}
inimigos3 = function(){   
        objeto()
        objeto()
        objeto()   
}
inimigos4 = function(){   
        objeto()
        objeto()
        objeto()
        objeto()   
}
riscass  = function(){
    if(frame % (60 / nivel) == 0){
        riscas[i] = new risca
        riscas[i].mesh.position.set(-25000, 5,500)
        scene.add(riscas[i].mesh)
        i++
        
        riscas[i] = new risca
        riscas[i].mesh.position.set(-25000, 5,-500)
        scene.add(riscas[i].mesh)
        i++
    }
    riscas.forEach(e => {
        e.mesh.position.x += 100 * nivel
    });
    if (i> 10){
        i=0
    }
}

onKeyDown = function (e) {
    switch (e.keyCode) {
      
        case 87:
        console.log("delta ", delta)
        console.log("vel ", velocity.y)
        console.log(camera.position)
            break;
        case 39:
        case 68:
        if (pode && cube.position.z > -700){
            velocity.z -= 3000
            pode = false
            break;
        }
        else break

        case 82:
            console.log(objetos[0].vivo)
            break
        case 37:
        case 65:
            if (pode && cube.position.z < 800){
                velocity.z += 3000   
                pode = false
                break
            }
            else break
        case 32:
            cube.setLinearVelocity(new THREE.Vector3(0,4000,0))
            // podeSaltar = false
            break;
    }
}

document.addEventListener('keydown', onKeyDown, false);
// document.addEventListener('keyup', onKeyUp, false);

criarNivelHTML = function(){
    class barraProgresso{
        constructor(elemento, initialValue = 1){
            this.valorElemento = elemento.querySelector('.valorNivel')
            this.setValue(initialValue)
        }
        setValue(valor){
            this.valorVida = valor
            this.valorElemento.textContent = this.valorVida
        }
    }
    barraNivel = new barraProgresso(document.querySelector('.nivel'))
    
}
criarHighscoreHTML = function(){
    class barraHigh{
        constructor(elemento, initialValue = 1){
            this.valorElemento = elemento.querySelector('.valorHighscore')
            this.setValue(initialValue)
        }
        setValue(valor){
            this.valorVida = valor
            this.valorElemento.textContent = this.valorVida
        }
    }
    barraHighscore = new barraHigh(document.querySelector('.highscore'))
    
}
criarNivelHTML()
criarHighscoreHTML()
init()
animate()

