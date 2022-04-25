import React, {FC, useEffect, useReducer, useRef} from 'react';
import {Scene2d} from '../../2d/core/scene2d';
import {DartTarget} from './dart-target';
import {Arrow} from './arrow';
import {UserPoint} from '../../types/heat.types';
import {ReducerObject, ReducerObjectType} from '../../utils/react-reducer.utils';
import {ContainerScene} from '../../components/ui/container-scene';
import {useHeat} from '../../providers/heat.provider';

export const FlechetteGame: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scores, setScore] = useReducer<ReducerObjectType<{ [key: string]: number }>>(ReducerObject, {});
  const [shoots, setShoots] = useReducer<ReducerObjectType<{ [key: string]: number }>>(ReducerObject, {});
  const {addHeatListener, removeHeatListener} = useHeat();
  useEffect(() => {
    const div = containerRef.current;
    if (!div) {
      return;
    }
    const scene = new Scene2d(div);
    const dartTarget = new DartTarget(scene.ctx.canvas.width / 2, scene.ctx.canvas.height / 2);
    scene.addItem(dartTarget);
    const addFlechette = (x: number, y: number, name: string) => {
      const flechette = new Arrow(x, y, dartTarget);
      setShoots({incrementNumber: {key: name, n: 1}});
      setScore({incrementNumber: {key: name, n: 0}});
      flechette.onTouched().then((result) => {
        setScore({incrementNumber: {key: name, n: result}});
      })
      scene.addItem(flechette, 1);
      setTimeout(() => {
        scene.removeItem(flechette);
      }, 10000)
    }
    const onUserClick = (event: UserPoint) => {

      addFlechette(event.x, event.y, event.userID);

    }
    const onClick = (event: MouseEvent) => {
      addFlechette(event.x, event.y, "test");
    }
    addHeatListener(onUserClick);
    window.addEventListener("click", onClick)
    return () => {
      scene.destroy();
      if (!div) {
        return;
      }
      removeHeatListener(onUserClick);
      window.removeEventListener("click", onClick)
    };
  }, [addHeatListener, containerRef, removeHeatListener])
  return <>
    <ContainerScene ref={containerRef}/>
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      fontSize: "30px",
      background: 'rgba(0,0,0,0.2)',
      padding: "10px"
    }}>
      Jeu des fléchettes
      {Object.keys(scores).sort((a, b) => (scores[b] / shoots[b] - scores[a] / shoots[a]))
        .map((key, index) => <div key={key} style={{
          padding: "10px 0",
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            [{index + 1}] {key} :
          </div>
          <div>
            {scores[key]} ({shoots[key]})
          </div>

        </div>)}
    </div>
  </>
}