class World {
  constructor({ scale, floorCollisions, platformCollisions, background }) {
    this.scale = scale;
    this.floorCollisions = floorCollisions;
    this.platformCollisions = platformCollisions;
    this.background = new Sprite({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: background,
    });
  }

  createCollisionBlocks() {
    const floorCollisions2D = [];
    for (let i = 0; i < this.floorCollisions.length; i += 36) {
      floorCollisions2D.push(this.floorCollisions.slice(i, i + 36));
    }

    const collisionBlocks = [];

    floorCollisions2D.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == 202) {
          collisionBlocks.push(
            new CollisionBlock({
              position: {
                x: x * 16,
                y: y * 16,
              },
            })
          );
        }
      });
    });

    return collisionBlocks;
  }

  createPlatformBlocks() {
    const platformCollisions2D = [];
    for (let i = 0; i < this.platformCollisions.length; i += 36) {
      platformCollisions2D.push(this.platformCollisions.slice(i, i + 36));
    }

    const platformBlocks = [];

    platformCollisions2D.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == 202) {
          platformBlocks.push(
            new CollisionBlock({
              position: {
                x: x * 16,
                y: y * 16,
              },
              height: 4,
            })
          );
        }
      });
    });

    return platformBlocks;
  }
}
