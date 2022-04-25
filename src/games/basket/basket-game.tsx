import {ContainerScene} from '../../components/ui/container-scene';
import {useEffect, useRef} from 'react';
import {Scene2d} from '../../2d/core/scene2d';
import {useHeat} from '../../providers/heat.provider';
import {UserPoint} from '../../types/heat.types';
import {Vector2} from '../../2d/geometry/vector2';
import {BasketPlayer} from './basket-player';
import {Hoop} from './hoop';
import {HoopSegment} from './hoop-segment';
import {TmiMessage, useTmi} from '../../providers/tmi.provider';
import {BasketBall} from './basket-ball';

export const BasketGame = () => {
  const refScene = useRef<HTMLDivElement>(null);
  const {removeHeatListener, addHeatListener} = useHeat();
  const {sendTmiMessage, removeTmiListener, addTmiListener} = useTmi();

  useEffect(() => {
    const container = refScene.current;
    if (!container) {
      return;
    }
    const bddPlayers: { [key: string]: { power: number } } = {test: {power: 40}};
    const scene = new Scene2d(container);
    const matrix = new DOMMatrix().scale(70 / 286, 70 / 200);
    let texture: CanvasPattern | null;
    scene.createTexture(
      "/overlay-heat-twitch/assets/texture-basket.png", "repeat", matrix).then(result => {
      texture = result;
    });

    const queuePoints: UserPoint[] = [];
    let interval: number;
    const player = new BasketPlayer(500, 500);

    const hoop1 = new Hoop(800, 200, 10);
    const hoop2 = new Hoop(900, 200, 10);

    const panierSegment = new HoopSegment(hoop1, hoop2);

    const startGame = () => {
      window.clearInterval(interval);
      scene.cleanItems();
      scene.addMultipleItem([player, hoop1, hoop2, panierSegment]);
      scene.system.insert(hoop1);
      scene.system.insert(hoop2);
      const onPanier = (owner: string) => {
        player.isUpdated = true;
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
        if (bddPlayers[point.userID] && typeof bddPlayers[point.userID].power !== "undefined") {
          direction.length *= 0.01 + (bddPlayers[point.userID].power || 10) / 1000;
        } else {
          direction.length *= 0.03;
        }

        ballon.velocity = direction
        scene.system.insert(ballon);
        scene.addItem(ballon);
        setTimeout(() => {
          scene.removeItem(ballon);
          scene.system.remove(ballon);
        }, 10000);
      }, 1);
    }
    startGame();
    const onClick = (event: UserPoint) => {
      queuePoints.push(event);
    }
    addHeatListener(onClick);
    const testClick = (event: MouseEvent) => {
      queuePoints.push({x: event.x, y: event.y, userID: 'test'});
    }
    const onPowerChange = (event: TmiMessage) => {
      const user = event.tags.username;
      if (!user) {
        return
      }
      if (!event.message) {
        return;
      }
      const split = event.message.split(" ");
      if (!split[0].toLocaleLowerCase().startsWith('!power')) {
        return;
      }
      if (split.length < 2) {
        return;
      }
      const parse = parseInt(split[1], 10);
      const power = parse > 40 ? 40 : parse < 0 ? 0 : parse;
      bddPlayers[user] = {power};
      sendTmiMessage(`la puissance de tir pour @${user} est maintenant de ${power}`, 10);
    }
    addTmiListener(onPowerChange);
    window.addEventListener('click', testClick);

    return () => {
      removeHeatListener(onClick);
      removeTmiListener(onPowerChange);
      scene.destroy();
      window.removeEventListener('click', testClick);
    };
  }, [addHeatListener, removeHeatListener, sendTmiMessage, addTmiListener, removeTmiListener])
  return <ContainerScene ref={refScene}/>
}