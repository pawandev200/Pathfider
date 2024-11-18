import { getCells } from "../../utils/helpers";

const getNeighbors = (currentCell, grid) => {
  const neighbors = [];
  const { col, row } = currentCell;

  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down

  return neighbors.filter((n) => !n?.isVisited && !n?.isWall);
};

const traverseFurtherInGrid = (currentCell, grid, unvisitedCells) => {
  let remainingNeighbors = getNeighbors(currentCell, grid);
  for (let cell of remainingNeighbors) {
    const newDistance = currentCell.distanceFromStart + 1;
    if (newDistance < cell.distanceFromStart) {
      cell.distanceFromStart = newDistance;
      cell.previousCell = currentCell;
    }
  }
};

export const dijkstra = (grid, startCell, endCell) => {
  const startTime = Date.now();
  let endTime;

  // Initialize all cells
  let unvisitedCells = getCells(grid); // Create a clone or flattened list
  for (let cell of unvisitedCells) {
    cell.distanceFromStart = Infinity;
    cell.previousCell = null;
  }
  startCell.distanceFromStart = 0;

  const visitedCells = [];

  while (unvisitedCells.length > 0) {
    // Sort by distance to simulate a priority queue
    unvisitedCells.sort(
      (cellA, cellB) => cellA.distanceFromStart - cellB.distanceFromStart
    );

    // Take the closest cell
    const currentCell = unvisitedCells.shift();

    if (!currentCell || currentCell.distanceFromStart === Infinity) {
      // No path exists
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    if (currentCell.isWall) continue; // Skip walls
    currentCell.isVisited = true;
    visitedCells.push(currentCell);

    if (currentCell.cellNumber === endCell.cellNumber) {
      // Target reached
      currentCell.isTarget = true;
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // Traverse neighbors
    traverseFurtherInGrid(currentCell, grid, unvisitedCells);
  }

  // No path found
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
};

