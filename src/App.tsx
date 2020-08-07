import React, { FC, useRef } from "react";
import "./App.css";
import DrawGrid from "./components/drawGrid";
import NavBar from "./components/NavBar";

interface q {
  index: number;
  distance: number;
}

const App: FC = () => {
  const obstacles = useRef<number[]>([]);
  const squareWidth = useRef<number>(20);
  const squareHeight = useRef<number>(20);
  const gridWrapperWidth = useRef<number>(1200);
  const gridWrapperHeight = useRef<number>(540);
  const borderWidth = useRef<number>(0.1);
  const borderHeight = useRef<number>(0.1);
  const numberOfSquares = useRef<number>(
    (gridWrapperHeight.current * gridWrapperWidth.current) /
      (squareHeight.current * squareWidth.current)
  );
  const nRow = useRef<number>(gridWrapperWidth.current / squareWidth.current);
  const gridWrapper = useRef<HTMLDivElement | null>(null);

  const finalPathColor = useRef<string>("#F8C93B");
  const wallColor = useRef<string>("#C4C4C4");
  const gridColor = useRef<string>("#121415");

  const start_node = useRef<number>(-1);
  const end_node = useRef<number>(-1);

  // checks if the given index is valid
  let inBounds = (index: number): boolean => {
    return index >= 0 && index < numberOfSquares.current;
  };

  // generates random obstacles in the grid
  let genRandomObstacle = () => {
    let randomObstacles = (
      a: number = Math.floor(Math.random() * 1000 + 100)
    ) => {
      if (a === 0) return;
      let n: number = Math.floor(Math.random() * numberOfSquares.current);
      if (n !== start_node.current && n !== end_node.current) {
        obstacles.current.push(n);
        let e = document.getElementById(n.toString());
        if (e !== null) e.style.backgroundColor = wallColor.current;
        randomObstacles(a - 1);
      }
    };
    randomObstacles();
  };

  // returns a specific neighbouring element
  let getElements = (index: number, type: string): number => {
    let top: number = inBounds(index - nRow.current)
      ? index - nRow.current
      : -1;
    let bottom: number = inBounds(index + nRow.current)
      ? index + nRow.current
      : -1;
    if (type === "top") return top;
    if (type === "bottom") return bottom;

    if (inBounds(index)) {
      if ((index + 1) % nRow.current !== 0) {
        if (type === "right") return index + 1; // right
        if (type === "bottom-right") {
          if (bottom + 1 > index) return bottom + 1; // bottom right
        }
        if (type === "top-right") {
          if (top + 1 < index && index >= nRow.current) return top + 1; // top right
        }
      }
      if (index % nRow.current !== 0) {
        if (type === "left") return index - 1; // right
        if (type === "bottom-left") {
          if (bottom - 1 > index) return bottom - 1; // bottom left
        }
        if (type === "top-left") {
          if (top - 1 < index && index >= nRow.current) return top - 1; // top left
        }
      }
    }
    return -1;
  };

  // given a vertex returns all the adjacent vertices
  let getAdjacentNodes = (index: number): number[] => {
    return [
      getElements(index, "top"),
      getElements(index, "bottom"),
      getElements(index, "right"),
      getElements(index, "bottom-right"),
      getElements(index, "top-right"),
      getElements(index, "left"),
      getElements(index, "bottom-left"),
      getElements(index, "top-left"),
    ];
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

  // main function for Dijstra's shortest path
  function Dijstra() {
    if (start_node.current === -1 || end_node.current === -1) {
      alert("Not specified start or end");
      return;
    }
    let prevNodes: Map<number, number> = new Map();
    let adjList: number[] = [];
    let queue: q[] = [];
    let visited: boolean[] = [];

    queue = insert(queue, { index: start_node.current, distance: 0 });

    for (let i = 0; i < numberOfSquares.current; i++) visited.push(false);

    // back-tracking from the end node
    let backTrack = (bt: boolean, i: number | undefined): void => {
      if (!bt) return;
      if (i) {
        let element = document.getElementById(i.toString());
        if (element) {
          element.style.backgroundColor = finalPathColor.current;
        }
        i = prevNodes.get(i);
      }
      return backTrack(i !== start_node.current, i);
    };

    let main = () => {
      if (queue[0] === undefined) {
        return;
      }

      let currentIndex: number = queue[0].index;
      let currentDistance: number = queue[0].distance;

      console.log("current index = " + currentIndex);

      if (currentIndex === end_node.current) {
        backTrack(true, prevNodes.get(end_node.current));
        return;
      }

      // getting the adjacent elements of current node
      adjList = getAdjacentNodes(currentIndex);

      if (currentIndex === undefined) return;

      let element = document.getElementById(currentIndex.toString());
      if (element !== null && currentIndex !== start_node.current) {
        element.style.backgroundColor = "#26AEC9";
      }

      for (let i = 0; i < adjList.length; i++) {
        let adjIndex = adjList[i];
        if (adjIndex !== -1 && !visited[adjIndex] && !isObstacle(adjIndex)) {
          let element = document.getElementById(adjIndex.toString());
          let notStartEnd: boolean =
            adjIndex !== start_node.current && adjIndex !== end_node.current;
          if (element !== null && notStartEnd) {
            element.style.backgroundColor = "blue";
          }
          queue = insert(queue, {
            index: adjIndex,
            distance: currentDistance + 1,
          });
          visited[adjIndex] = true;
          prevNodes.set(adjIndex, currentIndex);
        }
      }

      visited[currentIndex] = true;
      queue.shift();

      setInterval(main, 500);
    };

    main();
  }

  let clearGrid = () => {
    if (gridWrapper.current !== null) {
      let numberOfSquare: number =
        (gridWrapper.current.offsetHeight * gridWrapper.current.offsetWidth) /
        (squareHeight.current * squareWidth.current);
      for (let i = 0; i < numberOfSquare; i++) {
        let eachSquare = document.getElementById(i.toString());
        if (eachSquare !== null) {
          eachSquare.style.backgroundColor = gridColor.current;
          eachSquare.style.borderColor = "blue";
        }
      }
    }
  };

  return (
    <div className="App">
      <NavBar
        header="Dijstra's shortest Path"
        startCb={() => Dijstra()}
        randomCb={() => genRandomObstacle()}
        clearCb={() => clearGrid()}
      ></NavBar>
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
