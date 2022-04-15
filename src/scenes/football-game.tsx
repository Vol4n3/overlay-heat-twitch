import {FC, useEffect, useRef} from 'react';
import {ContainerScene} from '../components/ui/container-scene';
import {Scene2d} from '../2d/core/scene2d';
import {Ballon} from '../2d/objects/ballon';
import {PlayerSoccer} from '../2d/objects/player-soccer';
import {UserPoint} from '../types/heat.types';
import {Collider} from '../2d/core/collider';
import {Point2} from '../2d/geometry/point2';
import {PI} from '../utils/number.utils';

export const FootballGame: FC = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return
    }
    const collider = new Collider();
    const groupId = collider.addGroup();


    const scene = new Scene2d(container, 1000 / 60);

    let bddPlayers: { [key: string]: PlayerSoccer } = {};
    const startPlay = () => {
      scene.cleanItems();
      bddPlayers = {};
      collider.cleanGroup(groupId);
      const ballon = new Ballon(scene.canvas.width / 2, scene.canvas.height / 2, 30);
      scene.addItem(collider);
      scene.addItem(ballon);
      collider.addItemToGroup(ballon, groupId);
    }

    startPlay();
    const createPlayer = (x: number, y: number, name: string) => {
      if (bddPlayers[name]) {
        // jouer
        bddPlayers[name].setTarget(new Point2(x, y));
        return
      }
      const player = new PlayerSoccer(x, y, 30);
      if (x > scene.canvas.width / 2) {
        player.team = "blue";
        player.rotation = PI;
      } else {
        player.team = "red";
      }
      player.owner = name;
      bddPlayers[name] = player;
      collider.addItemToGroup(player, groupId);
      scene.addItem(player);
    }
    const onUserClick = (event: CustomEvent<UserPoint>) => {
      if (!event.detail) {
        return
      }
      const {x, y, userID} = event.detail;
      createPlayer(x, y, userID)
    }

    const onClick = (event: MouseEvent) => {
      //debug
      createPlayer(event.x, event.y, "test")
    }
    // @ts-ignore
    window.addEventListener('heatclick', onUserClick);
    window.addEventListener('click', onClick);
    return () => {
      scene.destroy();
      // @ts-ignore
      window.removeEventListener('heatclick', onUserClick);
      window.removeEventListener('click', onClick);
    };
  }, [])
  return <ContainerScene ref={containerRef}>
  </ContainerScene>
}