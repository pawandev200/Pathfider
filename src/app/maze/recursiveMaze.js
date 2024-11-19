import {
  generateOddRandomNumber,
  generateRandomNumberWithin,
} from "../../utils/helpers";

// placing walls at a specific row or column except start and finish cell according to the direction
// it returns a list that contain cells where we can place the wall
const addWalls = (
  grid,
  direction,
  num,
  horizontal, //array of column indices (for vertical wall placement).
  vertical, //array of row indices (for horizontal wall placement).
  startNode,
  finishNode
) => {
  let isStartFinish = false; // Flag to check if start or finish nodes are in the wall path
  let cellToBeWall = []; // Array to hold cells where walls will be added

  if (direction === "up-down") {
    // Add vertical walls at column `num`
    if (vertical.length === 2) return; // Stop if no more rows to divide
    for (let cellRow of vertical) {
      // Skip if wall intersects start or finish node
      if (
        (cellRow === startNode?.row && num === startNode?.col) ||
        (cellRow === finishNode?.row && num === finishNode?.col)
      ) {
        isStartFinish = true;
        continue;
      }
      //Otherwise wall will be placed on the current row
      cellToBeWall.push([cellRow, num]); 
    }
  } else {
    // Add horizontal walls at row `num`
    if (horizontal.length === 2) return; // Stop if no more columns to divide
    for (let cellCol of horizontal) {
      // Skip if wall intersects start or finish node
      if (
        (num === startNode?.row && cellCol === startNode?.col) ||
        (num === finishNode?.row && cellCol === finishNode?.col)
      ) {
        isStartFinish = true;
        continue;
      }
      //Otherwise wall will be placed on the current row
      cellToBeWall.push([num, cellCol]); 
    }
  }

  // Add a gap in the wall for the path to ensure the maze is solvable.
  //  randomly picks one of the cells in the cellToBeWall array and removes it, leaving a gap.
  if (!isStartFinish) {
    let rand = generateRandomNumberWithin(cellToBeWall.length);
    cellToBeWall = [
      ...cellToBeWall.slice(0, rand),
      ...cellToBeWall.slice(rand + 1),
    ];
  }

  // Mark wall as cells in the grid
  for (let wall of cellToBeWall) {
    grid[wall[0]][wall[1]].isWall = true;
  }
};

// recursively dividing the grid into smaller sections by placing walls
const setRecursiveWalls = (
  horizontal,
  vertical,
  grid,
  startNode,
  finishNode
) => {
  if (horizontal.length < 2 || vertical.length < 2) return; // Stop recursion if no more sections to divide

  let direction = "up-down"; // Default direction for wall placement
  let num = 0;
//calculations:
  // Choose direction and position for wall based on grid dimensions
  if (horizontal.length > vertical.length) {
    direction = "up-down";
    num = generateOddRandomNumber(horizontal); // Choose a row index
  } else {
    direction = "right-left";
    num = generateOddRandomNumber(vertical); // Choose a column index
  }
//recursive calls:
  // Place wall and divide grid recursively
  if (direction === "up-down") {
    addWalls(grid, direction, num, horizontal, vertical, startNode, finishNode); // Add vertical wall
    setRecursiveWalls(
      horizontal.slice(0, horizontal.indexOf(num)), // Divide top section
      vertical,
      grid,
      startNode,
      finishNode
    );
    setRecursiveWalls(
      horizontal.slice(horizontal.indexOf(num) + 1), // Divide bottom section
      vertical,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWalls(grid, direction, num, horizontal, vertical, startNode, finishNode); // Add horizontal wall
    setRecursiveWalls(
      horizontal,
      vertical.slice(0, vertical.indexOf(num)), // Divide left section
      grid,
      startNode,
      finishNode
    );
    setRecursiveWalls(
      horizontal,
      vertical.slice(vertical.indexOf(num) + 1), // Divide right section
      grid,
      startNode,
      finishNode
    );
  }
};

export const generateRecursiveMaze = (
  grid,
  startNode,
  finishNode
) => {
  // Initialize arrays for rows (vertical) and columns (horizontal)
  let horizontal = Array(grid[0].length)
    .fill("_")   //["_", "_", "_", "_", "_"]
    .map((_, i) => i);  // Replace each "_" with its index(i).: [0, 1, 2, 3, 4]
  let vertical = Array(grid.length)
    .fill("_")
    .map((_, i) => i);

  // Start recursive wall generation
  setRecursiveWalls(horizontal, vertical, grid, startNode, finishNode);
};

