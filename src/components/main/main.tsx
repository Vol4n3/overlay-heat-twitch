import {FC, useEffect, useReducer, useState} from 'react';
import {SceneNames, ScenesHeat} from '../heat/scenes-heat';
import {HeatProvider} from '../../providers/heat.provider';
import styled from 'styled-components';
import {ReducerObject, ReducerObjectType} from '../../utils/react-reducer.utils';
import {SCENES_ID, ScenesConfig, SceneType} from '../../types/config.types';
import pkg from '../../../package.json';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
`;
export const Main: FC = () => {
  const [getConfig, setConfig] = useReducer<ReducerObjectType<ScenesConfig>>(ReducerObject, {});
  const [getUriConfig, setUriConfig] = useState<string>("");
  useEffect(() => {
    setUriConfig(`${process.env.NODE_ENV === "development" ? "/" : pkg.homepage}?config=${
      window.encodeURIComponent(window.btoa(
        JSON.stringify(
          {
            ...getConfig,
            active: true
          }
        )
      ))}
    `)
  }, [getConfig])
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uriConfig = params.get("config");
    if (!uriConfig) {
      return
    }
    const decodeUri = window.decodeURIComponent(uriConfig);
    if (!decodeUri) {
      return;
    }
    const decodeBase64 = window.atob(decodeUri);
    if (!decodeBase64) {
      return;
    }
    const json = JSON.parse(decodeBase64);
    if (!json) {
      return;
    }
    setConfig({replace: json})
  }, [])
  return getConfig.active ? <HeatProvider heatId={getConfig.heatId || process.env.REACT_APP_HEAT_CHANNEL || ""}>
    <ScenesHeat config={getConfig}/> </HeatProvider> : <Container>
    <div><h1>Configurer la scene</h1>
      <select value={getConfig.sceneType || ''}
              onChange={v => setConfig({merge: {sceneType: v.target.value as SceneType}})}>
        <option value={""}>Sélectionner la scene</option>
        {SCENES_ID.map(s => <option value={s} key={s}>{SceneNames[s]}</option>)}
      </select>
      <div>
        <label>
          <div>channel id de l'extension Heat</div>
          <input value={getConfig.heatId || ''} onChange={ev => setConfig({merge: {heatId: ev.target.value}})}/>
        </label>
      </div>
      <div>
        <label>
          <div>copié cette url à mettre dans obs</div>
          <textarea value={getUriConfig} onChange={() => {
          }}/>
        </label>
      </div>

    </div>
    <div style={{position: 'relative', flex: 1}}>
      <iframe
        title={"Prévisualisation"}
        src={getUriConfig}
        style={{
          width: "100%",
          height: "100%",
        }}/>
    </div>

  </Container>

}