import {Item2Scene, Scene2d} from './scene2d';
import {IPoint2} from '../../types/point.types';

/**
 * use Sorted algo for same radius point
 * use All for few item
 * binaryTree and QuadraticTree are not wet implemented
 */
export type AlgorithmType = 'sorted' | 'all' | 'binaryTree' | 'QuadraticTree' | 'confront';

interface ColliderGroup<T> {
  algorithmType?: AlgorithmType,
  id: number,
  item: T,
  confrontId?: number;
}

export interface CanCollide extends IPoint2 {
  collisionId: number

  detection(item: CanCollide): void;
}

/**
 * @deprecated use scene system
 */
export class Collider implements Item2Scene {
  isUpdated: boolean = false;
  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d(scene: Scene2d, time: number): void {
  }

  private groups: ColliderGroup<CanCollide[]>[] = [];
  private uid = 0;

  addGroup(algorithmType: AlgorithmType): number {
    this.uid++;
    this.groups.push({item: [], id: this.uid, algorithmType});
    return this.uid;
  }

  addItemToGroup(item: CanCollide, groupId: number) {
    const findGroup = this.groups.findIndex(f => f.id === groupId);

    if (findGroup >= 0) {
      item.collisionId = this.uid++;
      this.groups[findGroup].item.push(item);
      return
    }
    throw new Error('impossible de trouver le groupe pour ajouter un item');
  }

  cleanGroup(groupId: number): void {
    const findGroup = this.groups.findIndex(f => f.id === groupId);
    if (findGroup >= 0) {
      this.groups[findGroup].item = [];
    }
  }

  update(scene: Scene2d, time: number): void {
    this.groups.forEach((group) => {
      if (!group.algorithmType) {
        return;
      }
      if (group.algorithmType === 'confront') {
        if (typeof group.confrontId === 'undefined')
          return;
      }
      switch (group.algorithmType) {
        case 'sorted':
          const copy = group.item.sort((a, b) => {
            return a.x !== b.x ? a.x - b.x : a.y - b.y;
          });
          for (let i = 0; i < copy.length; i++) {
            const current = copy[i];
            const next = copy[i + 1];
            if (!next) {
              return;
            }
            current.detection(next);
          }
          break;
        default:
        case 'all':
          for (let i = 0; i < group.item.length; i++) {
            const item1 = group.item[i];
            for (let j = i + 1; j < group.item.length; j++) {
              const item2 = group.item[j];
              item1.detection(item2);
            }
          }
      }


    })
  }

  removeGroup(index: number): void {
    const findGroup = this.groups.findIndex(f => f.id === index);
    if (findGroup >= 0) {
      this.groups.splice(findGroup, 1);
    }
  }

  removeItemFromGroup(item: CanCollide, groupIndex: number): void {
    const findGroup = this.groups.findIndex(f => f.id === groupIndex);
    if (findGroup >= 0) {
      const group = this.groups[findGroup].item;
      const findItem = group.findIndex(f => f.collisionId === item.collisionId);
      if (findItem >= 0) {
        group.splice(findItem, 1);
      }
    }
  }

}