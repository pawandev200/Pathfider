// Used to describe the structure and default values of a cell in the grid
const CellInterface = {
  cellNumber: 0,
  col: 0,
  row: 0,
  isVisited: false,
  isWall: false,
  isStartPoint: false,
  isEndPoint: false,
  distanceFromStart: Infinity,
  previousCell: null, // Can be another cell object or null
  isTarget: false, 
};

// Enumerates the supported searching algorithms
const SearchingAlgoEnum = {
  DIJKSTRA: "DIJKSTRA",
  BFS: "BFS",
  DFS: "DFS",
};

// Describes an option for selecting and interacting with algorithms in the UI
// Describes an algorithm option with its name, type, and a click handler
const AlgorithmOption = {
  name: "", // Name of the algorithm
  type: SearchingAlgoEnum.DIJKSTRA, // Type should be one of the values in SearchingAlgoEnum
  onClick: () => {}, // Function to handle clicks
};
