import React, { FC, useEffect, useRef, useState } from "react";

interface Props {
  squareWidth: number;
  squareHeight: number;
  gridWrapperWidth: number;
  gridWrapperHeight: number;
  callback?: Function;
}

const DrawGrid: FC<Props> = ({
  squareWidth,
  squareHeight,
  gridWrapperHeight,
  gridWrapperWidth,
  callback,
}) => {
  const [grid, updateGrid] = useState<any[]>([]);

  const gridWrapper = useRef<HTMLDivElement | null>(null);

  const start = useRef<boolean>(false);
  const end = useRef<boolean>(false);
  const started = useRef<boolean>(false);
  const ended = useRef<boolean>(false);

  const mounted = useRef<number>(0);

  // main function to draw the grid
  function drawGrid(areaOfWrapper: number) {
    let gr = [];
    let numberOfSquare: number = areaOfWrapper / (squareHeight * squareWidth);
    for (let i = 0; i < numberOfSquare; i++) {
      gr.push(
        <div
          id={i.toString()}
          className="sq"
          style={{
            backgroundColor: "#E5E5E5",
            width: squareHeight,
            height: squareHeight,
            float: "left",
          }}
          draggable="true"
          onDragEnter={highlightSquare}
          onClick={handleStartEnd}
        ></div>
      );
    }
    updateGrid(gr);
  }

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (!started.current) start.current = event.key === "s";
      if (!ended.current) end.current = event.key === "e";
    });

    if (mounted.current <= 1) {
      if (
        gridWrapper.current?.offsetHeight != null &&
        gridWrapper.current?.offsetWidth != null
      ) {
        drawGrid(
          gridWrapper.current.offsetHeight * gridWrapper.current.offsetWidth
        );
      }
    }
    mounted.current++;
  });

  // marks the squares black on drag
  function highlightSquare(event: any) {
    const id = event.target.id;
    const obs: number[] = [];
    const target = document.getElementById(id);
    if (target !== null) {
      obs.push(parseInt(id));
      target.style.backgroundColor = "black";
    }
    if (callback !== undefined)
      callback({ startNode: -1, endNode: -1, obstacle: obs });
  }

  // marks the start and the end node
  function handleStartEnd(event: any) {
    const id = event.target.id;
    const target = document.getElementById(id);
    if (target !== null) {
      if (start.current && !started.current) {
        target.style.backgroundColor = "red";
        started.current = true;
        if (callback !== undefined)
          callback({ startNode: parseInt(id), endNode: -1, obs: [] });
      } else if (end.current && !ended.current) {
        target.style.backgroundColor = "green";
        ended.current = true;
        if (callback !== undefined)
          callback({ endNode: parseInt(id), startNode: -1, obs: [] });
      }
    }
  }

  function clearGrid() {
    mounted.current = 0;
    updateGrid([]);
    started.current = false;
    ended.current = false;
  }

  return (
    <div className="App">
      <button onClick={clearGrid}>clear</button>
      <div
        className="gridWrapper"
        ref={gridWrapper}
        style={{
          marginTop: "1%",
          marginLeft: "2%",
          height: gridWrapperHeight,
          width: gridWrapperWidth,
        }}
      >
        {grid}
      </div>
    </div>
  );
};

export default DrawGrid;