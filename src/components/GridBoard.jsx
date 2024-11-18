import React, { useEffect, useRef, useState } from "react";
import { getCellObjects, getPath } from "../utils/helpers"; // Import helper functions
import Cell from "./Cell"; // Import Cell component
import { InfoSideOver } from "./InfoSideover"; // Import information side overlay component
import StatsSection from "./StatsSection"; // Import stats display component
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ArrowRightIcon,
  RectangleGroupIcon,
  CalendarIcon,
  MapPinIcon,
  ForwardIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline"; // Import icons for UI
import { GithubLogo } from "./GithubLogo"; // Import GitHub logo component
import AlgoSelect from "./AlgoSelect"; // Import algorithm selection dropdown
import {
  dijkstra,
  DFS,
  BFS,
  generateRandomMaze,
  generateRecursiveMaze,
} from "../app/index"; // Import algorithms and maze generation methods

const GridBoard = () => {
  // Reference to the grid state
  const gridBoardCells = useRef(getCellObjects());

  // State variables
  const [startPoint, setStartPoint] = useState(null); // Starting point of the path
  const [endPoint, setEndPoint] = useState(null); // Ending point of the path
  const [foundPath, setFoundPath] = useState(null); // Found path after algorithm execution
  const [cellsScanned, setCellsScanned] = useState(0); // Number of cells scanned
  const [cellsTraveled, setCellsTraveled] = useState(0); // Number of cells in the found path
  const [timeTaken, setTimeTaken] = useState(0); // Time taken by the algorithm
  const [isMouseDown, setIsMouseDown] = useState(false); // Tracks if the mouse is pressed
  const [renderFlag, setRenderFlag] = useState(false); // Trigger re-renders
  const [selectedAlgo, setSelectedAlgo] = useState(null); // Currently selected algorithm
  const [showInfoOf, setShowInfoOf] = useState(null); // Determines which algorithm info to show
  const [speed, setSpeed] = useState("medium"); // Speed of visualization

  // Get speed multiplier for animations based on selected speed
  const getSpeedMultiplier = () => {
    switch (speed) {
      case "fast":
        return { algorithm: 3, path: 15 }; // Fast animation
      case "medium":
        return { algorithm: 10, path: 20 }; // Medium animation
      case "slow":
        return { algorithm: 100, path: 125 }; // Slow animation
    }
  };

  // Reset the visual state of the board
  const resetBoardData = () => {
    document.querySelectorAll(`.cell`).forEach((item) => {
      if (item.classList.contains("cell-visited")) {
        item.classList.remove("cell-visited");
      }
      if (item.classList.contains("cell-path")) {
        item.classList.remove("cell-path");
      }
    });
    setFoundPath(null);
    setCellsScanned(0);
    setCellsTraveled(0);
    setTimeTaken(0);
  };

  // Clear the entire grid including walls and paths
  const clearBoard = () => {
    gridBoardCells.current = getCellObjects(true, true, gridBoardCells.current);
    resetBoardData();
  };

  // Clear only the path, keep walls intact
  const clearPath = () => {
    gridBoardCells.current = getCellObjects(
      true,
      false,
      gridBoardCells.current
    ); // Only reset path data
    resetBoardData();
  };

  // Handle mouse enter event on cells (for drawing walls)
  const onMouseEnter = (rowIndex, colIndex) => {
    setRenderFlag(!renderFlag); // Trigger re-render
    let element = gridBoardCells.current[rowIndex];
    if (!isMouseDown) return; // If mouse is not pressed, do nothing
    if (element[colIndex].isStartPoint || element[colIndex].isEndPoint) return; // Ignore start and end points

    element[colIndex].isWall = !element[colIndex].isWall; // Toggle wall state
  };

  // Handle cell click event
  const onCellClick = (cell, rowIndex, colIndex) => {
    let clickedCell = gridBoardCells.current[rowIndex][colIndex];
    if (clickedCell.isWall) {
      clickedCell.isWall = false; // Remove wall if clicked on a wall
      return;
    }
    if (cell.cellNumber === startPoint?.cellNumber) {
      setStartPoint(null); // Reset start point
      clickedCell.isStartPoint = false;
      clickedCell.distanceFromStart = Infinity;
      return;
    }
    if (cell.cellNumber === endPoint?.cellNumber) {
      setEndPoint(null); // Reset end point
      clickedCell.isEndPoint = false;
      return;
    }

    if (startPoint && endPoint) {
      clickedCell.isWall = true; // If both start and end are set, toggle wall
      return;
    }
    if (!startPoint) {
      // Set the start point
      setStartPoint({
        ...clickedCell,
        isStartPoint: true,
        distanceFromStart: 0,
      });
      clickedCell.isStartPoint = true;
      clickedCell.distanceFromStart = 0;
    } else if (startPoint) {
      // Set the end point
      setEndPoint({
        ...clickedCell,
        isEndPoint: true,
      });
      clickedCell.isEndPoint = true;
    }
  };

  // Animate cells visited during the algorithm execution
  const animateAlgo = (visitedCells, path) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item.className += " cell-visited"; // Mark cell as visited
        if (cell.isTarget) {
          setFoundPath(path); // Save found path
        }
      }, (getSpeedMultiplier().algorithm || 10) * i); // Use speed multiplier
    }
  };

  // Animate the final path
  const animatePath = (path) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const cell = path[i];
        setCellsTraveled(i + 1); // Update traveled cells count
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item.className += " cell-path"; // Mark cell as part of the path
      }, (getSpeedMultiplier().path || 25) * i); // Use speed multiplier
    }
  };

  // Execute and visualize the selected algorithm
  const visualizeAlgo = (type) => {
    if (!startPoint || !endPoint) {
      alert("Please mark starting and ending point"); // Show alert if points are missing
      return;
    }
    let grid = gridBoardCells.current;
    let start = grid[startPoint.row][startPoint.col];
    let end = grid[endPoint.row][endPoint.col];
    let visitedCells = [];
    switch (type) {
      case "DIJKSTRA":
        let [dCells, DTime] = dijkstra(grid, start, end) || [];
        visitedCells = dCells || [];
        setTimeTaken(DTime || 0);
        break;
      case "DFS":
        let [DFSCells, DFSTime] = DFS(grid, start, end) || [];
        visitedCells = DFSCells || [];
        setTimeTaken(DFSTime || 0);
        break;
      case "BFS":
        let [BFSCells, BFSTime] = BFS(grid, start, end) || [];
        visitedCells = BFSCells || [];
        setTimeTaken(BFSTime || 0);
        break;
    }
    const path = getPath(end); // Get the path
    setCellsScanned(visitedCells.length); // Update scanned cells count
    animateAlgo(visitedCells, path); // Animate algorithm
  };

  // Effect to animate the path after it is found
  useEffect(() => {
    if (foundPath && startPoint && endPoint) {
      animatePath(foundPath);
    }
  }, [foundPath]);


  return (
    <>
      <InfoSideOver
        algorithm={showInfoOf}
        onClose={() => {
          setShowInfoOf(null);
        }}
      />
      <div className="bg-gray-900 pt-4">
        <div className="mx-auto flex max-w-7xl md:flex-row flex-col items-center justify-between">
          <div className="flex flex-1 flex-wrap md:flex-row flex-col gap-4 items-start md:items-center w-full justify-start space-x-4 mx-4">
            <AlgoSelect
              selectedAlgo={selectedAlgo}
              onSelect={setSelectedAlgo}
            />
            <button
              disabled={!selectedAlgo}
              onClick={() =>
                selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
              }
              className="items-center w-fit disabled:bg-indigo-400 disabled:cursor-not-allowed inline-flex bg-indigo-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-2" />{" "}
              {selectedAlgo
                ? `Visualize ${selectedAlgo?.name}`
                : "Select an algorithm"}
            </button>
            <button
              onClick={() => {
                clearBoard();
                setRenderFlag(!renderFlag);
              }}
              className="items-center w-fit disabled:bg-green-500 disabled:cursor-not-allowed inline-flex bg-green-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <CalendarIcon className="h-5 w-5 mr-2" /> Clear board
            </button>

            <button
              onClick={() => {
                clearPath();
              }}
              className="items-center w-fit disabled:bg-green-500 disabled:cursor-not-allowed inline-flex bg-green-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <MapPinIcon className="h-5 w-5 mr-2" /> Clear path
            </button>

            <button
              onClick={() => {
                setSpeed(
                  speed === "fast"
                    ? "medium"
                    : speed === "medium"
                    ? "slow"
                    : "fast"
                );
              }}
              className="items-center w-fit disabled:bg-red-400 disabled:cursor-not-allowed inline-flex bg-red-500 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <ForwardIcon className="h-5 w-5 mr-2" /> Speed: {speed}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-900">
        <div className="flex md:gap-0 flex-wrap gap-4 flex-1 pt-4 max-w-7xl md:flex-row flex-col items-start md:items-center justify-start space-x-4 mx-auto">
          <button
            className="items-center w-fit ml-4 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            onClick={() => {
              setRenderFlag(!renderFlag);
              clearBoard(); // just to be sure that board and path is cleared
              generateRandomMaze(gridBoardCells.current);
            }}
          >
            <CubeTransparentIcon className="h-5 w-5 mr-2" /> Generate random
            maze
          </button>
          <span
            className="md:block hidden h-6 w-px bg-gray-600"
            aria-hidden="true"
          />
          <button
            className="items-center w-fit disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            onClick={() => {
              setRenderFlag(!renderFlag);
              clearBoard(); // just to be sure that board and path is cleared
              generateRecursiveMaze(
                gridBoardCells.current,
                startPoint,
                endPoint
              );
            }}
          >
            <CubeTransparentIcon className="h-5 w-5 mr-2" /> Generate recursive
            maze
          </button>
          <span
            className="md:block hidden h-6 w-px bg-gray-600"
            aria-hidden="true"
          />

          <a
            href = {"https://github.com/pawandev200/Pathfinding---Visualizer"}
            target="_blank"
            className="items-center w-fit disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
          >
            <GithubLogo /> Source code
          </a>
          <span
            className="md:block hidden h-6 w-px bg-gray-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="w-full bg-gray-900 ">
        <div className="flex gap-6 justify-center max-w-7xl mx-auto items-center">
          <StatsSection
            stats={[
              {
                name: "Cells scanned",
                icon: MagnifyingGlassIcon,
                data: cellsScanned.toString(),
              },
              {
                name: "Cells traveled",
                icon: PaperAirplaneIcon,
                data: cellsTraveled.toString(),
              },
              {
                name: "Time taken",
                icon: ClockIcon,
                data: `${timeTaken?.toFixed(2)}ms`,
              },
            ]}
          />
        </div>
      </div>
      {selectedAlgo ? (
        <div className="flex my-3 w-full mx-auto justify-end max-w-7xl">
          <button
            className="mx-4 text-indigo-700 inline-flex items-center font-medium underline"
            onClick={() => {
              setShowInfoOf(selectedAlgo.type);
            }}
          >
            Know more about {selectedAlgo?.name}{" "}
            <ArrowRightIcon className="h-5 w-5 ml-1 font-bold" />
          </button>
        </div>
      ) : null}
      {/*Container div for the grid, using Tailwind classes for styling */}
      <div className="grid grid-cols-gridmap overflow-auto w-full px-4 justify-start md:justify-center items-center my-3">
        {/* Iterate over the rows of the grid */}
        {gridBoardCells.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {/* Iterate over the cells of the current row */}
              {row.map((cell, colIndex) => {
                return (
                   // Render the Cell component for each grid cell
                  <Cell
                    key={colIndex} // Unique key for the cell, based on its column index
                    id={`cell-${cell.row}-${cell.col}`} // Unique ID for each cell based on its position

                    // Set mouse down state to true when the user clicks on the cell
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    // Handle mouse entering the cell, triggering a callback with the row and column indices
                    onMouseEnter={() => {
                      onMouseEnter(rowIndex, colIndex);
                    }}
                    // Set mouse down state to false when the mouse button is released
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    // Handle cell click, allowing for specific cell interactions (e.g., setting start/end points or toggling walls)
                    onClick={() => {
                      onCellClick(cell, rowIndex, colIndex);
                    }}
                     // Pass the current cell data to the Cell component
                    {...cell}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default GridBoard;
