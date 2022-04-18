import {FC, FormEvent, useEffect, useReducer} from 'react';
import {SCENES_ID, ScenesConfig, SceneType} from '../../types/config.types';
import {SceneNames} from './switch-scenes';
import {ReducerObject, ReducerObjectType} from '../../utils/react-reducer.utils';

interface FormConfigProps {
  config: ScenesConfig;
  onChange: (v: ScenesConfig) => void;
}

export const FormConfig: FC<FormConfigProps> = ({config, onChange}) => {
  const [formControl, setFormControl] = useReducer<ReducerObjectType<ScenesConfig>>(ReducerObject, config);
  useEffect(() => {
    setFormControl({replace: config});
  }, [config]);
  const emitChange = (e: FormEvent) => {
    e.preventDefault();
    onChange(formControl);
  }
  return <form onSubmit={emitChange}>
    <h1>Configurer la scene</h1>
    <select value={formControl.sceneType || ''}
            onChange={v => setFormControl({merge: {sceneType: v.target.value as SceneType}})}>
      <option value={""}>Sélectionner la scene</option>
      {SCENES_ID.map(s => <option value={s} key={s}>{SceneNames[s]}</option>)}
    </select>
    <div>
      <label>
        <div>channel id de l'extension Heat</div>
        <input
          type={'password'}
          value={formControl.heatId || ''}
          onChange={ev => setFormControl({merge: {heatId: ev.target.value}})}/>
      </label>
      <label>
        <div>id de la chaine</div>
        <input
          value={formControl.channelId || ''}
          onChange={ev => setFormControl({merge: {channelId: ev.target.value}})}/>
      </label>
      <label>
        <div>nom du bot ou du l'utilisateur</div>
        <input
          value={formControl.username || ''}
          onChange={ev => setFormControl({merge: {username: ev.target.value}})}/>
      </label>
      <label>
        <div>clé oAuth du bot</div>
        <input
          type={'password'}
          value={formControl.password || ''}
          onChange={ev => setFormControl({merge: {password: ev.target.value}})}/>
      </label>
      <div>

        <button type={'submit'}>Générer l'url et prévisualiser</button>
      </div>
    </div>
  </form>
}