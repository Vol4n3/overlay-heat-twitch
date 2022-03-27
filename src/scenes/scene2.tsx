import {FC, useEffect, useRef} from 'react';
import {Scene2d} from '../2d/scene2d';
import {Starship} from '../2d/objects/starship';
import {UserPoint} from '../types/heat.types';
import {Asteroid} from '../2d/objects/asteroid';
import {Vector2} from '../2d/geometry/vector2';
import {Bullet} from '../2d/objects/bullet';
import {PickRandomOne} from '../utils/array.utils';

export const Scene2: FC = () => {
  const refScene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refScene.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container, 30);
    let starship: Starship;
    let refLoopShoot: number;
    const bullets: number[] = [];
    const asteroids: number[] = [];
    setInterval(() => {
      bullets.forEach((bulletId) => {
        asteroids.forEach((asteroidId, index) => {
          const bullet = scene.getItem(bulletId) as Bullet;
          const asteroid = scene.getItem(asteroidId) as Asteroid;
          if (!bullet || !asteroid) {
            return;
          }
          const distance = bullet.position.createFromVectorDiff(asteroid.position).length;
          if (distance < (bullet.radius + asteroid.radius)) {
            scene.removeItem(asteroidId);
            asteroids.splice(index, 1);
          }
        });
      });
    }, 10);
    const createAsteroid = (x: number, y: number, userID: string) => {

      const offset = 60;
      const width = scene.canvas.width - offset;
      const height = scene.canvas.height - offset;
      const pickCorner: 'xMin' | 'xMax' | 'yMin' | 'yMax' = PickRandomOne(['xMin', 'xMax', 'yMin', 'yMax']);
      let spawnX = 0;
      let spawnY = 0;
      switch (pickCorner) {
        case 'xMin':
          spawnX = offset;
          spawnY = Math.round(Math.random() * height);
          break;
        case 'xMax':
          spawnX = width;
          spawnY = Math.round(Math.random() * height);
          break;
        case 'yMin':
          spawnX = Math.round(Math.random() * width);
          spawnY = offset;
          break;
        case 'yMax':
          spawnX = Math.round(Math.random() * width);
          spawnY = height;
          break;
      }
      const direction = new Vector2(x - spawnX, y - spawnY);
      direction.length = 5;

      const asteroidRef = scene.addItem(
        new Asteroid(spawnX, spawnY, starship, userID, () => {
          // on fait tout exploser
          starship.destroy()
          // et on restart la game
          setTimeout(() => {
            startPlay(userID);
          }, 1000);
        }, direction)
      );
      asteroids.push(asteroidRef);
      setTimeout(() => {
        scene.removeItem(asteroidRef);
        const indexAsteroid = bullets.indexOf(asteroidRef);
        if (indexAsteroid < 0) {
          return;
        }
        asteroids.splice(indexAsteroid, 1);
      }, 30000)
    }


    const startPlay = (starshipOwner?: string) => {
      scene.cleanItems();
      window.clearInterval(refLoopShoot);
      starship = new Starship(container.clientWidth / 2, container.clientHeight / 2, starshipOwner);
      scene.addItem(starship);
      refLoopShoot = window.setInterval(() => {
        const starshipForward = Vector2.createFromAngle(starship.rotation, starship.radius);
        const bullet = new Bullet(starship.position.x + starshipForward.x, starship.position.y + starshipForward.y, 5);
        bullet.direction = new Vector2(starship.direction.x * 3, starship.direction.y * 3);
        const refBullet = scene.addItem(bullet);
        bullets.push(refBullet);
        setTimeout(() => {
          scene.removeItem(refBullet);
          const indexBullet = bullets.indexOf(refBullet);
          if (indexBullet < 0) {
            return;
          }
          bullets.splice(indexBullet, 1);
          // temps pour la disparition
        }, 4000)
        // fréquence de tir
      }, 900);
    }
    startPlay();
    window.setInterval(() => {
      createAsteroid(scene.canvas.width / 2, scene.canvas.height / 2, "Test");
    }, 1000);
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
      const vectorCheck = new Vector2(x - starship.position.x, y - starship.position.y);
      if (vectorCheck.length < 300) {
        return;
      }
      createAsteroid(x, y, userID);
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