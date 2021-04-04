
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleArray = [];
const ongoingTouches = [];

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = {
  x: null,
  y: null,
}

canvas.addEventListener('click', function(e){
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i  < 10; i++){
    particleArray.push(new Particle());
  }
})

canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i  < 10; i++){
    particleArray.push(new Particle());
  }
})
canvas.addEventListener('touch', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i  < 10; i++){
    particleArray.push(new Particle());
  }
})

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    //this.x = Math.random() * canvas.width
    //this.y = Math.random() * canvas.height
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;

  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.05;
  }
  draw() {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
    ctx.fill();
  }
}

const init = function(){
  for (let i = 0; i < 100; i++) {
    particleArray.push(new Particle());
  }
}
init();
console.log(particleArray);

const handleParticles = function() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
    if (particleArray[i].size <= 0.3) {
      particleArray.splice(i,1);
    }
  }
}

const animate = function() {
  //ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  handleParticles();
  requestAnimationFrame(animate);
}



//--------------------------------------------------------------
//touch handling
//--------------------------------------------------------------
function startup() {
  canvas.addEventListener("touchstart", handleStart, false);
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchcancel", handleCancel, false);
  canvas.addEventListener("touchmove", handleMove, false);
}

document.addEventListener("DOMContentLoaded", startup);

function handleStart(evt) {
  evt.preventDefault();
  console.log("touchstart.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    console.log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));
    mouse.x = touches[i].pageX;
    mouse.y = touches[i].pageY;
    for (let i = 0; i  < 10; i++){
      particleArray.push(new Particle());
    }
    console.log("touchstart:" + i + ".");
  }
}
function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      console.log("continuing touch "+idx);

      mouse.x = touches[i].pageX;
      mouse.y = touches[i].pageY;
      for (let i = 0; i  < 10; i++){
        particleArray.push(new Particle());
      }

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}
function handleEnd(evt) {
  evt.preventDefault();
  log("touchend");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
}
function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

//-------------------------------------------------------------

animate();