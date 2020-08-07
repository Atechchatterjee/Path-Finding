import React, { FC, useEffect, useRef, useState } from "react";

interface Props {
  squareWidth: number;
  squareHeight: number;
  gridWrapperWidth: number;
  gridWrapperHeight: number;
  borderWidth: number;
  borderHeight: number;
  callback?: Function;
}

const DrawGrid: FC<Props> = ({
  squareWidth,
  squareHeight,
  gridWrapperHeight,
  gridWrapperWidth,
  borderWidth,
  borderHeight,
  callback,
}) => {
  const [grid, updateGrid] = useState<any[]>([]);

  const gridWrapper = useRef<HTMLDivElement | null>(null);

  const start = useRef<boolean>(false);
  const end = useRef<boolean>(false);
  const started = useRef<boolean>(false);
  const ended = useRef<boolean>(false);

  const start_node = useRef<number>(-1);
  const end_node = useRef<number>(-1);

  const mounted = useRef<number>(0);

  const startNodeColor = useRef<string>("#EF5B5B");
  const endNodeColor = useRef<string>("#43BA48");
  const wallColor = useRef<string>("#C4C4C4");
  const gridColor = useRef<string>("#121415");

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
            backgroundColor: gridColor.current,
            width: squareHeight,
            height: squareHeight,
            float: "left",
            borderStyle: "solid",
            borderColor: "blue",
            borderWidth: borderWidth / 2,
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
      if (parseInt(id) === start_node.current) {
        if (target.style.backgroundColor === startNodeColor.current) {
          target.style.backgroundColor = gridColor.current;
        } else {
          target.style.backgroundColor = startNodeColor.current;
        }
      } else {
        obs.push(parseInt(id));
        target.style.backgroundColor = wallColor.current;
        target.style.borderColor = gridColor.current;
        if (callback !== undefined)
          callback({ startNode: -1, endNode: -1, obstacle: obs });
      }
    }
  }

  // marks the start and the end node
  function handleStartEnd(event: any) {
    const id = event.target.id;
    const target = document.getElementById(id);
    if (target !== null) {
      if (start.current && !started.current) {
        target.style.backgroundColor = startNodeColor.current;
        target.style.borderColor = startNodeColor.current;
        started.current = true;
        start_node.current = parseInt(id);
        if (callback !== undefined)
          callback({ startNode: parseInt(id), endNode: -1, obs: [] });
      } else if (end.current && !ended.current) {
        target.style.backgroundColor = endNodeColor.current;
        target.style.borderColor = endNodeColor.current;
        ended.current = true;
        end_node.current = parseInt(id);
        if (callback !== undefined)
          callback({ endNode: parseInt(id), startNode: -1, obs: [] });
      } else {
        target.style.backgroundColor = wallColor.current;
        target.style.borderColor = gridColor.current;
        if (callback !== undefined)
          callback({ startNode: -1, endNode: -1, obstacle: [id] });
      }
    }
  }

  return (
    <div className="App">
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
