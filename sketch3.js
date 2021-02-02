'use strict';

class Vec2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * @param {Vec2} b
   */
  add(b) {
    let a = this;
    return new Vec2(a.x+b.x, a.y+b.y);
  }
  /**
   * @param {Vec2} b
   */
  sub(b) {
    let a = this;
    return new Vec2(a.x-b.x, a.y-b.y);
  }
  copy() {
    return new Vec2(this.x, this.y);
  }
  /**
   * @param {number} s
   */
  mult(s) {
    return new Vec2(s*this.x, s*this.y);
  }
  mag() {
    return sqrt(this.x ** 2 + this.y ** 2);
  }
}

class Ray2 {
  /**
   * @param {Vec2} pos このレイの始点の位置ベクトル.
   * @param {Vec2} way このレイの始点から伸びる方向ベクトル.
   */
  constructor(pos, way) {
    this.pos = pos;
    this.way = way;
  }
  /**
   * @param {Vec2} begin
   * @param {Vec2} end
   */
  static withPoints(begin, end) {
    return new Ray2(begin, end.sub(begin));
  }
  get begin() {
    return this.pos;
  }
  get end() {
    return this.pos.add(this.way);
  }
  /**
   * @param {Ray2} r2
   */
  intersection(r2) {
    let r1 = this;
    // Y軸並行の線分はこのコードでは扱えないので、並行の場合は微妙にずらす
    // an dirty hack since this code cannot handle Y-axis parallel rays.
    if (abs(r1.way.x) < 0.01) r1.way.x = 0.01;
    if (abs(r2.way.x) < 0.01) r2.way.x = 0.01;

    // r1,r2を直線として見て、その交点を求める
    // Treat r1,r2 as straight lines and calc the intersection point.
    let t1 = r1.way.y / r1.way.x;
    let t2 = r2.way.y / r2.way.x;
    let x1 = r1.pos.x;
    let x2 = r2.pos.x;
    let y1 = r1.pos.y;
    let y2 = r2.pos.y;
    let sx = (t1*x1 - t2*x2 - y1 + y2) / (t1 - t2);
    let sy = t1 * (sx - x1) + y1;

    // 交点が線分上にないときはnullを返す
    // Return null if the intersection point is not on r1 and r2.
    if (
      sx > min(r1.begin.x, r1.end.x)
      && sx < max(r1.begin.x, r1.end.x)
      && sx > min(r2.begin.x, r2.end.x)
      && sx < max(r2.begin.x, r2.end.x)
    ){
      return new Vec2(sx, sy);
    }else{
      return null;
    }
  }
}

class Player {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.angle = 0;
  }
}

class Level {
  constructor() {
    this.walls = [];
    this.tilemap = '';
    this.tileSize = 35;
    this.mapWidth = 0;
    this.mapHeight = 0;
  }
  tileAt(x, y) {
    return this.tilemap[this.mapWidth*y + x];
  }
  addWorldEdges() {
    let s = this.tileSize;
    let w = this.mapWidth;
    let h = this.mapHeight;
    this.walls.push(new Ray2(new Vec2(0,0), new Vec2(s*w, 0)));
    this.walls.push(new Ray2(new Vec2(0,0), new Vec2(0, s*h)));
    this.walls.push(new Ray2(new Vec2(s*w,s*h), new Vec2(-s*w, 0)));
    this.walls.push(new Ray2(new Vec2(s*w,s*h), new Vec2(0, -s*h)));
  }
  /**
   * @param {string} tilemap 
   * @param {number} width 
   * @param {number} height 
   * @param {number} size 
   */
  addTilemap(tilemap, width, height, size) {
    this.tilemap = tilemap;
    this.mapWidth = width;
    this.mapHeight = height;
    this.tileSize = size;
    let s = size;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let tile = this.tileAt(x, y);
        if (tile === 'O' || tile === 'X') {
          this.walls.push(new Ray2(new Vec2(s * x, s * y), new Vec2(s, 0)));
          this.walls.push(new Ray2(new Vec2(s * x, s * y), new Vec2(0, s)));
          if (this.tileAt(x, y + 1) === '.') {
            this.walls.push(new Ray2(new Vec2(s * x, s * y + s), new Vec2(s, 0)));
          }
          if (this.tileAt(x + 1, y) === '.') {
            this.walls.push(new Ray2(new Vec2(s * x + s, s * y), new Vec2(0, s)));
          }
          if (tile === 'X') {
            this.walls.push(new Ray2(new Vec2(s * x, s * y), new Vec2(s, s)));
            this.walls.push(new Ray2(new Vec2(s * x + s, s * y), new Vec2(-s, s)));
          }
        }
      }
    }
  }
}

class Game {
  constructor() {
    this.player = new Player();
    this.level = new Level();
  }
  reset() {
    this.player.pos = new Vec2(118, 201);
    this.player.angle = -PI/2;
  }
}

// グローバル変数 Global variables
let game;

function setup() {
  createCanvas(640, 480);
  
  game = new Game();
  game.reset();

  game.level.addTilemap(
    (
      '........' +
      '........' +
      '..OOO...' +
      '..O.....' +
      '........' +
      '........' +
      '........' +
      '......O.' +
      'OO...OO.' +
      'OO...O..'
    ),
    8,
    10,
    35
  );
  game.level.addWorldEdges();
}

function draw() {
  noSmooth();

  // 背景
  background(64);

  // 壁を描画. Draw walls of the level
  strokeWeight(4);
  stroke(224);
  let walls = game.level.walls;
  for(let wall of walls) {
    line(wall.begin.x, wall.begin.y, wall.end.x, wall.end.y);
  }

  // プレイヤーを描画. Draw the player
  stroke(224, 224, 0);
  strokeWeight(24);
  let player = game.player;
  point(player.pos.x, player.pos.y);

  // キー入力. Key input
  if (keyIsDown(LEFT_ARROW)) player.angle -= PI / 180;
  if (keyIsDown(RIGHT_ARROW)) player.angle += PI / 180;

  // 3Dビューを描画. Draw the 3dview.
  {
    let viewRect = new Ray2(new Vec2(305, 40), new Vec2(320, 240));

    let fov = PI / 2;
    let centerAngle = player.angle;
    let leftAngle = centerAngle - fov/2;
    let rightAngle = centerAngle + fov/2;
    let beamTotal = 40;
    let beamIndex = -1;
    for(let angle=leftAngle; angle<rightAngle-0.01; angle+=fov/beamTotal) {
      beamIndex++;
      let beam = new Ray2(
        player.pos.copy(),
        new Vec2(cos(angle), sin(angle)).mult(120)
      );

      // 光線が2枚以上の壁にあたっていたら、一番近いものを採用する。
      // Adapt the nearest beam.
      let allHitBeamWays = walls.map(wall => beam.intersection(wall))
        .filter(pos => pos !== null)
        .map(pos => pos.sub(beam.begin));
      if (allHitBeamWays.length === 0) {
        stroke(96, 96, 0);
        strokeWeight(1);
        line(beam.begin.x, beam.begin.y, beam.end.x, beam.end.y);
        continue;
      }
      let hitBeam = allHitBeamWays.reduce((a, b) => a.mag() < b.mag() ? a : b);

      // 3Dビューに縦線を1本描画する draw a line into 3dview
      let hitPos = hitBeam.add(beam.begin);
      let wallDist = hitBeam.mag();
      let wallPerpDist = wallDist * cos(angle - centerAngle);
      let lineHeight = constrain(3500 / wallPerpDist, 0, viewRect.way.y);
      lineHeight -= lineHeight % 8;
      let lineBegin = viewRect.begin.add(
        new Vec2(
          viewRect.way.x/beamTotal*beamIndex,
          viewRect.way.y/2-lineHeight/2
        )
      );
      let lightness = 224;
      let lmft = 1.3; //lightness multiplier for topview
      let tileSize = game.level.tileSize;
      let pillarSize = 5;
      if (
        ((hitPos.x % tileSize < pillarSize) || (hitPos.x % tileSize > tileSize - pillarSize))
        && ((hitPos.y % tileSize < pillarSize) || (hitPos.y % tileSize > tileSize - pillarSize))
      ){
        stroke(215*lmft, 179*lmft, 111*lmft); //wooden pillar color
        fill(215, 179, 111);
      }else{
        stroke(lightness*lmft); //concrete wall color
        fill(lightness);
      }
      strokeWeight(0);
      rect(lineBegin.x, lineBegin.y, 7, lineHeight);

      // ↑の縦線に対応した光線を、俯瞰図に描画する.
      // draw a beam correspond to above 3dview line into the topview.
      strokeWeight(1);
      line(player.pos.x, player.pos.y, player.pos.add(hitBeam).x, player.pos.add(hitBeam).y);
    }

    // 3Dビューの枠を描画. Draw border lines of the 3dview.
    noFill();
    stroke(66, 200, 251);
    strokeWeight(6);
    rect(viewRect.pos.x, viewRect.pos.y, viewRect.way.x, viewRect.way.y);
  }
}

function touchMoved(event) {
  let player = game.player;
  player.pos.x = event.clientX;
  player.pos.y = event.clientY;
}

