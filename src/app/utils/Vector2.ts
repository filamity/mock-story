import { DOWN, LEFT, RIGHT, UP } from "./types";

export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // duplicate() {
  //   return new Vector2(this.x, this.y);
  // }

  // matches(other: Vector2) {
  //   return this.x === other.x && this.y === other.y;
  // }

  // toNeighbour(direction: typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT) {
  //   switch (direction) {
  //     case UP:
  //       return new Vector2(this.x, this.y - 16);
  //     case DOWN:
  //       return new Vector2(this.x, this.y + 16);
  //     case LEFT:
  //       return new Vector2(this.x - 16, this.y);
  //     case RIGHT:
  //       return new Vector2(this.x + 16, this.y);
  //   }
  // }

  // toString() {
  //   return `${this.x},${this.y}`;
  // }
}
