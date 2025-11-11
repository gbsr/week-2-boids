import { vec2distance } from "./helpers";

export function gatherNeighbors(
  index: number,
  positions: { x: number[]; y: number[] },
  radius: number,
  neighbors: Array<{ x: number; y: number }>,
) {
  // Clear previous results
  neighbors.length = 0;

  const posX = positions.x;
  const posY = positions.y;

  const selfX = posX[index];
  const selfY = posY[index];

  for (let other = 0; other < posX.length; other++) {
    if (other === index) continue; // skip self

    const distance = vec2distance(
      { x: selfX, y: selfY },
      { x: posX[other], y: posY[other] }
    );

    if (distance <= radius) {
      neighbors.push({ x: posX[other], y: posY[other] });
    }
  }
}