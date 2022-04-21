import {createContext, FC, PropsWithChildren, useContext, useEffect, useRef} from 'react';
import tmi from 'tmi.js';
import {RemoveItemInArray} from '../utils/deep-object.utils';


export type TmiMessage = {
  tags: tmi.ChatUserstate,
  self: boolean;
  channel: string;
  message: string;
}
export type TmiListener = (event: TmiMessage) => void;

interface TmiContextProps {
  addTmiListener(listener: TmiListener): number;

  removeTmiListener(uid: number): void;

  sendTmiMessage(message: string, timeout?: number): void;
}

const notInit = () => {
  throw new Error('not init')
};
const TmiContext = createContext<TmiContextProps>({
  addTmiListener: notInit,
  removeTmiListener: notInit,
  sendTmiMessage: notInit,
})
export const useTmi = () => useContext(TmiContext);

export interface TmiProviderProps {
  channelId?: string;
  password?: string;
  username?: string;
}

export const TmiProvider: FC<PropsWithChildren<TmiProviderProps>> = props => {
  const {channelId, children, username, password} = props;
  const listeners = useRef<{ uid: number, callback: TmiListener }[]>([]);
  const listenersIdRef = useRef<number>(0);
  const clientRef = useRef<tmi.Client>();
  const addListener = (listener: TmiListener) => {
    const uid = listenersIdRef.current++;
    listeners.current = [...listeners.current, {callback: listener, uid}];
    return uid;
  }
  const removeListener = (uid: number): void => {
    listeners.current = RemoveItemInArray(listeners.current, uid);
  }
  const sendTmiMessage = (message: string,timeout:number = 4000) => {
    if (!channelId) {
      return
    }
    const client = clientRef.current;
    debugger;
    if (!client || client.readyState() !== 'OPEN') {
      return;
    }
    setTimeout(() => {
      client.say(channelId, message)
    }, timeout);
  }
  useEffect(() => {
    if (!channelId) {
      return
    }
    const identity = (username && password) ? {username, password} : undefined;

    clientRef.current = new tmi.Client({
      options: {debug: true},
      identity,
      channels: [channelId]
    });

    clientRef.current.connect().then(result => {
      console.warn('tmi client disconnected', result);
    });
    clientRef.current.on('message', (channel, tags, message, self) => {
      listeners.current.forEach(listener => listener.callback({channel, tags, message, self}))
    })
    return () => {
      if (!clientRef.current) {
        return
      }
      clientRef.current.disconnect().then(info => {
        console.warn('tmi client disconnected', info);
      })
    }
  }, [channelId, username, password])
  return <TmiContext.Provider
    value={{
      addTmiListener: addListener,
      removeTmiListener: removeListener,
      sendTmiMessage
    }}>{children}</TmiContext.Provider>
}