// JavaScript representation of CellInterface
// Used to describe the structure of a cell in the grid
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
  isTarget: false, // Optional, can be omitted
};

// Enum representation for searching algorithms in JavaScript
const SearchingAlgoEnum = {
  DIJKSTRA: "DIJKSTRA",
  BFS: "BFS",
  DFS: "DFS",
};

// JavaScript representation of AlgorithmOption
// Describes an algorithm option with its name, type, and a click handler
const AlgorithmOption = {
  name: "", // Name of the algorithm
  type: SearchingAlgoEnum.DIJKSTRA, // Type should be one of the values in SearchingAlgoEnum
  onClick: () => {}, // Function to handle clicks
};
