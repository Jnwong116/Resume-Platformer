class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformBlocks,
    imageSrc,
    framerate,
    scale = 0.3,
    animations,
  }) {
    super({ imageSrc, framerate, scale });

    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.platformBlocks = platformBlocks;

    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };

    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }

    this.cameraBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  switchSprite(animation) {
    if (this.image === this.animations[animation].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[animation].image;
    this.frameBuffer = this.animations[animation].frameBuffer;
    this.framerate = this.animations[animation].framerate;
  }

  updateCameraBox() {
    this.cameraBox.position.x = this.position.x - 75;
    this.cameraBox.position.y = this.position.y - 10;
  }

  panCameraHorizontal(canvas, camera) {
    const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
    const cameraBoxLeft = this.cameraBox.position.x;

    if (cameraBoxRight >= 576 || cameraBoxLeft <= 0) return;

    if (
      cameraBoxRight >= canvas.width / 4 + Math.abs(camera.position.x) &&
      this.lastDirection == "right"
    ) {
      camera.position.x -= this.velocity.x; // Moves to the right
    }

    if (
      cameraBoxLeft <= Math.abs(camera.position.x) &&
      this.lastDirection == "left"
    ) {
      camera.position.x -= this.velocity.x; // Moves to the left
    }
  }

  panCameraVertical(canvas, camera) {
    if (
      this.cameraBox.position.y + this.velocity.y <= 0 ||
      this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= 432
    )
      return;

    if (
      this.cameraBox.position.y <= Math.abs(camera.position.y) &&
      this.velocity.y < 0
    ) {
      camera.position.y -= this.velocity.y; // Moves up
    }

    if (
      this.cameraBox.position.y + this.cameraBox.height >=
        Math.abs(camera.position.y) + canvas.height / 4 &&
      this.velocity.y > 0
    ) {
      camera.position.y -= this.velocity.y; // Moves down
    }
  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCameraBox();

    // Draws out image
    // c.fillStyle = "rgba(0, 255, 0, 0.5)";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Draws out hitbox
    c.fillStyle = "rgba(0, 255, 0, 0.2)";
    c.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    );

    // Draws out camera box
    c.fillStyle = "rgba(0, 0, 255, 0.2)";
    c.fillRect(
      this.cameraBox.position.x,
      this.cameraBox.position.y,
      this.cameraBox.width,
      this.cameraBox.height
    );

    this.draw();

    this.position.x += this.velocity.x;

    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 15,
        y: this.position.y + 15.5,
      },
      width: 8,
      height: 23,
    };
  }

  applyGravity() {
    this.velocity.y += GRAVITY;
    this.position.y += this.velocity.y;
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (collision({ object1: this.hitbox, object2: collisionBlock })) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  checkForVerticalCollisions() {
    // Checks for collision blocks
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (collision({ object1: this.hitbox, object2: collisionBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // Checks for platform blocks
    for (let i = 0; i < this.platformBlocks.length; i++) {
      const platformBlock = this.platformBlocks[i];

      if (platformCollision({ object1: this.hitbox, object2: platformBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
