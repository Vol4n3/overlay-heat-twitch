import {Scene2d, Scene2DItem} from './scene2d';
import {IPoint2} from '../../types/point.types';

interface WithId<T> {
  id: number
  item: T,
}

export interface CanCollide extends IPoint2 {
  detection(item: CanCollide): void;
}

export class Collider implements Scene2DItem {
  private groups: WithId<WithId<CanCollide>[]>[] = [];
  private uid = 0;

  addGroup(): number {
    this.uid++;
    this.groups.push({item: [], id: this.uid});
    return this.uid;
  }

  addItemToGroup(item: CanCollide, groupId: number): number {
    const findGroup = this.groups.findIndex(f => f.id === groupId);

    if (findGroup >= 0) {
      this.uid++;
      this.groups[findGroup].item.push({item, id: this.uid});
      return this.uid;
    }
    throw new Error('impossible de trouver le groupe pour ajouter un item');
  }

  draw(scene: Scene2d, time: number): void {
  }

  removeItemFromGroup(itemIndex: number, groupIndex: number): void {
    const findGroup = this.groups.findIndex(f => f.id === groupIndex);
    if (findGroup >= 0) {
      const group = this.groups[findGroup].item;
      const findItem = group.findIndex(f => f.id === itemIndex);
      if (findItem >= 0) {
        group.splice(findItem, 1);
      }
    }
  }

  removeGroup(index: number): void {
    const findGroup = this.groups.findIndex(f => f.id === index);
    if (findGroup >= 0) {
      this.groups.splice(findGroup, 1);
    }
  }

  update(scene: Scene2d, time: number): void {
    this.groups.forEach((group) => {
      const copy = group.item.map(i => i.item).sort((a, b) => a.x - b.x);
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

}