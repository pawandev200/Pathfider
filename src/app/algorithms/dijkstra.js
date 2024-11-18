import { getCells } from "../../utils/helpers";

// Function to get unvisited neighbors of the current cell
const getNeighbors = (currentCell, grid) => {
  const neighbors = []; // Array to hold neighboring cells
  const { col, row } = currentCell;

  // Checking for valid neighbors (left, right, up, down)
  if (col > 0) neighbors.push(grid[row][col - 1]); /
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); /
  if (row > 0) neighbors.push(grid[row - 1][col]); 
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); 

  // Return neighbors that are neither visited nor walls
  return neighbors.filter((n) => !n?.isVisited && !n?.isWall);
};

// Function to update neighbors' distances and previous cell
const traverseFurtherInGrid = (currentCell, grid) => {
  let remainingNeighbors = getNeighbors(currentCell, grid);

  // For each unvisited neighbor, calculate the distance and update the previous cell
  for (let cell of remainingNeighbors) {
    const newDistance = currentCell.distanceFromStart + 1;
    if (newDistance < cell.distanceFromStart) {
      cell.distanceFromStart = newDistance;
      cell.previousCell = currentCell;
    }
  }
};

// Function to execute Dijkstra's algorithm
export const dijkstra = (grid, startCell, endCell) => {
  // Declaring variables to record the start time and end time
  const startTime = Date.now();
  let endTime;

  // Initializing all cells in the grid
  let unvisitedCells = getCells(grid); // Flattened array of cells
  for (let cell of unvisitedCells) {
    cell.distanceFromStart = Infinity; // Set distance to infinity for all cells initially
    cell.previousCell = null; // Reset the previous cell for all cells
  }
  startCell.distanceFromStart = 0; // Distance from start cell to itself is 0

  const visitedCells = []; // Array to store visited cells

  // If there are unvisited cells, continue the loop
  while (unvisitedCells.length > 0) {
    // Sort unvisited cells by distance to find the closest cell
    // Sort by distance to simulate a priority queue
    unvisitedCells.sort(
      (cellA, cellB) => cellA.distanceFromStart - cellB.distanceFromStart
    );

    // Extract the closest cell from the unvisited cells
    const currentCell = unvisitedCells.shift();

    // If currentCell is null or unreachable (distance is Infinity), terminate the algorithm
    if (!currentCell || currentCell.distanceFromStart === Infinity) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // If the current cell is a wall, skip it
    if (currentCell.isWall) continue;

    // Mark the current cell as visited and add it to the visited cells array
    currentCell.isVisited = true;
    visitedCells.push(currentCell);

    // If the current cell is the target cell, terminate the algorithm
    if (currentCell.cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true; // Mark the target cell
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // Update distances for all unvisited neighbors of the current cell
    traverseFurtherInGrid(currentCell, grid);
  }

  // If the algorithm completes without finding the target, return the visited cells and time
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
};


