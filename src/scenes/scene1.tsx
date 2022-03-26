import React, {FC, useEffect, useReducer, useRef} from 'react';
import {Scene2d} from '../2d/scene2d';
import {DartTarget} from '../2d/objects/dart-target';
import {Arrow} from '../2d/objects/arrow';
import {UserPoint} from '../types/heat.types';
import {ReducerObject, ReducerObjectType} from '../utils/react-reducer.utils';

export const Scene1: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scores, setScore] = useReducer<ReducerObjectType<{ [key: string]: number }>>(ReducerObject, {"lol":30});
  const [shoots, setShoots] = useReducer<ReducerObjectType<{ [key: string]: number }>>(ReducerObject, {"lol":3});
  useEffect(() => {
    const div = containerRef.current;
    if (!div) {
      return;
    }
    const scene = new Scene2d(div, 20);
    const dartTarget = new DartTarget(scene.ctx.canvas.width / 2 , scene.ctx.canvas.height / 2);
    scene.addAll(dartTarget);
    const addFlechette = (x: number, y: number, name: string) => {
      const flechette = new Arrow(x, y, dartTarget);
      setShoots({incrementNumber: {key: name, n: 1}});
      setScore({incrementNumber: {key: name, n: 0}});
      flechette.onTouched().then((result) => {
        setScore({incrementNumber: {key: name, n: result}});
      })
      const ids = scene.addAll(flechette);
      setTimeout(() => {
        scene.removeAll(ids);
      }, 20000)
    }
    const onUserClick = (event: CustomEvent<UserPoint>) => {
      if (event.detail) {
        addFlechette(event.detail.x, event.detail.y, event.detail.userID);
      }
    }
    const onClick = (event: MouseEvent) => {
      addFlechette(event.x, event.y, "test");
    }
    // @ts-ignore
    window.addEventListener<CustomEvent<UserPoint>>("heatclick", onUserClick)
    window.addEventListener("click", onClick)
    return () => {
      scene.destroy();
      if (!div) {
        return;
      }
      // @ts-ignore
      window.removeEventListener<CustomEvent<UserPoint>>("heatclick", onClick)
      window.removeEventListener("click", onClick)
    };
  }, [containerRef])
  return <>
    <div className={"scene"} ref={containerRef}>

    </div>
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      fontSize: "30px",
      background: 'rgba(0,0,0,0.2)',
      padding: "10px"
    }}>
      Jeu des fléchettes
      {Object.keys(scores).sort((a,b)=>(scores[b]/shoots[b] - scores[a]/shoots[a]))
        .map((key,index) => <div key={key} style={{
        padding: "10px 0",
          display: 'flex',
          justifyContent: 'space-between'
      }}>
        <div >
          [{index + 1}] {key} :
        </div>
        <div>
          {scores[key]} ({shoots[key]})
        </div>

      </div>)}
    </div>
  </>
}