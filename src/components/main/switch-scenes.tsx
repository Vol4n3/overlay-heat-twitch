import React, {FC, useMemo} from 'react';
import {AsteroidGame} from '../../games/asteroid-game';
import {FlechetteGame} from '../../games/flechette-game';
import {ScenesConfig, SceneType} from '../../types/config.types';
import {FootballGame} from '../../games/football-game';
import {BasketGame} from '../../games/basket-game';
import {PlinkoGame} from '../../games/plinko-game';

export const SceneNames: { [key in SceneType]: string } = {
  dartTarget: "Jeux de fléchette",
  asteroid: "Astéroïdes",
  soccer: "Football",
  basket: "Basket ball",
  plinko: "Jeu du Plinko",
}

export const SwitchScenes: FC<{ config: ScenesConfig }> = ({config}) => {
  return useMemo(() => {
    switch (config.sceneType) {
      case 'asteroid':
        return <AsteroidGame/>
      case 'dartTarget':
        return <FlechetteGame/>
      case 'soccer':
        return <FootballGame/>
      case 'basket':
        return <BasketGame/>
      case 'plinko':
        return <PlinkoGame/>
      default:
        return null
    }
  }, [config]);
}

