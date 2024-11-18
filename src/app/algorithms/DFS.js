// Function to execute Depth-First Search (DFS)
export const DFS = (grid, startCell, endCell) => {
  // Declaring variables to record the start time and end time
  let startTime = Date.now();
  let endTime;

  // Initializing a stack with the starting cell for DFS traversal
  let unvisitedCellsStack = [startCell];
  let visitedCells = [];

  startCell.isVisited = true; // Marking the start cell as visited

  // Loop runs as long as there are cells in the stack
  while (unvisitedCellsStack.length > 0) {
    // Accessing the last added cell (LIFO) for DFS traversal
    let currentCell = unvisitedCellsStack.shift();

    // If no valid cell is found, return visited cells and elapsed time
    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // Extracting cell properties for easier access
    const { col, row, cellNumber, isVisited } = currentCell;

    // Skip already visited cells (except the start cell)
    if (cellNumber !== startCell.cellNumber && isVisited) continue;

    // Adding the current cell to the visited cells array
    visitedCells.push(currentCell);

    // Checking if the current cell is the target
    if (cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true; // Marking the target cell
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    // Traversing neighbors (right, down, left, up) until a wall is hit or no further cells
    if (
      col + 1 < grid[0].length && 
      !grid[row][col + 1].isWall && 
      !grid[row][col + 1].isVisited 
    ) {
      grid[row][col + 1].previousCell = currentCell; 
      unvisitedCellsStack.unshift(grid[row][col + 1]); 
      currentCell.isVisited = true; 
    }

    if (
      row + 1 < grid.length && 
      !grid[row + 1][col].isWall && 
      !grid[row + 1][col].isVisited 
    ) {
      grid[row + 1][col].previousCell = currentCell; 
      unvisitedCellsStack.unshift(grid[row + 1][col]); 
      currentCell.isVisited = true; 
    }

    if (
      col - 1 >= 0 && 
      !grid[row][col - 1].isWall && 
      !grid[row][col - 1].isVisited 
    ) {
      grid[row][col - 1].previousCell = currentCell; 
      unvisitedCellsStack.unshift(grid[row][col - 1]); 
      currentCell.isVisited = true; 
    }

    if (
      row - 1 >= 0 && // Ensure within grid bounds
      !grid[row - 1][col].isWall && // Ensure it's not a wall
      !grid[row - 1][col].isVisited // Ensure it's not visited
    ) {
      grid[row - 1][col].previousCell = currentCell; // Track the previous cell
      unvisitedCellsStack.unshift(grid[row - 1][col]); // Add to stack (LIFO)
      currentCell.isVisited = true; // Mark as visited
    }
  }

  // If DFS fails to find the target, return after the loop completes
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
};

