import {FC, useEffect, useRef} from 'react';
import {ContainerScene} from '../../components/ui/container-scene';
import {Scene2d} from '../../2d/core/scene2d';
import {Cell} from './cell';

export const MinesweeperGame: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container);
    const marge = 50;
    const squareSize = 25;
    const squareBorder = 1;
    const storeCells: Cell[][] = [];
    const addCount = (x: number, y: number) => {
      const top = storeCells[y - 1];
      if (typeof top !== 'undefined') {
        top[x - 1]?.incrementNearMine();
        top[x]?.incrementNearMine();
        top[x + 1]?.incrementNearMine();
      }
      const currentRow = storeCells[y];
      currentRow[x - 1]?.incrementNearMine();
      currentRow[x + 1]?.incrementNearMine();
      const bottom = storeCells[y + 1];
      if (typeof bottom !== 'undefined') {
        bottom[x - 1]?.incrementNearMine();
        bottom[x]?.incrementNearMine();
        bottom[x + 1]?.incrementNearMine();
      }

    }
    for (let row = marge; row < scene.canvas.width - marge; row += squareSize + squareBorder) {
      const lineCell = [];
      for (let col = marge; col < scene.canvas.height - marge; col += squareSize + squareBorder) {
        const cell = new Cell(row, col, squareSize, squareBorder);
        scene.addItem(cell);
        lineCell.push(cell);
      }
      storeCells.push(lineCell);
    }
    for (let y = 0; y < storeCells.length; y++) {
      const row = storeCells[y];
      for (let x = 0; x < row.length; x++) {
        const isMine = Math.random() < 0.15;
        const cell = row[x];
        if (isMine) {
          cell.hasMine = true;
          addCount(x, y);
        }
      }
    }
  }, [containerRef])
  return <ContainerScene ref={containerRef}/>
}