import {ContainerScene} from '../components/ui/container-scene';
import {useEffect, useRef} from 'react';
import {Scene2d} from '../2d/core/scene2d';
import {BasketBall} from '../2d/objects/basket-ball';
import {useHeat} from '../providers/heat.provider';
import {UserPoint} from '../types/heat.types';
import {Collider} from '../2d/core/collider';
import {Vector2} from '../2d/geometry/vector2';
import {BasketPlayer} from '../2d/objects/basket-player';
import {Hoop} from '../2d/objects/hoop';
import {HoopSegment} from '../2d/objects/hoop-segment';
import {useTmi} from '../providers/tmi.provider';

export const BasketGame = () => {
  const refScene = useRef<HTMLDivElement>(null);
  const {removeHeatListener, addHeatListener} = useHeat();
  const {sendTmiMessage} = useTmi();
  useEffect(() => {
    const container = refScene.current;
    if (!container) {
      return;
    }

    const scene = new Scene2d(container, 1000 / 60);
    const scale = 0.700;
    const matrix = new DOMMatrix().scale(scale, scale);
    let texture: CanvasPattern | null;
    scene.createTexture(
      "/overlay-heat-twitch/assets/basket_texture.webp", "repeat", matrix).then(result => {
      texture = result;
    });
    const collider = new Collider();
    const mainGroup = collider.addGroup('all');
    const queuePoints: UserPoint[] = [];
    let interval: number;
    const player = new BasketPlayer(500, 500);

    const hoop1 = new Hoop(800, 200, 10);
    const hoop2 = new Hoop(900, 200, 10);

    const panierSegment = new HoopSegment(hoop1, hoop2);

    const startGame = () => {
      collider.cleanGroup(mainGroup);
      window.clearInterval(interval);
      scene.cleanItems();
      scene.addMultipleItem([player, collider, hoop1, hoop2, panierSegment]);

      collider.addItemToGroup(hoop1, mainGroup);
      collider.addItemToGroup(hoop2, mainGroup);
      const onPanier = (owner: string) => {
        player.position.x = Math.round(Math.random() * scene.canvas.width);
        player.position.y = Math.round(Math.random() * scene.canvas.height);
        sendTmiMessage(`FootGoal ${owner} a marqué un panier FootGoal`)
      }
      interval = window.setInterval(() => {
        const point = queuePoints[0];
        if (!point) {
          return
        }
        queuePoints.shift();
        const ballon = new BasketBall(player.x, player.y, panierSegment, texture);
        ballon.owner = point.userID;
        ballon.onPanier = onPanier;
        const direction = new Vector2(point.x - player.x, point.y - player.y);
        direction.length /= 20;
        ballon.velocity = direction
        collider.addItemToGroup(ballon, mainGroup);
        scene.addItem(ballon);
        setTimeout(() => {
          scene.removeItem(ballon);
          collider.removeItemFromGroup(ballon, mainGroup);
        }, 30000);
      }, 1);
    }
    startGame();
    const onClick = (event: UserPoint) => {
      queuePoints.push(event);
    }
    const idHeat = addHeatListener(onClick);
    const testClick = (event: MouseEvent) => {
      queuePoints.push({x: event.x, y: event.y, userID: 'test'});
    }
    window.addEventListener('click', testClick);
    return () => {
      removeHeatListener(idHeat);
      scene.destroy();
      window.removeEventListener('click', testClick);
    };
  }, [addHeatListener, removeHeatListener, sendTmiMessage])
  return <ContainerScene ref={refScene}/>
}