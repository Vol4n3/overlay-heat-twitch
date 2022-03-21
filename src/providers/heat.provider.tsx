import {createContext, FC, useContext, useEffect, useRef} from 'react';
import {Point} from '../types/point.types';
import {HeatApi, MessageHeat} from '../types/heat.types';
import {CoordinationRatioToScreen} from '../utils/number.utils';
import {getUserName} from '../utils/heat.utils';



interface UserPoint extends Point {
  userID: string;
}

type HeatListener = (event: UserPoint) => void;

interface HeatContextProps {
  onUserClick(listener: HeatListener): void;

  removeListenerId(): void;
}

const HeatContext = createContext<HeatContextProps>({
  onUserClick() {
    throw new Error('not init')
  },
  removeListenerId() {
    throw new Error('not init')
  }
})
export const useHeat = () => useContext(HeatContext);
export const HeatProvider: FC = ({children}) => {
  const listeners = useRef<HeatListener | null>(null);
  const onUserClick = (listener: HeatListener) => {
    listeners.current = listener;
  }
  const removeListenerId = (): void => {
    listeners.current = null;
  }

  useEffect(() => {
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
      const screen = CoordinationRatioToScreen(parseFloat(data.x), parseFloat(data.y), document.body.clientWidth, document.body.clientHeight);
      getUserName(data.id).then(user => {
        if (listeners.current === null) return;
        listeners.current({...screen, userID: typeof user === 'string' ? user : user.display_name});
      });
    }
    let ws: WebSocket;
    const init = () => {
      const params = new URLSearchParams(window.location.search);
      const channelId = params.get("heatId") || process.env.REACT_APP_HEAT_CHANNEL;
      const url = `wss://heat-api.j38.net/channel/${channelId}`;
      ws = new WebSocket(url);
      ws.addEventListener('message', onMessage);
      ws.addEventListener('open', onLogin);
      ws.addEventListener('close', init, {once: true});
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
      listeners.current = null;
    }
  }, []);
  return <HeatContext.Provider value={{onUserClick, removeListenerId}}>{children}</HeatContext.Provider>;
}