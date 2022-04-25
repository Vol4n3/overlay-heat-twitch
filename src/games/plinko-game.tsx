import {FC, useEffect, useRef} from 'react';
import {ContainerScene} from '../components/ui/container-scene';
import {Scene2d} from '../2d/core/scene2d';
import {Bille} from '../2d/objects/bille';
import {useHeat} from '../providers/heat.provider';
import {UserPoint} from '../types/heat.types';
import {Pico} from '../2d/objects/pico';
import {PlinkoWall} from '../2d/objects/plinko-wall';

export const PlinkoGame: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {removeHeatListener, addHeatListener} = useHeat();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container);
    const staticScene = new Scene2d(container);

    const marge = 180.5;
    const gutterX = 80;
    const gutterY = 90;
    const sol = new PlinkoWall({x: 0, y: 0}, {x: scene.canvas.width - 1500, y: scene.canvas.height})
    staticScene.addItem(sol);
    scene.system.insert(sol);
    let isPair = true;
    let counter = 5;
    for (let row = marge; row < scene.canvas.height - marge; row += gutterY) {
      isPair = !isPair;
      const margeX = marge + (counter * 80);
      for (let col = isPair ? margeX : margeX + gutterX / 2; col < scene.canvas.width - margeX; col += gutterX) {
        const pico = new Pico(col, row);
        pico.mass = 2 + Math.random();
        staticScene.addItem(pico);
        scene.system.insert(pico);
      }
      counter--;
    }
    const onClick = ({x, y, userID}: UserPoint) => {
      const posY = Math.min(y, marge);
      const posX = x > scene.canvas.width - marge - 0.5 ? scene.canvas.width - marge - .5 : x < (marge + 0.5) ? (marge + 0.5) : x;
      const bille = new Bille(posX, posY, userID);
      bille.mass = 1 + Math.random();
      scene.addItem(bille);
      scene.system.insert(bille);
    }
    const onMouseClick = (event: MouseEvent) => {
      onClick({x: event.x, y: event.y, userID: "test"});
    }
    addHeatListener(onClick)
    window.addEventListener('click', onMouseClick)
    return () => {
      scene.destroy();
      staticScene.destroy();
      removeHeatListener(onClick);
      removeHeatListener(onClick);
      window.removeEventListener('click', onMouseClick)
    };
  }, [removeHeatListener, addHeatListener])
  return <ContainerScene ref={containerRef}/>
}