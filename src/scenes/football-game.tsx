import {FC, useEffect, useRef} from 'react';
import {ContainerScene} from '../components/ui/container-scene';
import {Scene2d} from '../2d/core/scene2d';
import {Ballon} from '../2d/objects/ballon';
import {PlayerSoccer} from '../2d/objects/player-soccer';
import {UserPoint} from '../types/heat.types';
import {Collider} from '../2d/core/collider';
import {Point2} from '../2d/geometry/point2';
import {PI} from '../utils/number.utils';
import {useHeat} from '../providers/heat.provider';
import {Terrain} from '../2d/objects/terrain';
import {Cage} from '../2d/objects/cage';

const cageWidth = 50;
const cageHeight = 250;
const padding = 50;
export const FootballGame: FC = () => {
  const containerRef = useRef(null);
  const {addListener, removeListener} = useHeat();
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return
    }
    const collider = new Collider();
    const mainGroup = collider.addGroup('sorted');
    const cageGroup = collider.addGroup('all');

    const scene = new Scene2d(container, 1000 / 60);
    // attention cage rouge et cage bleu ne seront pas mis à jour si la taille change
    const cageRouge = new Cage(
      padding - cageWidth / 2,
      scene.canvas.height / 2 - cageHeight / 2,
      cageWidth, cageHeight);
    const cageBleu = new Cage(
      scene.canvas.width - padding - cageWidth / 2,
      scene.canvas.height / 2 - cageHeight / 2,
      cageWidth, cageHeight);
    const terrain = new Terrain();
    let bddPlayers: { [key: string]: PlayerSoccer } = {};
    const startPlay = () => {
      scene.cleanItems();
      bddPlayers = {};
      collider.cleanGroup(mainGroup);
      collider.cleanGroup(cageGroup);
      const ballon = new Ballon(scene.canvas.width / 2, scene.canvas.height / 2);
      scene.addItem(terrain);
      scene.addItem(cageBleu);
      scene.addItem(cageRouge);
      scene.addItem(collider);
      scene.addItem(ballon);
      collider.addItemToGroup(ballon, mainGroup);
      collider.addItemToGroup(ballon, cageGroup);
      collider.addItemToGroup(cageRouge, cageGroup);
      collider.addItemToGroup(cageBleu, cageGroup);
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
      collider.addItemToGroup(player, mainGroup);
      scene.addItem(player);
    }
    const onUserClick = (event: UserPoint) => {
      const {x, y, userID} = event;
      createPlayer(x, y, userID);
    }

    const onClick = (event: MouseEvent) => {
      //debug
      createPlayer(event.x, event.y, "test")
    }
    const idEvent = addListener(onUserClick);
    window.addEventListener('click', onClick);
    return () => {
      scene.destroy();
      removeListener(idEvent);
      window.removeEventListener('click', onClick);
    };
  }, [removeListener, addListener]);

  return <ContainerScene ref={containerRef}>
  </ContainerScene>
}