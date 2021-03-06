import {createContext, FC, PropsWithChildren, useContext, useEffect, useRef} from 'react';
import {HeatApi, HeatUser, MessageHeat, UserPoint} from '../types/heat.types';
import {CoordinateRatioToScreen} from '../utils/number.utils';
import {RemoveItemInArray} from '../utils/deep-object.utils';

const cachedUsers: { [key: string]: HeatUser } = {};
const getUserName = async (id: string): Promise<string | HeatUser> => {
  if (typeof cachedUsers[id] !== 'undefined') {
    return cachedUsers[id];
  }
  if (id.startsWith("A")) return "Anonyme";
  else if (id.startsWith("U")) return "Inconnu";
  else {
    const result: HeatUser = await fetch(`https://heat-api.j38.net/user/${id}`).then(blob => blob.json());
    if (!result) {
      return id
    }
    cachedUsers[id] = result;
    return result;
  }
}
type HeatListener = (event: UserPoint) => void;

interface HeatContextProps {
  addHeatListener(listener: HeatListener): number;

  removeHeatListener(uid: number): void;
}

const notInit = () => {
  throw new Error('not init')
};
const HeatContext = createContext<HeatContextProps>({
  addHeatListener: notInit,
  removeHeatListener: notInit
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
  return <HeatContext.Provider
    value={{addHeatListener: addListener, removeHeatListener: removeListener}}>{children}</HeatContext.Provider>;
}