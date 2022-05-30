const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.querySelector('#scoreEl');
const endScoreEl = document.getElementById('endScoreEl');
const endTime = document.getElementById('endTime');

//full screen canvas
canvas.width = innerWidth; 
canvas.height = innerHeight;

class Player{
    constructor(){
        this.velocity = {
            x:0, 
            y:0
        }
        this.rotation = 0;
        const image  = new Image();
        this.opacity = 1;
        image.src = "./img/spaceship.png";
        image.onload = () =>{
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x:canvas.width / 2 - this.width / 2,
                y:canvas.height - this.height - 20
            }
        }  
    }

    draw(){

        c.save();

        c.globalAlpha = this.opacity;

        c.translate(
            player.position.x + player.width/2,
            player.position.y + player.height/2
        );

        c.rotate(this.rotation);

        c.translate(
            - player.position.x - player.width/2,
            - player.position.y - player.height/2
        );

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );

        c.restore();
    }
    
    update(){
        if(this.image){
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

class Invader{
    constructor({position}){
        this.velocity = {
            x:0, 
            y:0
        }

        const image = new Image();
        image.src = "./img/invader.png";
        image.onload = () =>{
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: position.x,
                y: position.y
            }
        }  
    }
    
    draw(){
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );
    }
    
    update({velocity}){
        if(this.image){
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(InvaderProjectiles){
        InvaderProjectiles.push(new InvaderProjectile({
            position: { 
                x: this.position.x + this.width / 2, 
                y: this.position.y + this.height
            },
            velocity:{
                x: 0, 
                y: 5
            },
            width: 3,
            height: 10
        }));
    }
}

//create multiple invaders at once
class Grid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity ={
            x: 3,
            y: 0
        };
        this.invaders = [];

        //random number of invaders generater in a grid
        const cols = Math.floor(Math.random() * 5 + 4);
        const rows = Math.floor(Math.random() * 3 + 2);
        this.width = cols * 30;
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                this.invaders.push(new Invader({position: {
                    x: i * 30, 
                    y: j * 30
                }}));
            }
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        //if invaders hit left or right corner, go down by 1 & go in opposite direction
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
            invaderAudio.play();
        }
    };
}


class Projectile{
    constructor({position, velocity, radius}){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }

    draw(){
        c.beginPath();

        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );

        c.fillStyle = 'red';
        c.fill();

        c.closePath();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class InvaderProjectile{
    constructor({position, velocity, width, height}){
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
    }
    draw(){
        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Particle{
    constructor({position, velocity, radius, color, fades}){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    }
    draw(){
        c.save();

        c.globalAlpha = this.opacity;

        c.beginPath();
        
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        c.fillStyle = this.color;
        c.fill();
        
        c.closePath();
        
        c.restore();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.fades){
            this.opacity -=0.01;
        } 
    }
}

//constants 
const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];
let frames = 0;//also rng (frame counter)
let randomInterval = Math.floor((Math.random() * 500) + 500);//rng
let game = {over: false, active: true };//activity flags
let score = 0;

//controls set to false to stop movement by default
const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    space:{
        pressed: false
    },
    w:{
        pressed: false
    },
    s:{
        pressed: false
    }
}

//generate stars //could be a function easily
for(i = 0; i < 150;i++){
    particles.push(new Particle({
        position: {x: Math.random() * canvas.width, y: Math.random() * canvas.height},
        velocity: { x: 0, y: 1},
        radius: Math.random() * 2,
        color: 'white',
        fades: false
    }));
}

function createParticles({object, color, fades, radius}){
    for(i = 0; i < 15;i++){
        particles.push(new Particle({
            position: {x: object.position.x + object.width / 2, y:object.position.y + object.height / 2},
            velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) *2},
            radius: radius || Math.random() * 3,
            color: color || 'red',
            fades: fades || false
        }));
    }
}

//call each frame
function animate(){
    //end function
    if(game.active == false){
        return;
    }

    //nice smooth frames
    requestAnimationFrame(animate);

    //background
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    //render player
    player.update();

    //render particles
    particles.forEach(particle => {

        //render moving stars via replacing them in random spots if out of canvas
        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = - particle.radius;
        }

        //prevent particle re-appearing
        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(particles.indexOf(particle), 1)
            },0);   
        }else{
            particle.update();
        }
    });

    //render invader projectiles
    invaderProjectiles.forEach(invaderProjectile => {
        //invader projectile garbage collection if out of screen
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(invaderProjectiles.indexOf(invaderProjectile), 1);
            }, 0);
        } else{
            invaderProjectile.update();
        }

        //player gets hit check
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width){

            //end the game
            setTimeout(() => {
                invaderProjectiles.splice(invaderProjectiles.indexOf(invaderProjectile), 1);
                player.opacity = 0;
                game.over = true;
                explosionAudio.play();
                Timer(true);
            }, 0);

            //stop the activity 
            setTimeout(() => {
                game.active = false;
                gameDisplay.hidden = true;
                gameOverScreen.hidden = false;
                loseAudio.play();
                endScoreEl.innerHTML = score;
                endTime.textContent = clock.textContent;
            }, 1000); 

            createParticles({
                object: player, color: 'yellow', fades: true, radius: Math.random()+ 5 * 2
            });
        }
    });

    //render invaders
    grids.forEach(grid => {
        grid.update();

        //random invader shoot interval 
        if(frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles);
        }

        //projectiles hit invaders
        grid.invaders.forEach(invader =>{
            invader.update({velocity: grid.velocity});

            //hitbox checks
            projectiles.forEach(projectile => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x && 
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= invader.position.y){
                                            
                        setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) =>
                             invader2 === invader
                        );
                        const projectileFound = projectiles.find((projectile2) => 
                             projectile2 === projectile
                        );
                        //remove projectile & invader
                        if(invaderFound && projectileFound){
                            //score on invader hit
                            score += 100;
                            scoreEl.innerHTML = score;

                            //particle for destroying Invader
                            createParticles({
                                object: invader, color: 'green', fades: true
                            });

                            grid.invaders.splice(grid.invaders.indexOf(invader), 1);
                            projectiles.splice(projectiles.indexOf(projectile), 1);

                            invaderkilledAudio.play();

                            //re-calculate grid size if no invaders in a col 
                            if(grid.invaders.length > 0){
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;

                                grid.position.x = firstInvader.position.x;
                            }
                            //garbage collection of grids with no invaders
                            else{
                                grids.splice(grids.indexOf(grid), 1);
                            }
                        }
                    },0);
                }
            });
        });
    });
    
    //garbage collection for player projectiles out of screen
    projectiles.forEach(projectile =>{
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(projectiles.indexOf(projectile), 1);
            }, 0);
        }
        else{
            projectile.update();
        }
    });


    //keep player in the canva & actual movement
    if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = - 5;
        player.rotation = - 0.15;
    }
    else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = + 5;
        player.rotation = + 0.15;
    }
    else{
        player.velocity.x = 0;
        player.rotation = 0;
    }
    if(keys.w.pressed && player.position.y >= 0){
        player.velocity.y = - 5;
    }
    else if(keys.s.pressed && player.position.y + player.height <= canvas.height){
        player.velocity.y = + 5;
    }
    else{
        player.velocity.y = 0;
    }

    //random time spawning new Invaders
    if(frames % randomInterval === 0){
        grids.push(new Grid());

        randomInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }

    //used for rng
    frames++;
}

//audio selection
var shootAudio = document.getElementById('shootAudio');
var explosionAudio = document.getElementById('explosionAudio');
var invaderkilledAudio = document.getElementById('invaderkilledAudio');
var invaderAudio = document.getElementById('invaderAudio');
var loseAudio = document.getElementById('loseAudio');
var startAudio = document.getElementById('startAudio');
//audio volume
shootAudio.volume = 0.2;
explosionAudio.volume = 0.2;
invaderkilledAudio.volume = 0.2;
loseAudio.volume = 0.5;
//audio speed-up
invaderkilledAudio.playbackRate = 1.5;
shootAudio.playbackRate = 1.5;
//audio keep pitch after speed-up
explosionAudio.webkitPreservesPitch = true;
invaderkilledAudio.webkitPreservesPitch = true;
shootAudio.webkitPreservesPitch = true;

//buttons
const startBtn = document.getElementById("startBtn");

//screens
const titleScreen = document.getElementById("title-screen");
const gameDisplay = document.getElementById("game");
const gameOverScreen = document.getElementById("gameOver-screen");

//start game
let start = false;
startBtn.addEventListener("click", function(event){
    event.preventDefault();
    startAudio.play();
    let start = true;
    if(start === true){
        gameDisplay.hidden = false;
        titleScreen.hidden = true;
        animate();
        Timer(false);
    }
});

//start movement
addEventListener('keydown', ({key}) =>{
    //disable controls if the game is over
    if(game.over){
        return;
    }
    switch(key){
        case 'a':
            keys.a.pressed = true; 
            break;
        case 'd':
            keys.d.pressed = true; 
            break;
        case ' ':
            //put projectile in the player's array
            projectiles.push(new Projectile({
                position:{ x: player.position.x + player.width/2, 
                y: player.position.y},
                radius:4,
                velocity:{ x:0, y:-5}
            }));
            shootAudio.play();
            break;
        case 'w':
            keys.w.pressed = true; 
            break;
        case 's':
            keys.s.pressed = true; 
            break;
    }
});

//stop movement
addEventListener('keyup', ({key}) =>{
    switch(key){
        case 'a':
            keys.a.pressed = false; 
            break;
        case 'd':
            keys.d.pressed = false; 
            break;
        case ' ':
            keys.space.pressed = false; 
            break;
        case 'w':
            keys.w.pressed = false; 
            break;
        case 's':
            keys.s.pressed = false; 
            break;
    }
});

//timer
const clock = document.getElementById("time");
function Timer(timeStop){

    let time = -1, intervalId;

    function incrementTime(){
        time++;
        clock.textContent = ("0" + Math.trunc(time / 60)).slice(-2) + ":" + ("0" + (time % 60)).slice(-2);
    }

    incrementTime();
    intervalId = setInterval(incrementTime, 1000);

    if(timeStop){
        clearInterval(intervalId);
    }
};