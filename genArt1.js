
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleArray = [];
const ongoingTouches = [];
let hue = 0;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = {
  x: null,
  y: null,
}
let mouseIsDown = false;
canvas.addEventListener('mousedown', function(e) {
  mouseIsDown = true;
});
canvas.addEventListener('mouseup', function(e) {
  mouseIsDown = false
});

canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;
  if (mouseIsDown) {
    for (let i = 0; i < 1; i++) {
      particleArray.push(new Particle());
    }
  }
  
})
/*
canvas.addEventListener('touch', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i  < 10; i++){
    particleArray.push(new Particle());
  }
})
*/

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = 'hsl(' + hue + ', 100%, 50%)';
    this.lifespan = 10000;
  }
  update() {
    this.speedX *= 0.999;
    this.speedY *= 0.999;
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) {
      this.x = 1;
      this.speedX = -1 * (this.speedX);
    }
    if (this.y < 0) {
      this.y = 1;
      this.speedY = -1 * (this.speedY);
    }
    if (this.x > canvas.width) {
      this.x = canvas.width - 1;
      this.speedX = -1 * (this.speedX);
    }
    if (this.y > canvas.height) {
      this.y = canvas.height - 1;
      this.speedY = -1 * (this.speedY);
    }
    if (this.size > 0.01) this.size -= (this.size * 0.003) ;
    this.lifespan--;
    
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
    ctx.fill();
  }
}

const newParticle = (x,y) => {
  let np = new Particle();
  np.x = x;
  np.y = y;
  return np;
};
/*
const init = function(){
  for (let i = 0; i < 100; i++) {
    particleArray.push(new Particle());
  }
}
init();
console.log(particleArray);
*/
const handleParticles = function() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
    
    for (let j = i; j < particleArray.length; j++) {
      const dx = particleArray[i].x - particleArray[j].x
      const dy = particleArray[i].y - particleArray[j].y
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 50 + (particleArray[j].size + particleArray[i].size)) {
        let splitChance = Math.random();
        ctx.beginPath();
        ctx.strokeStyle = particleArray[i].color;
        ctx.lineWidth = particleArray[i].size / 10;
        ctx.moveTo(particleArray[i].x, particleArray[i].y);
        ctx.lineTo(particleArray[j].x, particleArray[j].y);
        ctx.stroke();
        let attraction = (distance - (distance * 0.9995)) + (particleArray[i].size + particleArray[j].size) * 0.001;
        if (dx < 0) {
          particleArray[i].speedX += attraction;
        } else {
          particleArray[i].speedX -= attraction;
        }
        if (dy < 0) {
          particleArray[i].speedY += attraction;
        } else {
          particleArray[i].speedY -= attraction;
        }
        if (splitChance > 0.9) {
          //particleArray.push(newParticle(particleArray[i].x,particleArray[i].y));
          particleArray[i].size += 0.01;
          particleArray[j].size += 0.01;
        }
      }
    }
    if (particleArray[i].size <= 2 || particleArray[i].lifespan <= 0) {
      particleArray.splice(i,1);
      i--;
    }
  }
};

const animate = function() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  //ctx.fillStyle = 'rgba(0,0,0,0.05)';
  //ctx.fillRect(0,0,canvas.width,canvas.height);
  handleParticles();
  hue += 0.5;
  requestAnimationFrame(animate);
};



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