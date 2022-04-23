import {FC, useEffect, useReducer, useState} from 'react';
import {SwitchScenes} from './switch-scenes';
import {HeatProvider} from '../../providers/heat.provider';
import styled from 'styled-components';
import {ReducerObject, ReducerObjectType} from '../../utils/react-reducer.utils';
import {ScenesConfig} from '../../types/config.types';
import pkg from '../../../package.json';
import {TmiProvider} from '../../providers/tmi.provider';
import {FormConfig} from './form-config';

export const Container = styled.div`
  margin: 0 auto;
  padding: 60px;
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  gap: 16px;
  background-color: #263238;
  color: white;
`;
export const Main: FC = () => {
  const [getConfig, setConfig] = useReducer<ReducerObjectType<ScenesConfig>>(ReducerObject, {isLoading: true});
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
  }, [getConfig]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uriConfig = params.get("config");

    if (!uriConfig) {
      return setConfig({merge: {isLoading: false}});
    }
    const decodeUri = window.decodeURIComponent(uriConfig);
    if (!decodeUri) {
      return setConfig({merge: {isLoading: false}});
    }
    const decodeBase64 = window.atob(decodeUri);
    if (!decodeBase64) {
      return setConfig({merge: {isLoading: false}});
    }
    const json = JSON.parse(decodeBase64);
    if (!json) {
      return setConfig({merge: {isLoading: false}});
    }
    setConfig({replace: json})
  }, [])
  return getConfig.isLoading ? null : getConfig.active ? <HeatProvider heatId={getConfig.heatId || ""}>
    <TmiProvider channelId={getConfig.channelId} username={getConfig.username} password={getConfig.password}>
      <SwitchScenes config={getConfig}/>
    </TmiProvider>
  </HeatProvider> : <Container>
    <div>
      <FormConfig config={getConfig} onChange={v => setConfig({replace: v})}></FormConfig>
      <div>
        <label>
          <div>copié cette url à mettre dans obs</div>
          <textarea readOnly={true} value={getUriConfig.trim()} onChange={() => {
          }}/>
        </label>
      </div>
      <div>
        <a href={getUriConfig.trim()} target={'_blank'} rel="noreferrer">Ouvrir dans un nouvelle onglet</a>
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