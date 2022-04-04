import {Scene2d, Scene2DItem} from './scene2d';
import {IPoint2} from '../../types/point.types';

interface WithId<T> {
  id: number
  item: T,
}

export interface CanCollide extends IPoint2 {
  collisionId: number
  detection(item: CanCollide): void;
}

export class Collider implements Scene2DItem {
  sceneId: number = 0;
  scenePriority: number = 0;

  update(scene: Scene2d, time: number): void {
    this.groups.forEach((group) => {
      const copy = group.item.sort((a, b) => a.x - b.x);
      for (let i = 0; i < copy.length; i++) {
        const current = copy[i];
        const next = copy[i + 1];
        if (!next) {
          return;
        }
        current.detection(next);
      }
    })
  }

  private uid = 0;

  addGroup(): number {
    this.uid++;
    this.groups.push({item: [], id: this.uid});
    return this.uid;
  }

  private groups: WithId<CanCollide[]>[] = [];

  draw(scene: Scene2d, time: number): void {
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