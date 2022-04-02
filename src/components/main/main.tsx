import {FC, useEffect, useState} from 'react';
import {ScenesConfig, ScenesHeat} from '../heat/scenes-heat';
import {HeatProvider} from '../../providers/heat.provider';

export const Main: FC = () => {
  const [getHeatId, setHeatId] = useState<string>("")
  const [getConfig, setConfig] = useState<ScenesConfig>({sceneType: 'asteroid'})
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHeatId(params.get("heatId") || process.env.REACT_APP_HEAT_CHANNEL || "");
  }, [])
  return <HeatProvider heatId={getHeatId}>
    {getConfig ? <ScenesHeat config={getConfig}/> : null}
  </HeatProvider>
}