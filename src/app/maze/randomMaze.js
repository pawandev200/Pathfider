import { getCells } from "../../utils/helpers"; // Import helper function to get all cells in the grid

// Function to generate a random maze
export const generateRandomMaze = (grid) => {
  let grid1DArray = getCells(grid); // Convert the 2D grid into a 1D array of cells

  // Iterate through each cell in the 1D array
  for (let rowIndex = 0; rowIndex < grid1DArray.length; rowIndex++) {
    let element = grid1DArray[rowIndex]; // Get the current cell

    // Skip the start and end points
    if (element.isStartPoint || element.isEndPoint) continue;

    // Randomly determine if the current cell should be a wall
    // The condition checks if the cell number modulo a random number (1 to 10) equals 0, Math.ceil(Math.random() * 10): [1,10]
    element.isWall = element.cellNumber % Math.ceil(Math.random() * 10) === 0;
  }
};
