import React, {FC, useEffect, useRef} from 'react';
import {Scene2d} from '../2d/scene2d';
import {Ballon} from '../2d/objects/ballon';

export const Scene1:FC  = ()=>{
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const scene = new Scene2d(containerRef.current, 20);
    const onClick = (event: MouseEvent) => {
      const ballon = new Ballon(event.x, event.y);
      scene.addAll(ballon);
    }
    document.addEventListener("click", onClick)
    return ()=>{
      scene.destroy()
      document.removeEventListener("click", onClick)
    };
    },[])
  return <div className={"scene"} ref={containerRef}/>
}