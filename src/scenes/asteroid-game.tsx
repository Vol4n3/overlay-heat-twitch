import {FC, useEffect, useRef} from 'react';
import {Scene2d} from '../2d/core/scene2d';
import {Starship} from '../2d/objects/starship';
import {UserPoint} from '../types/heat.types';
import {Asteroid} from '../2d/objects/asteroid';
import {Vector2} from '../2d/geometry/vector2';
import {Bullet} from '../2d/objects/bullet';
import {PickRandomOne} from '../utils/array.utils';
import {ContainerScene} from '../components/ui/container-scene';

export const AsteroidGame: FC = () => {
  const refScene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refScene.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container, 30);
    let starship: Starship;
    const bullets: number[] = [];
    const asteroids: number[] = [];
    const refLoopCollision = setInterval(() => {
      bullets.forEach((bulletId, buli) => {
        asteroids.forEach((asteroidId, asti) => {
          const bullet = scene.getItem(bulletId) as Bullet;
          const asteroid = scene.getItem(asteroidId) as Asteroid;
          if (!bullet || !asteroid) {
            return;
          }
          const distance = bullet.position.distanceTo(asteroid.position);
          if (distance < (bullet.radius + asteroid.radius)) {
            scene.removeItem(asteroidId);
            scene.removeItem(bulletId);
            asteroids.splice(asti, 1);
            bullets.splice(buli, 1);
          }
        });
      });
    }, 10);
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

      const asteroidRef = scene.addItem(
        new Asteroid(spawnX, spawnY, starship, userID, () => {
          // on fait tout exploser
          starship.isDestroyed = true;
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
      }, 60000)
    }
    let refLoopShoot: number;
    const startPlay = (starshipOwner?: string) => {
      bullets.splice(0, bullets.length);
      asteroids.splice(0, bullets.length);
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
    const onUserClick = (event: CustomEvent<UserPoint>) => {
      if (!event.detail || !starship) {
        return
      }
      const {x, y, userID} = event.detail;
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
    // @ts-ignore
    window.addEventListener('heatclick', onUserClick);
    window.addEventListener('click', onClick);
    return () => {
      clearInterval(intervalRefAsteroid);
      clearInterval(refLoopCollision);
      scene.destroy();
      // @ts-ignore
      window.removeEventListener('heatclick', onUserClick);
      window.removeEventListener('click', onClick);
    };
  }, [refScene]);
  return <ContainerScene ref={refScene}/>
}