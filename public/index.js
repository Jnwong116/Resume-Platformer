const log = console.log;

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const world1 = new World({
  scale: 4,
  floorCollisions: world1FloorCollisions,
  platformCollisions: world1PlatformCollisions,
  background: "./assets/background.png",
});

let currentWorld = world1;

const scaledCanvas = {
  width: canvas.width / currentWorld.scale,
  height: canvas.height / currentWorld.scale,
};

const collisionBlocks = currentWorld.createCollisionBlocks();
const platformBlocks = currentWorld.createPlatformBlocks();

const GRAVITY = 0.15;

const p1 = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformBlocks,
  imageSrc: "./assets/jordan/Idle.png",
  hitbox: {
    position: {
      x: 15,
      y: 15.5,
    },
    width: 8,
    height: 23,
  },
  framerate: 6,
  animations: {
    Idle: {
      imageSrc: "./assets/jordan/Idle.png",
      framerate: 6,
      frameBuffer: 8,
    },
    IdleLeft: {
      imageSrc: "./assets/jordan/IdleLeft.png",
      framerate: 6,
      frameBuffer: 8,
    },
    Run: {
      imageSrc: "./assets/jordan/Run.png",
      framerate: 8,
      frameBuffer: 10,
    },
    RunLeft: {
      imageSrc: "./assets/jordan/RunLeft.png",
      framerate: 8,
      frameBuffer: 10,
    },
    Jump: {
      imageSrc: "./assets/jordan/Jump.png",
      framerate: 11,
      frameBuffer: 11,
    },
    JumpLeft: {
      imageSrc: "./assets/jordan/JumpLeft.png",
      framerate: 11,
      frameBuffer: 11,
    },
  },
});

const p2 = new Player({
  position: {
    x: 150,
    y: 300,
  },
  collisionBlocks,
  platformBlocks,
  imageSrc: "./assets/cicy/Idle.png",
  hitbox: {
    position: {
      x: 15,
      y: 17.5,
    },
    width: 8,
    height: 21,
  },
  framerate: 5,
  animations: {
    Idle: {
      imageSrc: "./assets/cicy/Idle.png",
      framerate: 5,
      frameBuffer: 10,
    },
    IdleLeft: {
      imageSrc: "./assets/cicy/IdleLeft.png",
      framerate: 5,
      frameBuffer: 10,
    },
    Run: {
      imageSrc: "./assets/cicy/Run.png",
      framerate: 8,
      frameBuffer: 10,
    },
    RunLeft: {
      imageSrc: "./assets/cicy/RunLeft.png",
      framerate: 8,
      frameBuffer: 10,
    },
    Jump: {
      imageSrc: "./assets/cicy/Jump.png",
      framerate: 8,
      frameBuffer: 8,
    },
    JumpLeft: {
      imageSrc: "./assets/cicy/JumpLeft.png",
      framerate: 8,
      frameBuffer: 8,
    },
  },
});

const players = [p1, p2];

const background = currentWorld.background;

const backgroundImageHeight = 432;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
};

const animate = () => {
  window.requestAnimationFrame(animate);

  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(currentWorld.scale, currentWorld.scale);
  c.translate(camera.position.x, camera.position.y);
  background.update();
  collisionBlocks.forEach((block) => block.update());
  platformBlocks.forEach((block) => block.update());

  players.forEach((player) => {
    player.checkForHorizontalCanvasCollision(player === p1 ? p2 : p1);
    player.update();
    player.velocity.x = 0;

    if (player.velocity.y !== 0) {
      player.panCameraVertical(canvas, camera, player === p1 ? p2 : p1);
      if (player.lastDirection === "right") player.switchSprite("Jump");
      else player.switchSprite("JumpLeft");
    }
  });

  if (keys.d.pressed) {
    p1.velocity.x = 2.5;
    p1.lastDirection = "right";
    p1.panCameraHorizontal(canvas, camera, p2);
    if (p1.velocity.y !== 0) {
      p1.panCameraVertical(canvas, camera, p2);
      p1.switchSprite("Jump");
    } else p1.switchSprite("Run");
  } else if (keys.a.pressed) {
    p1.velocity.x = -2.5;
    p1.lastDirection = "left";
    p1.panCameraHorizontal(canvas, camera, p2);
    if (p1.velocity.y !== 0) {
      p1.panCameraVertical(canvas, camera, p2);
      p1.switchSprite("JumpLeft");
    } else p1.switchSprite("RunLeft");
  } else if (p1.velocity.y === 0) {
    if (p1.lastDirection === "right") p1.switchSprite("Idle");
    else p1.switchSprite("IdleLeft");
  }

  if (keys.ArrowRight.pressed) {
    p2.velocity.x = 2.5;
    p2.lastDirection = "right";
    p2.panCameraHorizontal(canvas, camera, p1);
    if (p2.velocity.y !== 0) {
      p2.panCameraVertical(canvas, camera, p1);
      p2.switchSprite("Jump");
    } else p2.switchSprite("Run");
  } else if (keys.ArrowLeft.pressed) {
    p2.velocity.x = -2.5;
    p2.lastDirection = "left";
    p2.panCameraHorizontal(canvas, camera, p1);
    if (p2.velocity.y !== 0) {
      p2.panCameraVertical(canvas, camera, p1);
      p2.switchSprite("JumpLeft");
    } else p2.switchSprite("RunLeft");
  } else if (p2.velocity.y === 0) {
    if (p2.lastDirection === "right") p2.switchSprite("Idle");
    else p2.switchSprite("IdleLeft");
  }

  c.restore();
};

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      break;

    case "a":
      keys.a.pressed = true;
      break;

    case "w":
      p1.velocity.y = -5;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowUp":
      p2.velocity.y = -5;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
