import React, {useEffect, useReducer, useRef} from 'react';
import './App.scss';
import {useHeat} from '../providers/heat.provider';
import {ReducerArray, ReducerArrayType} from '../utils/react-reducer.utils';
import {Scene1} from '../scenes/scene1';
import {UserPoint} from '../types/heat.types';


function simulateClick(x: number, y: number, userID: string, uid: string) {
  const el = document.elementFromPoint(x, y);
  if (!el) {
    return
  }
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
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
  el.dispatchEvent(event);
  el.dispatchEvent(custom);
}

function App() {
  const [clicks, dispatchClick] = useReducer<ReducerArrayType<UserPoint>>(ReducerArray, []);
  const heat = useHeat();
  const refId = useRef<number>(0);
  useEffect(() => {
    if (clicks.length > 5) {
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
  return (
    <div className="App" id={"App"}>
      <div style={{position: 'absolute', background: 'rgba(0,0,0,0.2)', padding: "10px", fontSize: "32px"}}>
        {clicks.map(click => <div key={click.uid}> click de {click.userID} en {click.x} : {click.y}  </div>)}
      </div>
      <Scene1/>
    </div>
  );
}

export default App;
