import React, { FC, useRef } from "react";
import "./App.css";
import DrawGrid from "./components/drawGrid";

const App: FC = () => {
  const obstacles = useRef<number[]>([]);
  const squareWidth = useRef<number>(10);
  const squareHeight = useRef<number>(10);
  const gridWrapperWidth = useRef<number>(1000);
  const gridWrapperHeight = useRef<number>(500);
  const numberOfSquares = useRef<number>(
    (gridWrapperHeight.current * gridWrapperWidth.current) /
      (squareHeight.current * squareWidth.current)
  );

  const start_node = useRef<number>(0);
  const end_node = useRef<number>(0);

  // checks if the given index is valid
  function inBounds(index: number): boolean {
    return index >= 0 && index <= numberOfSquares.current;
  }

  function getAdjacentNodes(index: number): number[] {
    let nRow: number = gridWrapperWidth.current / squareWidth.current;
    let adjList: number[] = [];
    let top: number = inBounds(index - nRow) ? index - nRow : -1;
    let bottom: number = inBounds(index + nRow) ? index + nRow : -1;

    adjList.push(top);
    adjList.push(bottom);
    if ((index + 1) % nRow !== 0) adjList.push(index + 1); // right
    if (index % nRow !== 0) adjList.push(index - 1); // left

    return adjList;
  }

  // checks if there is a obstacle in the given index
  function isObstacle(index: number): boolean {
    let isObs: boolean = false;
    obstacles.current.forEach((obstacle: number) => {
      if (Number(obstacle) === index) isObs = true;
    });
    return isObs;
  }

  // main function for Dijstra's shortest path
  function Dijstra() {
    console.log("obstacles : \n " + obstacles.current);
    let prevNodes: Map<number, number> = new Map();
    let adjList: number[] = [];
    let queue: number[] = [];
    let visited: boolean[] = [];

    for (let i = 0; i < numberOfSquares.current; i++) visited.push(false);

    queue.push(start_node.current);
    let running: boolean = true;

    while (running) {
      let currentIndex: number = queue[0];
      if (currentIndex === end_node.current) running = false;
      // getting the adjacent elements of current node
      adjList = getAdjacentNodes(currentIndex);
      console.log("adjacent list of ", currentIndex + ": ");
      // eslint-disable-next-line no-loop-func
      adjList.forEach((adjIndex: number) => {
        if (adjIndex !== -1 && !visited[adjIndex] && !isObstacle(adjIndex)) {
          console.log(adjIndex);
          let element = document.getElementById(adjIndex.toString());
          let notStartEnd: boolean =
            adjIndex !== start_node.current && adjIndex !== end_node.current;
          if (element !== null && notStartEnd)
            element.style.backgroundColor = "blue";
          queue.push(adjIndex);
          visited[adjIndex] = true;
          prevNodes.set(adjIndex, currentIndex);
        }
      });
      visited[currentIndex] = true;
      queue.shift();
    }

    // back tracking from the end_node
    let i: number | undefined = prevNodes.get(end_node.current);
    while (i !== start_node.current && i !== undefined) {
      let e = document.getElementById(i.toString());
      if (e !== null) e.style.backgroundColor = "yellow";
      i = prevNodes.get(i);
    }
  }

  return (
    <div className="App">
      <button onClick={Dijstra} className="startBtn">
        start
      </button>
      <DrawGrid
        squareHeight={squareHeight.current}
        squareWidth={squareWidth.current}
        gridWrapperHeight={gridWrapperHeight.current}
        gridWrapperWidth={gridWrapperWidth.current}
        callback={({ startNode, endNode, obstacle }: any) => {
          // getting the start and the end index
          if (startNode !== -1) {
            start_node.current = startNode;
          }
          if (endNode !== -1) {
            end_node.current = endNode;
          }
          if (obstacle !== undefined) {
            obstacles.current.push(obstacle);
          }
        }}
      />
    </div>
  );
};

export default App;
