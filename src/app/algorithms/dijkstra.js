import { getCells } from "../../utils/helpers";

const getNeighbors = (currentCell, grid) => {
  const neighbors = [];
  const { col, row } = currentCell;

  if (col > 0) neighbors.push(grid[row][col - 1]);

  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  if (row > 0) neighbors.push(grid[row - 1][col]);

  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

  return neighbors.filter((n) => !n?.isVisited);
};

const traverseFurtherInGrid = (currentCell, grid) => {
  let remainingNeighbors = getNeighbors(currentCell, grid);
  for (let cell of remainingNeighbors) {
    cell.distanceFromStart = currentCell.distanceFromStart + 1;
    cell.previousCell = currentCell;
  }
};

export const dijkstra = (grid, startCell, endCell) => {
  let startTime = Date.now();
  let endTime;
  let unvisitedCells = getCells(grid); // clone
  startCell.distanceFromStart = 0;
  let visitedCells = [];
  while (!!unvisitedCells.length) {
    unvisitedCells.sort(
      (cellA, cellB) => cellA.distanceFromStart - cellB.distanceFromStart
    );
    let currentCell = unvisitedCells.shift(); // remove 1st cell

    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }
    if (currentCell?.isWall) continue; // ignore walls
    if (currentCell?.distanceFromStart === Infinity) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    } // the walls are closed
    currentCell.isVisited = true;
    visitedCells.push(currentCell);
    if (currentCell.cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true;
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }
    traverseFurtherInGrid(currentCell, grid);
  }
};
