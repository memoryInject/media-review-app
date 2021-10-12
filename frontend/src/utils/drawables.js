import { Arrow, Circle, Line } from 'react-konva';

class Drawable {
  constructor(startx, starty, color='black') {
    this.startx = startx;
    this.starty = starty;
    this.color = color;
  }
}

class ArrowDrawable extends Drawable {
  constructor(startx, starty, color='black') {
    super(startx, starty, color);
    this.x = startx;
    this.y = starty;
  }
  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }
  render(i) {
    const points = [this.startx, this.starty, this.x, this.y];
    return <Arrow key={i} points={points} fill={this.color} stroke={this.color} />;
  }
}

class CircleDrawable extends ArrowDrawable {
  constructor(startx, starty, color='black') {
    super(startx, starty, color);
    this.x = startx;
    this.y = starty;
  }
  render(i) {
    const dx = this.startx - this.x;
    const dy = this.starty - this.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    return (
      <Circle
        key={i}
        radius={radius}
        x={this.startx}
        y={this.starty}
        stroke={this.color}
      />
    );
  }
}

class FreePathDrawable extends Drawable {
  constructor(startx, starty, color='black') {
    super(startx, starty, color);
    this.points = [startx, starty];
  }
  registerMovement(x, y) {
    this.points = [...this.points, x, y];
  }
  render(i) {
    return <Line key={i} points={this.points} fill={this.color} stroke={this.color} />;
  }
}

export { ArrowDrawable, CircleDrawable, FreePathDrawable };
