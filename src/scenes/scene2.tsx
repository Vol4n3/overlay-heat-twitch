import {FC, useEffect, useRef} from 'react';
import {Scene2d} from '../2d/scene2d';
import {Starship} from '../2d/objects/starship';
import {UserPoint} from '../types/heat.types';
import {Asteroid} from '../2d/objects/asteroid';
import {Vector2} from '../2d/geometry/vector2';

export const Scene2: FC = () => {
  const refScene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refScene.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container, 30);
    let starship: Starship;
    const startPlay = (starshipOwner?: string) => {
      scene.erase();
      starship = new Starship(container.clientWidth / 2, container.clientHeight / 2, starshipOwner);
      scene.addAll(starship);
    }
    startPlay();
    const onClick = (event: MouseEvent) => {
      if (!starship) {
        return
      }
      starship.target = new Vector2(event.clientX, event.clientY);
    }
    const onUserClick = (event: CustomEvent<UserPoint>) => {
      if (!event.detail || !starship) {
        return
      }
      const {x, y, userID} = event.detail;
      if (!starship.owner) {
        starship.owner = userID
        return;
      }
      if (starship.owner === userID) {
        // controle du vaisseaux
        starship.target = new Vector2(x, y);
        return;
      }
      const vectorCheck = new Vector2(x - starship.x, y - starship.y);
      if (vectorCheck.length < 300) {
        return;
      }
      const indexAdd = scene.addAll(new Asteroid(x, y, starship, userID, () => {
        // on fait tout exploser

        // et on restart la game
        startPlay(userID);
      }));
      setTimeout(() => {
        scene.removeAll(indexAdd);
      }, 30000)
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
  }, [refScene]);
  return <div className={"scene"} ref={refScene}>

  </div>
}