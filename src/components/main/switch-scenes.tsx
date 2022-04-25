import React, {FC, useMemo} from 'react';
import {AsteroidGame} from '../../games/asteroid/asteroid-game';
import {FlechetteGame} from '../../games/dart-target/flechette-game';
import {ScenesConfig, SceneType} from '../../types/config.types';
import {FootballGame} from '../../games/foot/football-game';
import {BasketGame} from '../../games/basket/basket-game';
import {PlinkoGame} from '../../games/plinko/plinko-game';
import {MinesweeperGame} from '../../games/minesweeper/minesweeper-game';

export const SceneNames: { [key in SceneType]: string } = {
  dartTarget: "Jeux de fléchette",
  asteroid: "Astéroïdes",
  soccer: "Football",
  basket: "Basket ball",
  plinko: "Jeu du Plinko",
  minesweeper: "Jeu du Démineur",
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
      case 'minesweeper':
        return <MinesweeperGame/>
      default:
        return null
    }
  }, [config]);
}

