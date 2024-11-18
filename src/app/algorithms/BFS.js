// Function to perform Breadth-First Search (BFS) on a grid
export function BFS(grid, startCell, endCell) {
  // declearing variables to record the start time and end time
  let startTime = Date.now();
  let endTime;

  //declearing a queue (array) and visited cell to track the cell while traversing and finding target
  let unvisitedCellsQueue = [startCell];
  let visitedCells = [];

  startCell.isVisited = true;

  //if queue is not empty: loop runs as long as there are unvisited cells in the queue.
  while (unvisitedCellsQueue.length > 0) {
    let currentCell = unvisitedCellsQueue.pop(); 

    // If currentCell is null (which shouldn't happen in normal circumstances), the function returns
    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }
   // else extracting cell properties for easier access
    const { col, row, cellNumber, isVisited } = currentCell;

    if (cellNumber !== startCell.cellNumber && isVisited) continue; // If the cell has already been visited (except the start cell)

    visitedCells.push(currentCell); //else marking as visited

    //checking if targer found
    if (cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true;  //it is marked as the target cell
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    //now traversing for each neighbour(right, up, down, left) within the boundry, not wall and not visited
    if (
      col + 1 < grid[0].length &&
      !grid[row][col + 1].isWall &&
      !grid[row][col + 1].isVisited
    ) {
      grid[row][col + 1].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row][col + 1]);
      currentCell.isVisited = true;
    }

    if (
      row - 1 >= 0 &&
      !grid[row - 1][col].isWall &&
      !grid[row - 1][col].isVisited
    ) {
      grid[row - 1][col].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row - 1][col]);
      currentCell.isVisited = true;
    }

    if (
      row + 1 < grid.length &&
      !grid[row + 1][col].isWall &&
      !grid[row + 1][col].isVisited
    ) {
      grid[row + 1][col].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row + 1][col]);
      currentCell.isVisited = true;
    }

    if (
      col - 1 >= 0 &&
      !grid[row][col - 1].isWall &&
      !grid[row][col - 1].isVisited
    ) {
      grid[row][col - 1].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row][col - 1]);
      currentCell.isVisited = true;
    }
  }
  // If the BFS fails to find the target (all possible cells are visited but target not found), the function returns after the loop completes.
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
}
