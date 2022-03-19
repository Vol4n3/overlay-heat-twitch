import React, {useEffect, useReducer, useRef} from 'react';
import './App.scss';
import {Point} from '../types/point.types';
import {useHeat} from '../providers/heat.provider';
import {ReducerArray, ReducerArrayType} from '../utils/react-reducer.utils';
import {Scene1} from '../scenes/scene1';

interface UserPoint extends Point {
  uid: string,
  userID: string;
}

function simulateClick(x: number, y: number) {
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
  el.dispatchEvent(event);
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
    const indexListener = heat.onUserClick(({x, y, userID}) => {
      dispatchClick({push: {x, y, uid: userID + refId.current, userID}});
      refId.current += 1;
      simulateClick(x, y);
    });
    return () => {
      heat.removeListenerId(indexListener);

    };
  }, [heat]);
  return (
    <div className="App" id={"App"}>
      <div style={{position: 'absolute', background: 'rgba(0,0,0,0.2)', padding: ""}}>
        {clicks.map(click => <div key={click.uid}> click de {click.userID} en {click.x} : {click.y}  </div>)}
      </div>
      <Scene1/>
    </div>
  );
}

export default App;
