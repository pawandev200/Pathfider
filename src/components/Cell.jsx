import React from "react";
import { MapPinIcon, TrophyIcon } from "@heroicons/react/24/outline"; // Icons for start and end points

// The Cell component renders a grid cell with various states
// It defines the appearance and behavior of each cell in the grid.
const Cell = ({
  isStartPoint,
  isEndPoint,
  isWall,
  cellNumber,
  col,
  isVisited,
  row,
  previousCell,
  distanceFromStart,
  isTarget,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`cell lg:w-6 w-4 lg:h-6 h-4 inline-flex justify-center items-center aspect-square border-[0.1px] border-indigo-300 ${
        isStartPoint ? "!bg-green-300" : ""   /* Green background for the starting point */
      } ${isEndPoint ? "!bg-gray-200" : ""} ${ /* Light gray background for the endpoint */
        isWall ? "!bg-gray-900 wall-animate" : "" /* Dark gray background with animation for walls */
      }`}
    >
      {isStartPoint ? (
        <MapPinIcon className="h-4 w-4 font-bold" /> // Pin icon for the start point
      ) : isEndPoint ? (
        <TrophyIcon className="h-4 w-4 font-bold" /> // Trophy icon for the endpoint
      ) : null} 
      {/* No content for other cells */}
    </div>
  );
};

export default Cell;
