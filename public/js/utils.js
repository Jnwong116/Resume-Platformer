const collision = ({ object1, object2 }) => {
  return (
    object1.position.y + object1.height >= object2.position.y && // Bottom
    object1.position.y <= object2.position.y + object2.height && // Top
    object1.position.x + object1.width >= object2.position.x && // Right side
    object1.position.x <= object2.position.x + object2.width // Left side
  );
};

const platformCollision = ({ object1, object2 }) => {
  return (
    object1.position.y + object1.height >= object2.position.y && // Bottom
    object1.position.y + object1.height <=
      object2.position.y + object2.height && // Top
    object1.position.x + object1.width >= object2.position.x && // Right side
    object1.position.x <= object2.position.x + object2.width // Left side
  );
};
