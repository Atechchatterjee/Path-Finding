import React, { FC, useState, useEffect, useRef } from "react";
import "./App.css";

const App: FC = () => {
  const [grid, updateGrid] = useState<any[]>([]);

  const squareWidth = useRef<number>(10);
  const squareHeight = useRef<number>(10);
  const gridWrapper = useRef<HTMLDivElement | null>(null);
  const gridWrapperWidth = useRef<number>(1300);
  const gridWrapperHeight = useRef<number>(600);

  const start = useRef<boolean>(false);
  const end = useRef<boolean>(false);
  const started = useRef<boolean>(false);
  const ended = useRef<boolean>(false);

  const startNode = useRef<number>(0);
  const endNode = useRef<number>(0);

  const mounted = useRef<number>(0);

  function drawGrid(areaOfWrapper: number) {
    let gr = [];
    let numberOfSquare: number =
      areaOfWrapper / (squareHeight.current * squareWidth.current);
    for (let i = 0; i < numberOfSquare; i++) {
      gr.push(
        <div
          id={i.toString()}
          className="sq"
          style={{
            backgroundColor: "#E5E5E5",
            width: squareHeight.current,
            height: squareHeight.current,
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
    console.log("useEffect");
    if (mounted.current <= 1) {
      if (
        gridWrapper.current?.offsetHeight != null &&
        gridWrapper.current?.offsetWidth != null
      ) {
        console.log("drawing grid");
        drawGrid(
          gridWrapper.current.offsetHeight * gridWrapper.current.offsetWidth
        );
      }
    }
    mounted.current++;
  });

  function highlightSquare(event: any) {
    const id = event.target.id;
    const target = document.getElementById(id);
    if (target !== null) {
      target.style.backgroundColor = "black";
    }
  }

  function handleStartEnd(event: any) {
    const id = event.target.id;
    const target = document.getElementById(id);
    if (target !== null) {
      if (start.current && !started.current) {
        target.style.backgroundColor = "red";
        started.current = true;
        startNode.current = parseInt(id);
      } else if (end.current && !ended.current) {
        target.style.backgroundColor = "green";
        ended.current = true;
        endNode.current = parseInt(id);
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
          height: gridWrapperHeight.current,
          width: gridWrapperWidth.current,
        }}
      >
        {grid}
      </div>
    </div>
  );
};

export default App;
