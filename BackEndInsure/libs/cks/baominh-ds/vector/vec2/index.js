class Vec2{

  constructor(x, y){
    this.x = 0;
    this.y = 0;

    x = +x;
    y = +y;

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    Object.defineProperties(this, {
      x : { value : x, writable : false },
      y : { value : y, writable : false }
    });
  }

  distance(vec2){
    if (!(vec2 instanceof Vec2)) vec2 = new Vec2();
    return Math.sqrt(Math.pow(vec2.x - this.x, 2) + Math.pow(vec2.y - this.y, 2));
  }

  add(distance){
    distance = +distance;
    if (isNaN(distance)) distance = 0;
    return new Vec2(this.x + distance, this.y + distance);
  }

  summation(vec2){
    return vec2 instanceof Vec2 ? new Vec2(vec2.x + this.x, vec2.y + this.y) : this;
  }

  subtraction(vec2){
    return vec2 instanceof Vec2 ? new Vec2(vec2.x - this.x, vec2.y - this.y) : this;
  }

  symmetry(){
    return new Vec2(-this.x, -this.y);
  }

  symmetryX(){
    return new Vec2(this.x, -this.y);
  }

  symmetryY(){
    return new Vec2(-this.x, this.y);
  }

  straightLine(vec2){
    if (!(vec2 instanceof Vec2)) vec2 = new Vec2();

  }

}

module.exports = (x, y) => new Vec2(x, y);