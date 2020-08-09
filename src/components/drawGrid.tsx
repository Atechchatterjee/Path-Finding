import React, { FC, useEffect, useRef, useState } from "react";

interface Props {
  squareWidth: number;
  squareHeight: number;
  gridWrapperWidth: number;
  gridWrapperHeight: number;
  borderWidth: number;
  clearedGrid: boolean;
  callback?: Function;
  removeObstacle?: Function;
}

const DrawGrid: FC<Props> = ({
  squareWidth,
  squareHeight,
  gridWrapperHeight,
  gridWrapperWidth,
  borderWidth,
  clearedGrid,
  callback,
  removeObstacle,
}) => {
  const [grid, updateGrid] = useState<any[]>([]);
  const startDrag = useRef<boolean>(false);
  const endDrag = useRef<boolean>(false);

  const gridWrapper = useRef<HTMLDivElement | null>(null);

  const Start = useRef<boolean>(false);
  const End = useRef<boolean>(false);
  const Started = useRef<boolean>(false);
  const Ended = useRef<boolean>(false);

  const Start_Node = useRef<number>(-1);
  const End_Node = useRef<number>(-1);

  const mounted = useRef<number>(0);

  const startNodeColor = useRef<string>("#EF5B5B");
  const endNodeColor = useRef<string>("#43BA48");
  const wallColor = useRef<string>("#C4C4C4");
  const gridColor = useRef<string>("#121415");
  const mouseLeftId = useRef<string>("");
  const dragEnded = useRef<boolean>(false);
  const shiftPressed = useRef<boolean>(false);

  // main function to draw the grid
  let drawGrid = (areaOfWrapper: number) => {
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
            borderWidth: borderWidth,
          }}
          draggable="true"
          onDragEnter={highlightSquare}
          onClick={handleStartEnd}
          onDragStart={(event: any) => {
            let id: number = parseInt(event.target.id);
            if (id === Start_Node.current) {
              startDrag.current = true;
              let element = document.getElementById(id.toString());
              if (element !== null)
                element.style.backgroundColor = gridColor.current;
            } else if (id === End_Node.current) {
              endDrag.current = true;
              let element = document.getElementById(id.toString());
              if (element !== null)
                element.style.backgroundColor = gridColor.current;
            }
          }}
          onDragEnd={() => {
            dragEnded.current = true;
            if (startDrag.current) {
              let element = document.getElementById(mouseLeftId.current);

              if (element !== null)
                element.style.backgroundColor = startNodeColor.current;
              Start_Node.current = parseInt(mouseLeftId.current);
              if (callback)
                callback({
                  startNode: parseInt(mouseLeftId.current),
                  endNode: -1,
                  obs: [],
                });

              startDrag.current = false;
            } else if (endDrag.current) {
              let element = document.getElementById(mouseLeftId.current);

              if (element !== null)
                element.style.backgroundColor = endNodeColor.current;

              End_Node.current = parseInt(mouseLeftId.current);

              if (callback)
                callback({
                  startNode: -1,
                  endNode: parseInt(mouseLeftId.current),
                  obs: [],
                });

              endDrag.current = false;
            }
          }}
        ></div>
      );
    }
    updateGrid(gr);
  };

  useEffect(() => {
    if (clearedGrid) {
      Start.current = false;
      End.current = false;
      Started.current = false;
      Ended.current = false;
      Start_Node.current = -1;
      End_Node.current = -1;
    }
    // marks the start and the end nodes
    document.addEventListener("keydown", function (event) {
      if (!Started.current) Start.current = event.key === "s";
      if (!Ended.current) End.current = event.key === "e";
      if (event.key === "Shift") shiftPressed.current = true;
    });

    document.addEventListener("keyup", function (event) {
      if (event.key === "Shift") shiftPressed.current = false;
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

  // (drag) drawing walls on drag and dragging the start and end node
  let highlightSquare = (event: any) => {
    mouseLeftId.current = event.target.id;
    const id = event.target.id;
    const obs: number[] = []; // obstacles
    const target = document.getElementById(id);
    if (target !== null) {
      obs.push(parseInt(id));

      if (startDrag.current && !dragEnded.current) {
        target.style.backgroundColor = startNodeColor.current;
        target.style.backgroundColor = gridColor.current;
        dragEnded.current = false;
      } else if (endDrag.current && !dragEnded.current) {
        target.style.backgroundColor = endNodeColor.current;
        target.style.backgroundColor = gridColor.current;
        dragEnded.current = false;
      } else if (
        !startDrag.current &&
        !endDrag.current &&
        parseInt(id) !== Start_Node.current &&
        parseInt(id) !== End_Node.current
      ) {
        if (!shiftPressed.current) {
          target.style.backgroundColor = wallColor.current;
          if (callback !== undefined)
            callback({ startNode: -1, endNode: -1, obstacle: obs });
        } else {
          target.style.backgroundColor = gridColor.current;
          if (removeObstacle !== undefined) removeObstacle(parseInt(id));
        }
      }
    }
  };

  //(click) marks the start and the end node
  let handleStartEnd = (event: any) => {
    const id = event.target.id;
    const target = document.getElementById(id);
    if (target !== null) {
      if (Start.current && !Started.current) {
        target.style.backgroundColor = startNodeColor.current;
        Started.current = true;
        Start_Node.current = parseInt(id);
        if (callback !== undefined)
          callback({ startNode: parseInt(id), endNode: -1, obs: [] });
      } else if (End.current && !Ended.current) {
        target.style.backgroundColor = endNodeColor.current;
        Ended.current = true;
        End_Node.current = parseInt(id);
        if (callback !== undefined)
          callback({ endNode: parseInt(id), startNode: -1, obs: [] });
      } else if (
        parseInt(id) !== Start_Node.current &&
        parseInt(id) !== End_Node.current
      ) {
        target.style.backgroundColor = wallColor.current;
        if (callback !== undefined)
          callback({ startNode: -1, endNode: -1, obstacle: [id] });
      }
    }
  };

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
