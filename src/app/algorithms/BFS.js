// Function to perform Breadth-First Search (BFS) on a grid
export function BFS(grid, startCell, endCell) {
  let startTime = Date.now(); // Record start time
  let endTime;

  let unvisitedCellsQueue = [startCell]; // Queue for BFS
  let visitedCells = []; // Track visited cells

  startCell.isVisited = true; // Mark the start cell as visited

  // While the queue is not empty
  while (unvisitedCellsQueue.length > 0) {
    let currentCell = unvisitedCellsQueue.shift(); // Dequeue the first cell

    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime]; // Return if the current cell is null
    }

    const { col, row, cellNumber } = currentCell; // Extract cell properties

    visitedCells.push(currentCell); // Add current cell to the visited list

    if (cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true; // Mark the target cell
      endTime = Date.now();
      return [visitedCells, endTime - startTime]; // Return the path and time
    }

    // Check the right neighbor
    if (
      col + 1 < grid[0].length &&
      !grid[row][col + 1].isWall &&
      !grid[row][col + 1].isVisited
    ) {
      grid[row][col + 1].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row][col + 1]);
      grid[row][col + 1].isVisited = true;
    }

    // Check the top neighbor
    if (
      row - 1 >= 0 &&
      !grid[row - 1][col].isWall &&
      !grid[row - 1][col].isVisited
    ) {
      grid[row - 1][col].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row - 1][col]);
      grid[row - 1][col].isVisited = true;
    }

    // Check the bottom neighbor
    if (
      row + 1 < grid.length &&
      !grid[row + 1][col].isWall &&
      !grid[row + 1][col].isVisited
    ) {
      grid[row + 1][col].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row + 1][col]);
      grid[row + 1][col].isVisited = true;
    }

    // Check the left neighbor
    if (
      col - 1 >= 0 &&
      !grid[row][col - 1].isWall &&
      !grid[row][col - 1].isVisited
    ) {
      grid[row][col - 1].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row][col - 1]);
      grid[row][col - 1].isVisited = true;
    }
  }

  endTime = Date.now();
  return [visitedCells, endTime - startTime]; // Return visited cells and execution time
}


