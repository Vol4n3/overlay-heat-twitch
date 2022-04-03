import {Scene2d, Scene2DItem} from './scene2d';
import {IPoint2} from '../../types/point.types';
import {Vector2} from '../geometry/vector2';

interface WithId<T> {
  id: number
  item: T,
}

export interface CollisionResponse {
  normal?: Vector2
  point?: IPoint2,
}

export interface CanCollide extends IPoint2 {
  detection(test: CanCollide): CollisionResponse | null;

  response(collide: CanCollide, info: CollisionResponse): void;
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

  update(scene: Scene2d, time: number): void {
    this.groups.forEach((group) => {
      const copy = group.item.map(i => i.item).sort((a, b) => a.x - b.x);
      for (let i = 0; i < copy.length; i++) {
        const current = copy[i];
        const next = copy[i + 1];
        if (!next) {
          return;
        }
        const detect = current.detection(next);
        if (detect === null) {
          return;
        }
        current.response(next, detect);
      }
    })
  }

  removeGroup(index: number): void {
    const findGroup = this.groups.findIndex(f => f.id === index);
    if (findGroup >= 0) {
      this.groups.splice(findGroup, 1);
    }
  }

  removeItemFromGroup(itemIndex: number, groupIndex: number): void {
    const findGroup = this.groups.findIndex(f => f.id === groupIndex);
    if (findGroup >= 0) {
      const findItem = this.groups.findIndex(f => f.id === groupIndex);
      if (findItem >= 0) {
        this.groups[findGroup].item.splice(findItem, 1);
      }
    }
  }

}