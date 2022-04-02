import {Scene2d, Scene2DItem} from './scene2d';

interface WithId<T> {
  id: number
  item: T,
}

export interface CanCollide {

}

export class Collider implements Scene2DItem {
  public groups: WithId<WithId<CanCollide>[]>[] = [];
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