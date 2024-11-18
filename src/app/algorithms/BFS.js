// Function to perform Breadth-First Search (BFS) on a grid
export function BFS(grid, startCell, endCell) {
  // Declaring variables to record the start time and end time
  let startTime = Date.now();
  let endTime;

  // Declaring a queue (array) and visited cells to track the traversal and target search
  let unvisitedCellsQueue = [startCell];
  let visitedCells = [];

  // Marking the start cell as visited initially
  startCell.isVisited = true;

  // If the queue is not empty: loop runs as long as there are unvisited cells in the queue
  while (unvisitedCellsQueue.length > 0) {
    let currentCell = unvisitedCellsQueue.shift(); // to process cells in FIFO order

    // If currentCell is null (which shouldn't happen in normal circumstances), the function returns
    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // Extracting cell properties for easier access
    const { col, row, cellNumber } = currentCell;

    // Adding the current cell to the visited list
    visitedCells.push(currentCell);

    // Checking if the target cell is found
    if (cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true; // Marked as the target cell
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // Traversing for each neighbor (right, up, down, left) within the boundary, not a wall, and not visited
    // Right
    if (
      col + 1 < grid[0].length &&
      !grid[row][col + 1].isWall &&
      !grid[row][col + 1].isVisited
    ) {
      grid[row][col + 1].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row][col + 1]); // Adding the cell to the queue
      grid[row][col + 1].isVisited = true; // Marking the cell as visited
    }

    // Up
    if (
      row - 1 >= 0 &&
      !grid[row - 1][col].isWall &&
      !grid[row - 1][col].isVisited
    ) {
      grid[row - 1][col].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row - 1][col]);
      grid[row - 1][col].isVisited = true; // Marking the cell as visited
    }

    // Down
    if (
      row + 1 < grid.length &&
      !grid[row + 1][col].isWall &&
      !grid[row + 1][col].isVisited
    ) {
      grid[row + 1][col].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row + 1][col]);
      grid[row + 1][col].isVisited = true; // Marking the cell as visited
    }

    // Left
    if (
      col - 1 >= 0 &&
      !grid[row][col - 1].isWall &&
      !grid[row][col - 1].isVisited
    ) {
      grid[row][col - 1].previousCell = currentCell;
      unvisitedCellsQueue.push(grid[row][col - 1]);
      grid[row][col - 1].isVisited = true; // Marking the cell as visited
    }
  }

  // If the BFS fails to find the target (all possible cells are visited but the target is not found), the function returns after the loop completes
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
}

