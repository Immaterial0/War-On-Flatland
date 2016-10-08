var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var w = canvas.width;
var h = canvas.height;
var score = 0;
var invuntimer = function() {
  player1.invun = 0;
  clearTimeout(invuntimer1);
}

function floor() {
  this.color = 'white';
  this.linewidth = 15;
  this.draw = function() {
    c.beginPath();
    c.save(0);
    c.strokeStyle = this.color;
    c.moveTo(w, h);
    c.lineTo(0, h);
    c.lineTo(0, 0);
    c.lineTo(w, 0);
    c.lineTo(w, h);
    c.lineWidth = this.linewidth;
    c.stroke();
    c.restore();
  };
}

var floor1 = new floor();
var focuseffecttimer;
var invuntimer1;

function player() {
  this.x = 300;
  this.y = 400;
  this.r = 25;
  this.vy = 0;
  this.vx = 0;
  this.move = 16;
  this.color = 'white';
  this.waittime = false;
  this.health = 46;
  this.shield = true;
  this.shield1 = 'green';
  this.shield2 = 'red';
  this.va = 0.09;
  this.angle = 0;
  this.orbangle = -0.07;
  this.shieldsize = 3;
  this.healthmax = 100;
  this.orbsize = 5;
  this.orbva = -0.07;
  this.orbangle = 0;
  this.focus = 'red';
  this.orbs = ['green', 'blue', 'green']
  this.spelltimer = 0;
  this.spellrefresh = 0.05;
  this.defense = 0;
  this.regen = 0;
  this.projectilespeed = 1;
  this.invun = 0;
  this.beamactive = false;
  this.focusreset = function() {
    this.r = 20;
    this.move = 11;
    this.defense = 0;
    this.regen = 0;
    this.projectilespeed = 1;
  }
  this.focuseffect = function() {
    clearTimeout(focuseffecttimer);
    if (this.focus == 'red') {
      this.move = 16;
      this.r = 25;
    } else if (this.focus == 'blue') {
      this.r = 8;
    } else if (this.focus == 'green') {
      this.regen = 0.2;
    } else if (this.focus == 'white') {
      this.projectilespeed = 1.8;

    } else if (this.focus == 'purple') {
      this.defense = 25;
    }
  }
  this.draw = function() {
    if (this.health <= 100) {
      this.health += this.regen;
    }

    score += 1 / 20;
    if (Math.abs(this.vx) > 0 && Math.abs(this.vy) > 0) {
      var signx = Math.sign(this.vx);
      var signy = Math.sign(this.vy);

      this.vx = this.move * signx / Math.sqrt(2);;
      this.vy = this.move * signy / Math.sqrt(2);;
    }
    if (this.beamactive == false){
    this.x += this.vx;
    this.y += this.vy;}
    else if (this.focus == 'white'){
       this.x += this.vx * 0.4;
    this.y += this.vy * 0.4;
    }
    if (this.x > w - this.r - floor1.linewidth / 2) {
      this.x = w - this.r - floor1.linewidth / 2;
    } else if (this.x < 0 + this.r + floor1.linewidth / 2) {
      this.x = 0 + this.r + floor1.linewidth / 2
    }
    if (this.y > h - this.r - floor1.linewidth / 2) {
      this.y = h - this.r - floor1.linewidth / 2;
    } else if (this.y < 0 + this.r + floor1.linewidth / 2) {
      this.y = 0 + this.r + floor1.linewidth / 2
    }
    c.save()
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
    c.restore();
    c.save()
    c.beginPath();
    c.fillStyle = this.focus;
    c.strokeStyle = this.color;
    c.arc(this.x, this.y, this.r / 3, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
    c.restore();
    if (this.shield == true) {
      if (this.color == 'purple') {
        this.shieldsize = 9;
      }
      c.save();
      c.translate(this.x, this.y);
      for (i = 0; i < 3; i++) {
        c.save();
        c.rotate(2 / 3 * Math.PI * i + this.orbangle);
        c.translate(0, this.r * 2);
        c.beginPath();
        c.fillStyle = this.orbs[i];
        c.arc(0, 0, this.orbsize, 0, 2 * Math.PI);
        c.fill();
        c.stroke();
        if (i == 2) {
          c.save();
          c.beginPath();
          c.lineWidth = 2;
          c.strokeStyle = 'yellow';
          c.arc(0, 0, this.orbsize + 1, 0, 2 * Math.PI * this.spelltimer);
          c.stroke();
          c.restore();
          if (this.spelltimer < 1) {
            this.spelltimer += this.spellrefresh;
          }
        }
        c.restore();

      }
      c.rotate(this.angle);
      c.beginPath();
      c.strokeStyle = this.shield1;
      c.lineWidth = this.shieldsize;
      c.arc(0, 0, this.r * 1.5, 0, 6.5 / 7 * Math.PI * this.health / this.healthmax);
      c.stroke();
      c.strokeStyle = this.shield2;
      c.beginPath();
      c.arc(0, 0, this.r * 1.5, Math.PI, Math.PI + 6.5 / 7 * Math.PI * this.health / this.healthmax);
      c.stroke();
      c.restore();
      this.angle += this.va;
      this.shieldsize = 3;
      this.orbangle += this.orbva;
    }

  };
}

var player1 = new player();
var colormatrix = {
  blue: [0, 0, 255],
  red: [255, 0, 0],
  green: [0, 255, 0],
  white: [255, 255, 255],
  purple: [160, 32, 240]

}

function mine(caster) {
  this.x = mouse.x;
  this.y = mouse.y;
  this.color1 = caster.orbs[0];
  this.color2 = caster.orbs[1];
  this.size = 12;
  this.linewidth = 6;
  this.randomangle = Math.random() * 2 * Math.PI;
  this.timer = 80;
  this.opacity = 1;
  this.draw = function() {
    if (this.timer > 20 || Math.random() > 0.5) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.randomangle);
    c.beginPath();
    c.moveTo(0, 0);
    c.lineWidth = this.linewidth;
    c.fillStyle = this.color1;
    c.strokeStyle = this.color2;
    c.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    c.rotate(Math.PI / 4);
    c.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    c.stroke();
    c.fill();
    c.restore();
    this.timer -= 1;
  };
}}


function projectiles(caster){
  this.init = function() {
  this.x = 0;
  this.y = 0;
    this.diffx = mouse.x - this.xstart;
  this.diffy = mouse.y - this.ystart;
  this.angle = Math.abs(Math.atan2(this.diffy, this.diffx));
  this.vx = Math.abs(Math.cos(this.angle)) * Math.sign(this.diffx) * this.move * this.projspeed;

  this.vy = Math.abs(Math.sin(this.angle)) * Math.sign(this.diffy) * this.move * this.projspeed;}

  this.damage = function() {
    for (i = 0; i < shapes1.shapesactive.length; i++) {
      this.enemydistx = Math.abs((this.xstart + this.x) - shapes1.shapesactive[i].x);
      this.enemydisty = Math.abs((this.ystart + this.y) - shapes1.shapesactive[i].y);

      if (this.enemydistx < 20 && this.enemydisty < 20) {
        shapes1.shapesactive[i].colorclear();
        shapes1.shapesactive[i].health -= 30;
        this.timer = 0;
        shapes1.shapesactive[i][this.color1] = 0.2;
        shapes1.shapesactive[i].color1 = this.color1;
        shapes1.shapesactive[i][this.color2] = 0.2;
        shapes1.shapesactive[i].color2 = this.color2;
        clearTimeout(shapes1.shapesactive[i].timeout);
        shapes1.shapesactive[i].timeout = setTimeout($.proxy(shapes1.shapesactive[i].colorclear, shapes1.shapesactive[i]), shapes1.shapesactive[i].cleartimer);
      }
    }
  }  
}

fireballs.prototype = new projectiles();

function fireballs(caster) {

  this.xstart = caster.x;
  this.ystart = caster.y;
  this.color1 = caster.orbs[0];
  this.color2 = caster.orbs[1];
  this.projspeed = caster.projectilespeed;
  this.r = 8;
  this.linewidth = 6;
  this.timer = 26;
  this.move = 17;
      this.init();

  this.draw = function() {
    c.save();
    c.translate(this.xstart, this.ystart);
    c.moveTo(0, 0);
    c.lineWidth = this.linewidth;
    c.fillStyle = this.color1;
    c.strokeStyle = this.color2;
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.stroke();
    c.fill();
    c.restore();
    this.timer -= 1;
    this.x += this.vx;
    this.y += this.vy
    this.damage();
  };

}

bouncestar.prototype = new projectiles();

function bouncestar(caster) {
 this.xstart = caster.x;
  this.ystart = caster.y;
  this.color1 = caster.orbs[0];
  this.color2 = caster.orbs[1];
  this.projspeed = caster.projectilespeed;

  this.r = 5;
  this.linewidth = 6;
  this.timer = 200;
  this.move = 22;
  this.init();
  this.x = 0;
  this.y = 0;
  this.bounce = function() {
    
    this.totalx = this.x + this.xstart;
    this.totaly = this.y + this.ystart;
    
    if (this.totalx < 0) {
      this.x -= this.totalx;
      this.vx = -this.vx;
    }
    else if (this.totalx > w) {
      this.x -= this.totalx -w;
      this.vx = -this.vx;
    }
     if (this.totaly < 0) {
      this.y -= this.totaly;
      this.vy = -this.vy;
        
      }

      else if (this.totaly > h){
        this.y -= this.totaly - h;
        this.vy = -this.vy;
         }
    }
    
  
  this.draw = function() {
    c.save();
    c.translate(this.xstart, this.ystart);
    c.moveTo(0, 0);
    c.lineWidth = this.linewidth;
    c.fillStyle = this.color1;
    c.strokeStyle = this.color2;
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.stroke();
    c.fill();
    c.restore();
    this.timer -= 1;
    this.x += this.vx;
    this.y += this.vy;
 
    this.bounce();
    this.damage();
  };}

function beam(caster) {
  this.timer = 100;
  this.timermax = 100;
  this.beamlength = 350;
  this.color1 = caster.orbs[0];
  this.color2 = caster.orbs[1];
  this.gradient = function() {
    var grad = c.createLinearGradient(this.beamlength * Math.cos(this.xy), this.beamlength * Math.sin(this.xy), 0, 0);
    this.currenttime = this.timermax - this.timer;
    for (var i = 30; i > 0; i--) {

      var r = Math.floor(Math.max(colormatrix[this.color1][0] * Math.max((Math.sin(0.3 * (i + this.currenttime)) + 0.3), 0), Math.max(colormatrix[this.color2][0] * (Math.sin(0.3 * (i + this.currenttime) + Math.PI) + 0.3), 0)));

      var b = Math.floor(Math.max(colormatrix[this.color1][2] * Math.max((Math.sin(0.3 * (i + this.currenttime)) + 0.3), 0), Math.max(colormatrix[this.color2][2] * (Math.sin(0.3 * (i + this.currenttime) + Math.PI) + 0.3), 0)));

     var g = Math.floor(Math.max(colormatrix[this.color1][1] * Math.max((Math.sin(0.3 * (i + this.currenttime)) + 0.3), 0), Math.max(colormatrix[this.color2][1] * (Math.sin(0.3 * (i + this.currenttime) + Math.PI) + 0.3), 0)));

      grad.addColorStop(1 / 30 * i, "rgb(" + r + "," + g + "," + b + ")");

    }
    return grad;
  }
  this.draw = function() {
    if (player1.beamactive == true) {
      this.diffx = mouse.x - player1.x;
      this.diffy = mouse.y - player1.y;
      this.xy = Math.atan2(this.diffy, this.diffx);
      c.save();
      c.translate(player1.x, player1.y);
      c.beginPath();
      c.lineCap = 'round';
      c.moveTo(0, 0);
      c.lineWidth = 10;
      c.strokeStyle = this.gradient();
      c.lineTo(this.beamlength * Math.cos(this.xy), this.beamlength * Math.sin(this.xy));
      c.stroke();
      c.restore();
      this.timer -= 1;
    } else if (player1.beamactive == false) {
      this.timer = 0;

    }

  }
}

function spells() {
  this.spellsactive = [];
  this.draw = function() {
    for (var i = 0; i < this.spellsactive.length; i++) {
      if (this.spellsactive[i].timer > 0) {
        this.spellsactive[i].draw();

      }
    }}

    for (var j = 0; j < this.spellsactive.length; j++) {
      if (this.spellsactive[j].timer <= 0) {
        this.spellsactive.splice(j, 1);
      }

    }
  }


var spells1 = new spells();



function enemy() {
  this.x = 0;
  this.y = 0;
  this.linewidth = 5;
  this.size = 30;
  this.vx = 0;
  this.vy = 0;
  this.color1 = 'gray';
  this.color2 = 'black';
  this.green = 1;
  this.blue = 0;
  this.cleartimer = 6000;
  this.timeout = 0;
  this.attack = 1;
  this.speed = 0.2
  this.health = 100;
  this.healthmax = 100;
  this.colorclear = function() {
    this.green = 1;
    this.blue = 0;
    this.color1 = 'gray';
    this.color2 = 'black';
    clearTimeout(shapes1.shapesactive[i].timeout);
  }
  this.init = function() {
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        this.x = -100;
      } else {
        this.x = w + 100;
      }
      this.y = Math.random() * h + 100;
    } else {
      this.x = Math.random() * w + 100;
      if (Math.random() < 0.5) {
        this.y = -100;
      } else {
        this.y = h + 100;
      }
    }
  }
  this.seek = function() {
    this.diffx = this.x - player1.x;
    this.diffy = this.y - player1.y;
    this.angle = Math.abs(Math.atan2(this.diffy, this.diffx));
    this.disttoplayer = Math.sqrt(this.diffx * this.diffx + this.diffy * this.diffy);
  }

}

function shapes() {
  this.shapesactive = [];
  this.draw = function() {

    for (i = 0; i < this.shapesactive.length; i++) {
      if (this.shapesactive[i].health > 0) {
        this.shapesactive[i].draw();
      }
    }
    for (i = 0; i < this.shapesactive.length; i++) {
      if (this.shapesactive[i].health <= 0) {
        this.shapesactive.splice(i, 1);
      }

    }
  
if (this.shapesactive.length < 5){
  this.shapesactive.push(new triangle());
}
  }
  
}

var shapes1 = new shapes();

triangle.prototype = new enemy();
square.prototype = new enemy();

function triangle() {

  this.pointyness = (Math.random() + 1);
  this.speedmax = 8 * (Math.random() + 2) / 3;
  this.currentangle = 0;

  this.init();

  this.draw = function() {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(Math.atan2(this.diffy, this.diffx) + Math.PI / 2);
    c.lineWidth = 6 * this.health / this.healthmax;
    c.strokeStyle = this.color1;
    c.beginPath();
    c.fillStyle = this.color2;
    c.moveTo(0, this.size * this.pointyness);
    c.lineTo(this.size / 2, 0);
    c.lineTo(-this.size / 2, 0);
    c.lineTo(0, this.size * this.pointyness);
    c.lineTo(this.size / 2, 0);
    c.fill();
    c.stroke();
    c.restore();

    if (this.attack == 1) {
      this.seek();

      this.vx = Math.min(this.speedmax * Math.abs(Math.cos(this.angle)), Math.abs(this.vx)) * Math.sign(this.vx);
      this.vy = Math.min(this.speedmax * Math.abs(Math.sin(this.angle)), Math.abs(this.vy)) * Math.sign(this.vy);
      this.vx -= Math.abs(Math.cos(this.angle)) * Math.sign(this.diffx) * this.speed;
      this.vy -= Math.abs(Math.sin(this.angle)) * Math.sign(this.diffy) * this.speed;

      this.x += this.vx * this.green;
      this.y += this.vy * this.green;
      this.blue = 0;
    }

    // Determines if point is near player and deals damage if so
    // calls function invun timer that resets players inbun state to 0
    if (this.disttoplayer - this.size < player1.r * 2.7 && player1.invun == 0) {
      player1.health -= 10 * this.pointyness;
      player1.invun = 1;
      invuntimer1 = setTimeout(invuntimer, 1500);
    }

  };
}
function square() {
  this.init();
  this.draw = function() {
    c.save();
    c.strokeStyle = this.color1;
    c.lineWidth = this.linewidth;
    c.strokeRect(this.x, this.y, this.size * 1.5, this.size * 1.5);
    if (this.x + 400 < 0) {
      this.vx += this.speed;
    } else if (this.x > w) {
      this.vx -= this.speed;
    }
    this.x += this.vx;
    if (this.y < 0) {
      this.vy += this.speed;
    } else if (this.y > w) {
      this.vy -= this.speed;
    }
    this.y += this.vy;
    c.restore();

  }

}
shapes1.shapesactive.push(new square());


var mouse = {
  x: 0,
  y: 0
};
canvas.contentEditable = true;
canvas.onmousemove = function(evt) {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
  };
canvas.onkeydown = function(evt) {
  if (evt.keyCode == 38 || evt.keyCode == 87) {
    player1.vy = -player1.move;
    evt.preventDefault();
  }
  if (evt.keyCode == 37 || evt.keyCode == 65) {
    player1.vx = -player1.move;
    evt.preventDefault();
  }
  if (evt.keyCode == 39 || evt.keyCode == 68) {
    player1.vx = player1.move;
    evt.preventDefault();
  }
  if (evt.keyCode == 40 || evt.keyCode == 83) {
    player1.vy = player1.move;
    evt.preventDefault();
  }
  if (evt.keyCode == 32) {
   if (!gamestart) {
     game();
     gamestart = true;
     
   }
    if (player1.vy == 0 && player1.vx == 0) {
      if (player1.waittime != true) {
        player1.color = 'purple';
        clearTimeout(x2);
        x2 = setTimeout(jumpwait, jumptimer);
        player1.waittime = true;
        return;
      }
    }
    if (player1.waittime != true) {
      if (Math.abs(player1.vx) > 0 && Math.abs(player1.vy) > 0) {
        var jump = Math.sqrt(player1.move * player1.move / 2);
        player1.x += 20 * Math.sign(player1.vx) * jump;
        player1.y += 20 * Math.sign(player1.vy) * jump;

      } else {
        player1.x += 20 * player1.vx;
        player1.y += 20 * player1.vy;
      }

      clearTimeout(x2);
      x2 = setTimeout(jumpwait, jumptimer);
      player1.waittime = true;
      player1.color = 'red';

    }
  }
  if (evt.keyCode == 69) {
    player1.orbs.push('green');
    if (player1.orbs.length > 3) {
      player1.orbs.shift();
    }
  }
  if (evt.keyCode == 81) {
    player1.orbs.push('blue');
    if (player1.orbs.length > 3) {
      player1.orbs.shift();
    }
  }
  if (evt.keyCode == 49) {
    player1.orbs.push('red');
    if (player1.orbs.length > 3) {
      player1.orbs.shift();
    }
  }
  if (evt.keyCode == 50) {
    player1.orbs.push('purple');
    if (player1.orbs.length > 3) {
      player1.orbs.shift();
    }
  }
  if (evt.keyCode == 51) {
    player1.orbs.push('white');
    if (player1.orbs.length > 3) {
      player1.orbs.shift();
    }
  }
  if (evt.keyCode == 82) {
    player1.shield1 = player1.orbs[0];
    player1.shield2 = player1.orbs[1];
    player1.focus = player1.orbs[2];
    player1.focusreset();
    player1.focuseffect();
  }
}
c.canvas.onkeyup = function(evt) {
  if (evt.keyCode == 38 || evt.keyCode == 40 || evt.keyCode == 87 || evt.keyCode == 83) {
    player1.vy = 0;

  }
  if (evt.keyCode == 37 || evt.keyCode == 39 || evt.keyCode == 68 || evt.keyCode == 65) {
    player1.vx = 0;

  }
}
c.canvas.onmousedown = function(evt) {
    if (player1.spelltimer >= 1) {

      if (player1.orbs[2] == 'white') {
        spells1.spellsactive.push(new mine( player1));
        player1.spelltimer = 0;
      }
      if (player1.orbs[2] == 'red') {
        spells1.spellsactive.push(new fireballs(player1));
        player1.spelltimer = 0;
      }
      if (player1.orbs[2] == 'purple') {
        spells1.spellsactive.push(new beam(player1));
        player1.spelltimer = 0;
        player1.beamactive = true;
      }
          if (player1.orbs[2] == 'green') {
        spells1.spellsactive.push(new bouncestar(player1));
        player1.spelltimer = 0;
      }
    }
  }
c.canvas.onmouseup = function(evt) {
  player1.beamactive = false;

}

function jumpwait() {
  player1.color = 'white'
  clearTimeout(x2);
  player1.waittime = false;

}

function testing() {
  c.save();
  c.font = '20pt sans-serif';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.fillStyle = 'white';
  // c.fillText(' : ' + Math.floor(score), w * 0.8, 20);
  c.fillText('Move with WASD. Change orb colors using keyboard keys' , 0, 20);
    c.fillText('Red : 1' , 0, 50);
      c.fillText('Purple : 2' , 0, 80);
    c.fillText('White : 3' , 0, 110);
    c.fillText('Blue : Q' , 0, 140);
    c.fillText('Green: E' , 0, 170);
    c.textAlign = 'right';

      c.fillText('Fireball' , w, 50);
      c.fillText('Beam (no damage yet)' , w, 80);
    c.fillText('Mine (no damage yet)' , w, 110);
    c.fillText('No graphic yet' , w, 140);
    c.fillText('Bounce Star' , w, 170);
    c.textAlign = 'left';

    c.fillText('Key orb is highlighted in yellow and determines type of spell cast' , 0, 200);
   c.fillText('as well as focus. Secondary orbs determine spell damage type' , 0, 230);
   c.fillText('and shield defense on self cast.' , 0, 260);
   c.fillText('R : change focus and shields' , 0, 310);
      c.fillText('Red Focus : increased size and speed' , 0, 340);
      c.fillText('Purple Focus : Increased defense' , 0, 370);
    c.fillText('White Focus : Improved spells' , 0, 400);
    c.fillText('Blue Focus : Decreased size' , 0, 430);
    c.fillText('Green Focus : Regeneration' , 0, 460);
    c.fillText('Space : Teleport if moving, defensive stance if stationary' , 0, 500);
   c.fillText('Mouse click : Cast spells' , 0, 530);
    c.textAlign = 'center';
  c.font = '30pt sans-serif';

   c.fillText('Press space to start' , w * 0.4, 600);
  c.restore();
}

var x2;
var jumptimer = 4000;
var x1;
var timer = 50;

function game() {
  c.clearRect(0, 0, w, h);
  spells1.draw();

  player1.draw();
  clearTimeout(x1);
  x1 = setTimeout(game, timer);
  shapes1.draw();
  floor1.draw();

}
testing();
var gamestart = false;
