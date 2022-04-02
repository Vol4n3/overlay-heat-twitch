import React, {FC, useEffect, useMemo, useReducer, useRef} from 'react';
import {useHeat} from '../../providers/heat.provider';
import {ReducerArray, ReducerArrayType} from '../../utils/react-reducer.utils';
import {UserPoint} from '../../types/heat.types';
import {AsteroidGame} from '../../scenes/asteroid-game';
import {FlechetteGame} from '../../scenes/flechette-game';
import {ScenesConfig, SceneType} from '../../types/config.types';

export const SceneNames: { [key in SceneType]: string } = {dartTarget: "Jeux de fléchette", asteroid: "Astéroïdes"}
const simulateClick = (x: number, y: number, userID: string, uid: string) => {
  const el = document.elementFromPoint(x, y);
  if (!el) {
    return
  }
  const custom = new CustomEvent<UserPoint>('heatclick', {
    bubbles: true,
    cancelable: true,
    detail: {
      x,
      y,
      userID,
      uid
    }
  });
  el.dispatchEvent(custom);
}

export const ScenesHeat: FC<{ config: ScenesConfig }> = ({config}) => {
  const [clicks, dispatchClick] = useReducer<ReducerArrayType<UserPoint>>(ReducerArray, []);
  const heat = useHeat();
  const refId = useRef<number>(0);
  useEffect(() => {
    if (clicks.length > 3) {
      dispatchClick({removeOne: 0})
    } else {
      setTimeout(() => {
        dispatchClick({removeOne: 0})
      }, 10000)
    }
  }, [clicks])
  useEffect(() => {
    heat.onUserClick(({x, y, userID}) => {
      const uid = userID + refId.current;
      dispatchClick({push: {x, y, uid, userID}});
      refId.current += 1;
      simulateClick(x, y, userID, uid);
    });
    return () => {
      heat.removeListenerId();
    };
  }, [heat]);
  const selectedScene = useMemo(() => {
    switch (config.sceneType) {
      case 'asteroid':
        return <AsteroidGame/>
      case 'dartTarget':
        return <FlechetteGame/>
      default:
        return null
    }
  }, [config])
  return (
    <>
      <div style={{position: 'absolute', background: 'rgba(0,0,0,0.2)', fontSize: "32px"}}>
        {clicks.map(click => <div key={click.uid} style={{padding: "10px"}}> click
          de {click.userID} en {click.x} : {click.y}  </div>)}
      </div>
      {selectedScene}
    </>
  );
}

