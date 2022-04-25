import {Item2Scene, Scene2d} from '../../2d/core/scene2d';
import {OldPhysicBall2} from '../../2d/physics/old-physic-ball2';
import {CanCollide} from '../../2d/core/collider';
import {PlayerSoccer} from './player-soccer';
import {Vector2} from '../../2d/geometry/vector2';
import {AngleKeepRange, PI2} from '../../utils/number.utils';
import {Cage} from './cage';
import {IPoint2} from '../../types/point.types';
import {Rectangle2} from '../../2d/geometry/rectangle2';

const img = new Image();
let loaded = false;
img.onload = () => {
  loaded = true;
}
img.src = "/overlay-heat-twitch/assets/texture_ballon.jpg";

export class SoccerBall extends OldPhysicBall2 implements Item2Scene, CanCollide {
  isUpdated: boolean = true;
  constructor(x: number, y: number, private messager: (m: string) => void) {
    super(x, y, 30);
    this.initialPosition = {x, y}
  }

  initialPosition: IPoint2
  collisionId: number = 0;
  lastShooter: PlayerSoccer | null = null;

  detectGoal(cage: Cage) {
    if (cage.isInside(this)) {
      this.position.operation('equal', this.initialPosition);
      this.velocity = new Vector2(0, 0);
      if (this.lastShooter === null) {
        return
      }
      if (this.lastShooter.team === cage.team) {
        this.messager(`${this.lastShooter.owner} à marqué contre son prope camp ! le/la boloss`)
      } else {
        this.messager(`FootBall FootGoal GOOAAAL du joueur ${this.lastShooter.owner} FootGoal`)
      }
    }
  }

  detection(item: CanCollide): void {
    if (item instanceof SoccerBall) {
      return;
    }
    if (item instanceof PlayerSoccer) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        this.playerShoot(item)
      }
      return;
    }
    if (item instanceof Cage) {
      this.detectGoal(item);
    }
  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d({ctx}: Scene2d, time: number) {
    if (this.texture === null) {
      if (loaded) {
        this.texture = ctx.createPattern(img, "repeat");
        const scale = 0.244;
        this.texture?.setTransform(new DOMMatrix().scale(scale, scale));
      }
    }
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, PI2);
    if (this.texture) {
      ctx.fillStyle = this.texture;
      ctx.globalAlpha = 0.75;
    }
    ctx.fill();
    ctx.closePath();
  }

  playerShoot(player: PlayerSoccer): void {
    this.lastShooter = player;
    const directionBall = new Vector2(this.x - player.x, this.y - player.y);
    const velocityDiff = new Vector2(player.calculatedVelocity.x + this.velocity.x, player.calculatedVelocity.y + this.velocity.y);
    directionBall.length = velocityDiff.length * 0.95;
    this.velocity = directionBall;
  }

  private texture: null | CanvasPattern = null

  update(scene: Scene2d, time: number): void {
    this.isUpdated = true;
    const padding = 50;
    this.bounceBoundary(new Rectangle2(padding, padding, scene.canvas.width - padding, scene.canvas.height - padding), {
      x: 0.9,
      y: 0.9
    });
    this.position.operation('add', this.velocity);
    const roundedX = Math.round(this.velocity.x * 100) / 100;
    this.rotation += AngleKeepRange(((roundedX) / 200));
    this.velocity.b.operation("multiply", 0.99);
  }
}