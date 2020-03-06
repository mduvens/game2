
// var express = require('express');
// var mysql = require('mysql')
// var app = express()
// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'sampleDB'
// })
// connection.connect(function (error) {
//     if (!!error) {
//         console.log('Error')
//     } else {
//         console.log('Connected')
//     }
// })

// app.get('/', function(req,resp){
//     connection.query("SELECT * FROM highscores ORDER BY Recorde DESC ", function(error,rows,fields){
//     if (error) {
//         console.log('Error in the query')
//     } else {
//         console.log('Success query')
//         console.log(rows)
//     }
//     })
// })
// app.listen(1338)


let scene,renderer, camera
Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
let tempoMorte
scene = new Physijs.Scene( {fixedTimeStep: 1 / 144})
scene.setGravity(new THREE.Vector3(0,-11000,0))
let cube
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
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 55000);
var maxSpeedHTML = document.getElementById("maxSpeed")
var dangerHTML = document.getElementById("danger")
var danger2HTML = document.getElementById("danger2")
let valorSpeedHTML = document.querySelector('.valorSpeed')
let morteHTML = document.getElementById("morte")
let clock = new THREE.Clock({
    autoStart: true
});
let listener = new THREE.AudioListener()
let  audio = new THREE.Audio(listener)
let audioLoader = new THREE.AudioLoader()

let highscore = 0
audioLoader.load('coxInferno.mp3', function (buffer) {
    audio.setBuffer(buffer)
    audio.setVolume(.8)
    audio.setLoop(true)
    audio.play()
})
let geometry = new THREE.BoxGeometry( 100000, 1, 2500 );
let material =  Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: .5}),.1,.9)
let chao = new Physijs.BoxMesh( geometry,material);
// let col = false
let light = new THREE.AmbientLight( 0x404040 ); // soft white light
let speed
// controls = new THREE.OrbitControls(camera, renderer.domElement)
ajustarJanela = function () {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
let frame = 0, i =0
let riscas = []
let nivel = 1
// "estrelas"
let materialS = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 10,
    map: new THREE.TextureLoader().load("whiteC.jpg"),

})
starGeo = new THREE.BoxGeometry(20000,20000,20000);
for(let i=0; i<6000; i++){
    star = new THREE.Vector3(
        Math.random() * 40000 - 40000,
        Math.random() * 30000 - 10000,
        Math.random() * 60000 - 30000
    )
    star.velocity = speed;
    star.accelaration = 1.8;
    starGeo.vertices.push(star);
}
stars = new THREE.Points(starGeo, materialS)



criarJogador = function(){
    cube = new Physijs.SphereMesh(new THREE.SphereGeometry(130,50,50), Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xCCCCCC,transparent:true,opacity:.9, map: new THREE.TextureLoader().load("fire.jpg")}),.1,.1), 1)
    cube.position.set(4000,200,0)
    //cube.rotation.y = Math.PI/2
    cube.addEventListener('collision', function(obj,vel,ang){
        if(obj.name == "inimigo"){
            if(Math.floor(frame/100) > highscore){
                highscore = Math.floor(frame/100)
            }
            morteHTML.style.display = 'block'
            scene.remove(obj)
            obj.vivo = false
            valorSpeedHTML.style.color = "rgba(69, 230, 5, 0.61)"
            maxSpeedHTML.style.display = 'none'
            tempoMorte = 0
            limparMapa()
        }
        else{
            podeSaltar = true
            cube.setLinearVelocity(new THREE.Vector3(0,0,0))
        }

    })
    scene.add(cube)

}


limparMapa = function(){
    objetos.forEach(c=>{
        if(c.mesh.vivo){
            scene.remove(c.mesh)
            c.mesh.vivo = false
        }
    })
    camera.position.set( 6000, 475,0)
    camera.rotation.y = Math.PI/2
    if(startPlane.vivo){
        scene.remove(startPlane)
        startPlane.vivo = false
    }
    scene.remove(cube)
    criarJogador()
    velocity.x = 0
    velocity.z = 0
    velocity.y = 0
    cube.position.set(4000,200,0)
    criarStartPlane()
    maxSpeed = false
    nivel = 1
    frameObj = 100
    frame = 0
}
riscaLimite = function(){
    this.geo = new THREE.BoxGeometry(20000,2,20)
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xaaaaaa, transparent:true,opacity:.5}))
    this.mesh = new Physijs.Mesh(this.geo,this.material)
    this.mesh.vivo = true
}
criarRiscasLimite  = function(){
    limite1 = new riscaLimite()
    limite1.mesh.position.set(-5000,10,1200)
    scene.add(limite1.mesh)

    limite2 = new riscaLimite()
    limite2.mesh.position.set(-5000,10,-1200)
    scene.add(limite2.mesh)
}
criarRiscasLimite()
pode = true
function init() {
    ajustarJanela()
    criarStartPlane()
    scene.add(camera)
    scene.add( light )
    scene.add( chao );
    scene.add(stars)
    criarJogador()
    chao.setLinearFactor(new THREE.Vector3( 0, 0, 0 ))
    chao.setAngularFactor(new THREE.Vector3( 0, 0, 0 ))
    renderer.render(scene, camera)
}
criarStartPlane = function() {
    startPlane = new THREE.Mesh(new THREE.BoxGeometry(30000,10,2500), new THREE.MeshBasicMaterial({color:0x1F1F1F, map: new THREE.TextureLoader().load("images.jpg")}))
    startPlane.vivo = true
    startPlane.position.set(-10000,0,0)
    scene.add(startPlane)
}
let delta,velocity = new THREE.Vector3(0,0,0)

camera.position.set( 6000, 475,0)
camera.rotation.y = Math.PI/2



let maxSpeed = false, boolDanger = true
function animate() {
    if (frame % 20 == 0) {
        boolCor ? boolCor = false : boolCor = true
    }
    delta = clock.getDelta()
    cube.__dirtyPosition = true
    cube.__dirtyRotation = true;
    tempoMorte += 1
    if(tempoMorte == 100){
        morteHTML.style.display = 'none'
    }
    score = Math.floor(frame/100)
    barraNivel.setValue(score)
    barraHighscore.setValue(highscore)
    
    if(score<=41){
        speed = Math.ceil(10 * nivel)
    }
    else if(score >41 && score<= 61){
        speed = 130
        valorSpeedHTML.style.color = "#d3cf03cb"
    }
    else{
        speed = 150
        maxSpeedHTML.style.display = 'block'
        maxSpeed = true
        valorSpeedHTML.style.color = "#e00902a1"

    }
    maxSpeed? boolCor ? maxSpeedHTML.style.display = 'block' : maxSpeedHTML.style.display = 'none' : 0
    barraSpeed.setValue(speed)
    frame += 1
    if(startPlane.vivo){
        startPlane.position.x += 100 * nivel
    }
    if(startPlane.position.x > 20000){
        scene.remove(startPlane)
    }
    
    if (frame>4100 && frame<=4200){
        dangerHTML.style.display = "block"
        if(frame % 20 == 0){
            if(boolDanger){
                dangerHTML.style.transform = "scale(1.4)"
                boolDanger= false
            }else{
                dangerHTML.style.transform = "scale(1)"
                boolDanger= true
            }    
        }
    }
    if(frame > 4200){
        dangerHTML.style.display = "none"
    }
    if (frame>6100 && frame<=6200){
        danger2HTML.style.display = "block"
        if(frame % 10 == 0){
            if(boolDanger){
                danger2HTML.style.transform = "scale(1.8)"
                boolDanger= false
            }else{
                danger2HTML.style.transform = "scale(1)"
                boolDanger= true
            }    
        }
    }
    if(frame > 6200){
        danger2HTML.style.display = "none"
    }
 
    criarObjetos()
    criarRiscas()
    cube.position.z += velocity.z * delta
    limitarJogador()
   
    // if(frame % 35 == 0){
    //     cube.material.color.set(getRandomColor())
    // }
    // if(frame<5000){
    //    if(frame%1000 == 0){
    //        nivel += 2
    //    }
    // }
    // if(frame==5000){
       
    //         nivel += 1
        
    //  }
    if(frame < 4000){
        nivel += 0.00225
    }
     if(frame>6200){
        trocarCorJogador()
     }
     moverObjetos()
    cube.rotation.z += 0.1 * nivel
    starGeo.verticesNeedUpdate = true;
    scene.simulate()
    // if(nivel<10){
    //     nivel += 0.001
    // }
    // speed = Math.ceil(10 * nivel)
    renderer.render(scene,camera)
    requestAnimationFrame(animate)
}

moverObjetos = function(){
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
    riscas.forEach(p=>{
        if(p.mesh.vivo){
            p.mesh.position.x += speed* 10
            if(p.mesh.position.x > 10000){  
                p.mesh.position.x = -25000
                // p.mesh.vivo = false 
                //     scene.remove(p.mesh)
                    
            }
        }
    })
    starGeo.vertices.forEach(p=>{
        // p.velocity += p.accelaration;
        // p.x += p.velocity;
        p.x += speed* 10
        if(p.x > 7000){
            p.x = -25000;
            p.y = Math.random() * 30000 - 10000
            p.z =  Math.random() * 60000 - 30000
           
        }
    })
}
limitarJogador = function(){
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
    if (cube.position.z <= 20 && cube.position.z >= -20){
        velocity.z = 0
        cube.position.z = 0
        pode = true
    }
    if (cube.position.x >= 4005 || cube.position.x <= -4005){
        cube.position.x = 4000

    }
}
let boolCor
trocarCorJogador = function(){
    
    boolCor ?  cube.material.color.set(0xCCCCCC) :    cube.material.color.set(0xffa500)
}
let x = 0,frameObj = 100


function shuffleArray(array) {  // Durstenfeld shuffle
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let objetos =[]
let posicoesZ = [
    0,-800,800
]
let posicoesY = [
    600,200
]
let posicoesABS = [
    [200,0],[200,800],[200,-800],
    [600,0],[600,800],[600,-800]
]
let indiceABS = 0

criarObjetos = function(){
    if (!(frame>4000 && frame<=4250 || frame>6000 && frame<=6250 )){
        if(frame>4200 && frame<=6000){
            frameObj=60
        }
        if(frame>6250 ){
            frameObj=45
        }
        if (frame % frameObj == 0){   
                shuffleArray(posicoesABS)
            for(let i =0; i< (nivel >= 10 ? 5 : Math.floor(nivel/2 + 1)) ;i++){
                objetos[x]= new obj()   
                if(score> 60){
                    indiceABS < 5 ? indiceABS += 1 : indiceABS  = 0  
                }
                else{
                    indiceABS < Math.floor(Math.random() * 5) + 1   ? indiceABS += 1 : indiceABS  = 0  
                }
                // objetos[x].mesh.addEventListener('collision', function(obj,vel,ang){
                // })
                scene.add(objetos[x].mesh)
                objetos[x].mesh.setLinearFactor(new THREE.Vector3(0,0,0))
                x+=1
              
            }
        }
    }  
    x > 20 ? x = 0 : 0  
}

obj = function(){
    this.geo = new THREE.BoxGeometry(300,400,800)
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: getRandomColor(), transparent: true,opacity:.9}))
    this.mesh = new Physijs.BoxMesh(this.geo,this.material,0)
    this.mesh.vivo = true
    this.mesh.name = "inimigo"
    this.mesh.position.set(-45000,posicoesABS[indiceABS][0],posicoesABS[indiceABS][1]) 
   
 
}
getRandomColor = function() {
    let letters = '789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 9)];
    }
    return color;
}


let counter

criarInimigo = function() {
    
}
risca = function(){
    this.geo = new THREE.BoxGeometry(2000,2,80)
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x00AA00}))
    this.mesh = new Physijs.Mesh(this.geo,this.material)
    this.mesh.vivo = true
}
let contador =0
criarRiscas = function(){
    if(contador <10){
        if(frame % (60 / Math.floor(nivel)) == 0){
            riscas[contador] = new risca()
        riscas[contador].mesh.position.set(-25000, 0,400)
        scene.add(riscas[contador].mesh)
        contador++
        riscas[contador] = new risca()
        riscas[contador].mesh.position.set(-25000, 0,-400)
        scene.add(riscas[contador].mesh)
        contador++
        }    
    }
    
}





onKeyDown = function (e) {
    switch (e.keyCode) {
        // case 87:
        // console.log("delta ", delta)
        // console.log("vel ", velocity.y)
        // console.log(camera.position)
        //     break;
        case 39:
        case 68:
        if (pode && cube.position.z > -700){
            velocity.z -= 4000
            pode = false
            break;
        }
        else break

        case 82:
            console.log(boolDanger)
            break
        case 37:
        case 65:
            if (pode && cube.position.z < 800){
                velocity.z += 4000
                pode = false
                break
            }
            else break
        
        case 38:
        case 32:
        case 87:
            if(podeSaltar){
                cube.setLinearVelocity(new THREE.Vector3(0,4000,0))
                podeSaltar = false
                break;
            }
            else break
        case 83:
        case 40:
            if(cube.position.y> 200){
                cube.setLinearVelocity(new THREE.Vector3(0,-3000,0))
                break;
            }
            else break
    }
}

document.addEventListener('keydown', onKeyDown, false);
// document.addEventListener('keyup', onKeyUp, false);

criarNivelHTML = function(){
    class barraProgresso{
        constructor(elemento, initialValue = 1){
            this.valorElemento = elemento.querySelector('.valorScore')
            this.setValue(initialValue)
        }
        setValue(valor){
            this.valorVida = valor
            this.valorElemento.textContent = this.valorVida
        }
    }
    barraNivel = new barraProgresso(document.querySelector('.score'))

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
criaSpeedHTML = function(){
    class barraSp{
        constructor(elemento, initialValue = 1){
            this.valorElemento = elemento.querySelector('.valorSpeed')
            this.setValue(initialValue)
        }
        setValue(valor){
            this.valorVida = valor
            this.valorElemento.textContent = this.valorVida
        }
    }
    barraSpeed = new barraSp(document.querySelector('.speed'))

}
morteHTML.addEventListener('click', function () {
    morteHTML.style.display = 'none';
})
criaSpeedHTML()
criarNivelHTML()
criarHighscoreHTML()
init()
animate()

