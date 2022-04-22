import {FC, useEffect, useRef} from 'react';
import {Scene2d} from '../2d/core/scene2d';
import {Starship} from '../2d/objects/starship';
import {UserPoint} from '../types/heat.types';
import {Asteroid} from '../2d/objects/asteroid';
import {Vector2} from '../2d/geometry/vector2';
import {Bullet} from '../2d/objects/bullet';
import {PickRandomOne} from '../utils/array.utils';
import {ContainerScene} from '../components/ui/container-scene';
import {Collider} from '../2d/core/collider';
import {useHeat} from '../providers/heat.provider';

export const AsteroidGame: FC = () => {
  const refScene = useRef<HTMLDivElement>(null);
  const {addHeatListener, removeHeatListener} = useHeat();
  useEffect(() => {
    const container = refScene.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container);
    let starship: Starship;
    let collider: Collider;
    let collisionGroupId: number;
    const createAsteroid = (x: number, y: number, userID: string) => {
      const width = scene.canvas.width;
      const height = scene.canvas.height;
      const pickCorner: 'xMin' | 'xMax' | 'yMin' | 'yMax' = PickRandomOne(['xMin', 'xMax', 'yMin', 'yMax']);
      let spawnX = 0;
      let spawnY = 0;
      switch (pickCorner) {
        case 'xMin':
          spawnY = Math.round(Math.random() * height);
          break;
        case 'xMax':
          spawnX = width;
          spawnY = Math.round(Math.random() * height);
          break;
        case 'yMin':
          spawnX = Math.round(Math.random() * width);
          break;
        case 'yMax':
          spawnX = Math.round(Math.random() * width);
          spawnY = height;
          break;
      }
      const direction = new Vector2(x - spawnX, y - spawnY);
      direction.length = Math.random() * 2 + 1;

      const ast = new Asteroid(spawnX, spawnY, userID, direction);
      scene.addItem(ast);
      setTimeout(() => {
        collider.addItemToGroup(ast, collisionGroupId);
      }, 1000);
      setTimeout(() => {
        scene.removeItem(ast);
        collider.removeItemFromGroup(ast, collisionGroupId);
      }, 60000);
      ast.onDestroyed = (owner) => {
        collider.removeItemFromGroup(ast, collisionGroupId);
        setTimeout(() => {
          scene.removeItem(ast);
        }, 300)
      }
    }
    let refLoopShoot: number;
    const startPlay = (starshipOwner?: string) => {
      scene.cleanItems();
      window.clearInterval(refLoopShoot);
      starship = new Starship(container.clientWidth / 2, container.clientHeight / 2, starshipOwner,
        (asteroidOwner) => startPlay(asteroidOwner));
      scene.addItem(starship);
      collider = new Collider();
      collisionGroupId = collider.addGroup("sorted");
      scene.addItem(collider);
      collider.addItemToGroup(starship, collisionGroupId);
      refLoopShoot = window.setInterval(() => {
        const starshipForward = Vector2.createFromAngle(starship.rotation, starship.radius);
        const bullet = new Bullet(starship.position.x + starshipForward.x, starship.position.y + starshipForward.y, starship.owner);
        bullet.velocity = new Vector2(starship.velocity.x * 3, starship.velocity.y * 3);
        scene.addItem(bullet);
        collider.addItemToGroup(bullet, collisionGroupId);
        setTimeout(() => {
          scene.removeItem(bullet);
          collider.removeItemFromGroup(bullet, collisionGroupId)
          // temps pour la disparition
        }, 2000)
        // fréquence de tir
      }, 800);
    }
    startPlay();
    const intervalRefAsteroid = window.setInterval(() => {
      createAsteroid(scene.canvas.width / 2, scene.canvas.height / 2, "");
    }, 3000);
    const onClick = (event: MouseEvent) => {
      if (!starship) {
        return
      }
      starship.target = new Vector2(event.clientX, event.clientY);
    }
    const onUserClick = (event: UserPoint) => {
      if (!starship) {
        return
      }
      const {x, y, userID} = event;
      if (!starship.owner) {
        starship.owner = userID
        return;
      }
      const vectorClick = new Vector2(x, y);
      if (starship.owner === userID) {
        // controle du vaisseaux
        starship.target = vectorClick;
        return;
      }
      createAsteroid(x, y, userID);
    }
    addHeatListener(onUserClick);
    window.addEventListener('click', onClick);
    return () => {
      clearInterval(intervalRefAsteroid);
      scene.destroy();
      removeHeatListener(onUserClick);
      window.removeEventListener('click', onClick);
    };
  }, [refScene, addHeatListener, removeHeatListener]);
  return <ContainerScene ref={refScene}/>
}