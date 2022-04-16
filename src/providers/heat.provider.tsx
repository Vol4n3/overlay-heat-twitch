import {createContext, FC, PropsWithChildren, useContext, useEffect, useRef} from 'react';
import {HeatApi, MessageHeat, UserPoint} from '../types/heat.types';
import {CoordinateRatioToScreen} from '../utils/number.utils';
import {getUserName} from '../utils/heat.utils';
import {RemoveItemInArray} from '../utils/deep-object.utils';


type HeatListener = (event: UserPoint) => void;

interface HeatContextProps {
  addListener(listener: HeatListener): number;

  removeListener(uid: number): void;
}

const HeatContext = createContext<HeatContextProps>({
  addListener() {
    throw new Error('not init')
  },
  removeListener() {
    throw new Error('not init')
  }
})
export const useHeat = () => useContext(HeatContext);

interface HeatProviderProps {
  heatId: string;
}

export const HeatProvider: FC<PropsWithChildren<HeatProviderProps>> = ({heatId, children}) => {
  const listeners = useRef<{ uid: number, callback: HeatListener }[]>([]);
  const listenersIdRef = useRef<number>(0);
  const addListener = (listener: HeatListener) => {
    const uid = listenersIdRef.current++;
    listeners.current = [...listeners.current, {callback: listener, uid}];
    return uid
  }
  const removeListener = (uid: number): void => {
    listeners.current = RemoveItemInArray(listeners.current, uid);
  }
  useEffect(() => {
    if (!heatId) {
      return;
    }
    const onLogin = () => {
      console.log('logged to heat');
    }
    const onMessage = (message: MessageHeat) => {
      const data: HeatApi = JSON.parse(message.data);
      if (data.type !== 'click') {
        return;
      }
      if (data.id.startsWith("A")) return;
      else if (data.id.startsWith("U")) return;
      const screen = CoordinateRatioToScreen(parseFloat(data.x), parseFloat(data.y), document.body.clientWidth, document.body.clientHeight);
      getUserName(data.id).then(user => {
        listeners.current.forEach(listener => listener.callback({
          ...screen,
          userID: typeof user === 'string' ? user : user.display_name
        }));
      });
    }
    let ws: WebSocket;
    const init = () => {
      const url = `wss://heat-api.j38.net/channel/${heatId}`;
      ws = new WebSocket(url);
      ws.addEventListener('message', onMessage);
      ws.addEventListener('open', onLogin);
      ws.addEventListener('close', () => {
        ws.removeEventListener('message', onMessage);
        ws.removeEventListener('open', onLogin);
        init()
      }, {once: true});
    }
    init();
    return () => {
      if (!ws) {
        return
      }
      ws.removeEventListener('message', onMessage);
      ws.removeEventListener('open', onLogin);
      ws.removeEventListener('close', init);
      ws.close();
      listeners.current = [];
    }
  }, [heatId]);
  return <HeatContext.Provider value={{addListener, removeListener}}>{children}</HeatContext.Provider>;
}