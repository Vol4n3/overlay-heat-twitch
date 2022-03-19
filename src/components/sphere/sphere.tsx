import {FC} from 'react';

interface SphereProps {
  x: number;
  y: number;
  color: string
}

const width = 150;
const height = 150;
export const Sphere: FC<SphereProps> = ({color,x, y,children}) => {
  return <div className={"sphere"}
              style={{left: x - (width / 2), top: y - (height / 2), width, height, background:color}}>
    {children}
  </div>
}