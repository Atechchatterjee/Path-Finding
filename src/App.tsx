import React, { FC, useRef } from "react";
import "./App.css";
import DrawGrid from "./components/drawGrid";

interface q {
  index: number;
  distance: number;
}

const App: FC = () => {
  const obstacles = useRef<number[]>([]);
  const squareWidth = useRef<number>(18);
  const squareHeight = useRef<number>(18);
  const gridWrapperWidth = useRef<number>(1200);
  const gridWrapperHeight = useRef<number>(580);
  const borderWidth = useRef<number>(2);
  const borderHeight = useRef<number>(2);
  const numberOfSquares = useRef<number>(
    (gridWrapperHeight.current * gridWrapperWidth.current) /
      ((squareHeight.current + borderHeight.current) *
        (squareWidth.current + borderWidth.current))
  );

  const start_node = useRef<number>(0);
  const end_node = useRef<number>(0);

  // checks if the given index is valid
  let inBounds = (index: number): boolean => {
    return index >= 0 && index <= numberOfSquares.current;
  };

  // given a vertex returns the top, left, right and bottom vertices
  let getAdjacentNodes = (index: number): number[] => {
    let nRow: number =
      gridWrapperWidth.current / (squareWidth.current + borderWidth.current);
    let adjList: number[] = [];
    let top: number = inBounds(index - nRow) ? index - nRow : -1;
    let bottom: number = inBounds(index + nRow) ? index + nRow : -1;

    adjList.push(top);
    adjList.push(bottom);
    if ((index + 1) % nRow !== 0) adjList.push(index + 1); // right
    if (index % nRow !== 0) adjList.push(index - 1); // left

    return adjList;
  };

  // checks if there is a obstacle in the given index
  let isObstacle = (index: number): boolean => {
    let isObs: boolean = false;
    obstacles.current.forEach((obstacle: number) => {
      if (Number(obstacle) === index) isObs = true;
    });
    return isObs;
  };

  // inserts elements such that the sorted order is maintained (sorted by distance)
  let insert = (queue: q[], { index, distance }: q): q[] => {
    if (queue.length === 0 || queue.length === 1) {
      queue.push({ index, distance });
      return queue;
    }

    let added: boolean = false;
    for (let i = 0; i < queue.length; i++) {
      if (distance < queue[i].distance) {
        added = true;
        queue.splice(i, 0, { index, distance });
        break;
      }
    }

    if (!added) queue.push({ index, distance });

    return queue;
  };

  // gets the distance from the start node
  let getDistance = (index: number): number => {
    return Math.abs(start_node.current - index);
  };

  // main function for Dijstra's shortest path
  function Dijstra() {
    console.log("obstacles : \n " + obstacles.current);
    let prevNodes: Map<number, number> = new Map();
    let adjList: number[] = [];
    let queue: number[] = [];
    let visited: boolean[] = [];

    for (let i = 0; i < numberOfSquares.current; i++) visited.push(false);
    queue.push(start_node.current);

    let main = () => {
      let currentIndex: number = queue[0];
      if (currentIndex === end_node.current) {
        backTrack();
        return;
      }
      // getting the adjacent elements of current node
      adjList = getAdjacentNodes(currentIndex);
      console.log("adjacent list of ", currentIndex + ": ");
      let element = document.getElementById(currentIndex.toString());
      if (element !== null && currentIndex !== start_node.current)
        element.style.backgroundColor = "cyan";
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
      setInterval(() => {
        main();
      }, 500);
    };

    let backTrack = () => {
      console.log("PrevNodes : " + prevNodes);
      // back tracking from the end_node
      let i: number | undefined = prevNodes.get(end_node.current);
      while (i !== start_node.current && i !== undefined) {
        let e = document.getElementById(i.toString());
        if (e !== null) e.style.backgroundColor = "#F4D06E";
        i = prevNodes.get(i);
      }
    };

    main();
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
        borderWidth={borderWidth.current}
        borderHeight={borderHeight.current}
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
