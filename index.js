const canvas = document.querySelector("canvas");
const scoreEl = document.querySelector("#scoreEl");
const c = canvas.getContext("2d");

// const resizeCanvas = (e) => {
canvas.width = 1024;
canvas.height = 576;
// };

// document.addEventListener('resize', resizeCanvas());

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.fades){
      this.opacity -= 0.01;
    }
  }
}

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.opacity = 1;

    const image = new Image();
    image.src = "./img/spaceship2.png";
    image.onload = () => {
      const scale = 0.4;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 30,
      };
    };
  }

  draw() {
    /*  c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height); */
    if (this.image) {
      c.save();
      c.globalAlpha = this.opacity;
      c.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
      );

      c.rotate(this.rotation);

      c.translate(
        -player.position.x - player.width / 2,
        -player.position.y - player.height / 2
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
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "#5cff56";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    /*  c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height); */
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 4,
        },
      })
    );
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 2,
      y: 0,
    };

    this.invaders = [];
    const rows = Math.floor(Math.random() * 5 + 2);
    const columns = Math.floor(Math.random() * 10 + 5);

    this.width = columns * 38;
    for (let i = 0; i < columns; i++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: i * 38,
              y: y * 28,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 28;
    }
  }
}

const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

const speed = 5;
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

player.draw();

let frames = 0;
let game = {
  over: false,
  active: true,
};
let randomInterval = Math.floor(Math.random() * 500 + 700);
let score = 0;


for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.4,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}


function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: color || "#127a35",
        fades: fades
      })
    );
  }
}

function animate() {
  if(!game.active)return;
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  particles.forEach((particle, i) => {

    if(particle.position.y - particle.radius >= canvas.height){
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else invaderProjectile.update();

    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);

      
      setTimeout(() => {
        game.active = false;
      }, 2000);
      console.log("You ded");
       createParticles({ object: player, color: "#9cc9e0", fades: true });
    }
  });

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
    projectile.update();
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();

    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, invaderIndex) => {
      invader.update({ velocity: grid.velocity });

      //* projectiles invader collision detection
      projectiles.forEach((projectile, projectileIndex) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );

            //* remove invader and projectile
            if (invaderFound && projectileFound) {
              score += 100;
              scoreEl.innerHTML = score;
              createParticles({ object: invader, fades: true });
              grid.invaders.splice(invaderIndex, 1);
              projectiles.splice(projectileIndex, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  if ((keys.a.pressed || keys.arrowLeft.pressed) && player.position.x >= 0) {
    player.velocity.x = -speed;
    player.rotation = -0.085;
  } else if (
    (keys.d.pressed || keys.arrowRight.pressed) &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = speed;
    player.rotation = 0.085;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 700 + 1200);
    frames = 0;
    
    console.log(randomInterval);
  }

  // console.log(frames);
  frames++;
}

animate();

addEventListener("keydown", ({ key }) => {
  if(game.over) return

  switch (key) {
    case "a":
      //   console.log("left");
      keys.a.pressed = true;
      break;
    case "ArrowLeft":
      //   console.log("left");
      keys.arrowLeft.pressed = true;
      break;
    case "d":
      //   console.log("right");
      keys.d.pressed = true;
      break;
    case "ArrowRight":
      //   console.log("right");
      keys.arrowRight.pressed = true;
      break;
    case " ":
      //   console.log("Shoot");
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2 + 1,
            y: player.position.y + 22,
          },
          velocity: {
            x: 0,
            y: -8,
          },
        })
      );
      keys.space.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
});
