import React, { useEffect, useRef, useState } from "react"; 
import { getCellObjects, getPath } from "../utils/helpers"; // Helper functions for grid initialization and pathfinding
import Cell from "./Cell"; // Individual grid cell component
import { InfoSideOver } from "./InfoSideover"; // Side overlay for algorithm information
import StatsSection from "./StatsSection"; // Component for displaying stats
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
} from "@heroicons/react/24/outline"; // Icons for UI elements
import { GithubLogo } from "./GithubLogo"; // GitHub logo for source code link
import AlgoSelect from "./AlgoSelect"; // Dropdown for algorithm selection
import {
  dijkstra,
  DFS,
  BFS,
  generateRandomMaze,
  generateRecursiveMaze,
} from "../app/index"; // Pathfinding algorithms and maze generators

// Main GridBoard component
const GridBoard = () => {
  const gridBoardCells = useRef(getCellObjects()); // Grid state as a mutable ref
  const [startPoint, setStartPoint] = useState(null); // Start point
  const [endPoint, setEndPoint] = useState(null); // End point
  const [foundPath, setFoundPath] = useState(null); // Shortest path
  const [cellsScanned, setCellsScanned] = useState(0); // Number of visited cells
  const [cellsTraveled, setCellsTraveled] = useState(0); // Cells in the final path
  const [timeTaken, setTimeTaken] = useState(0); // Execution time
  const [isMouseDown, setIsMouseDown] = useState(false); // Mouse click state for drawing walls
  const [renderFlag, setRenderFlag] = useState(false); // Forces re-render
  const [selectedAlgo, setSelectedAlgo] = useState(null); // Currently selected algorithm
  const [showInfoOf, setShowInfoOf] = useState(null); // Algorithm info overlay
  const [speed, setSpeed] = useState("medium"); // Animation speed

  // Maps speed to animation delay values
  const getSpeedMultiplier = () => {
    switch (speed) {
      case "fast": return { algorithm: 3, path: 15 };
      case "medium": return { algorithm: 10, path: 20 };
      case "slow": return { algorithm: 100, path: 125 };
    }
  };

  // Resets visual and stats data
  const resetBoardData = () => {
    document.querySelectorAll(`.cell`).forEach((item) => {
      item.classList.remove("cell-visited", "cell-path");
    });
    setFoundPath(null);
    setCellsScanned(0);
    setCellsTraveled(0);
    setTimeTaken(0);
  };

  // Clears the entire grid
  const clearBoard = () => {
    gridBoardCells.current = getCellObjects(true, true, gridBoardCells.current);
    resetBoardData();
  };

  // Clears only the path (retains walls)
  const clearPath = () => {
    gridBoardCells.current = getCellObjects(true, false, gridBoardCells.current);
    resetBoardData();
  };

  // Handles mouse entering a cell (for drawing walls)
  const onMouseEnter = (rowIndex, colIndex) => {
    setRenderFlag(!renderFlag);
    let element = gridBoardCells.current[rowIndex];
    if (!isMouseDown) return;
    if (element[colIndex].isStartPoint || element[colIndex].isEndPoint) return;
    element[colIndex].isWall = !element[colIndex].isWall;
  };

  // Handles cell click (setting start/end points or toggling walls)
  const onCellClick = (cell, rowIndex, colIndex) => {
    let clickedCell = gridBoardCells.current[rowIndex][colIndex];
    if (clickedCell.isWall) {
      clickedCell.isWall = false;
      return;
    }
    if (cell.cellNumber === startPoint?.cellNumber) {
      setStartPoint(null);
      clickedCell.isStartPoint = false;
      clickedCell.distanceFromStart = Infinity;
      return;
    }
    if (cell.cellNumber === endPoint?.cellNumber) {
      setEndPoint(null);
      clickedCell.isEndPoint = false;
      return;
    }
    if (startPoint && endPoint) {
      clickedCell.isWall = true;
      return;
    }
    if (!startPoint) {
      setStartPoint({ ...clickedCell, isStartPoint: true, distanceFromStart: 0 });
      clickedCell.isStartPoint = true;
    } else if (startPoint) {
      setEndPoint({ ...clickedCell, isEndPoint: true });
      clickedCell.isEndPoint = true;
    }
  };

  // Animates algorithm progress
  const animateAlgo = (visitedCells, path) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item.className += " cell-visited";
        if (cell.isTarget) {
          setFoundPath(path);
        }
      }, (getSpeedMultiplier().algorithm || 10) * i);
    }
  };

  const animatePath = (path) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const cell = path[i];
        setCellsTraveled(i + 1);
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item.className += " cell-path";
      }, (getSpeedMultiplier().path || 25) * i);
    }
  };

  const visualizeAlgo = (type) => {
    if (!startPoint || !endPoint) {
      alert("Please mark starting and ending point");
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
    const path = getPath(end);
    setCellsScanned(visitedCells.length);
    animateAlgo(visitedCells, path);
  };

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
      <div className="grid grid-cols-gridmap overflow-auto w-full px-4 justify-start md:justify-center items-center my-3">
        {gridBoardCells.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell
                    key={colIndex}
                    id={`cell-${cell.row}-${cell.col}`}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onMouseEnter={() => {
                      onMouseEnter(rowIndex, colIndex);
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    onClick={() => {
                      onCellClick(cell, rowIndex, colIndex);
                    }}
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
