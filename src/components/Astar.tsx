interface Coordinates {
  x: number;
  y: number;
}

interface q {
  index: number;
  h_cost: number;
  g_cost: number;
}

interface Props {
  start_node: number;
  end_node: number;
  numberOfSquares: number;
  finalPathColor: string;
  getAdjacentNodes: Function;
  isObstacle: Function;
  nRow: number;
  nColumn: number;
}

let Astar = ({
  start_node,
  end_node,
  numberOfSquares,
  finalPathColor,
  getAdjacentNodes,
  isObstacle,
  nRow,
  nColumn,
}: Props) => {
  let toBacktrack = true;
  let ended = false;

  let getCoordinates = (index: number): Coordinates => {
    let x = index % nRow;
    let y = Math.floor(index / nRow);
    return { x, y };
  };

  let calculateHCost = (index: number): number => {
    let end: Coordinates = getCoordinates(end_node);
    let current: Coordinates = getCoordinates(index);
    return Math.sqrt(
      Math.pow(end.x - current.x, 2) + Math.pow(end.y - current.y, 2)
    );
  };

  // inserts elements such that the sorted order is maintained (sorted by distance)
  let insert = (queue: q[], { index, g_cost, h_cost }: q) => {
    if (queue.length === 0) {
      queue.push({ index, h_cost, g_cost });
      return queue;
    }

    let added: boolean = false;
    for (let i = 0; i < queue.length; i++) {
      if (h_cost < queue[i].h_cost) {
        added = true;
        queue.splice(i, 0, { index, h_cost, g_cost });
        break;
      }
    }
    if (!added) queue.push({ index, h_cost, g_cost });

    return queue;
  };

  if (start_node === -1 || end_node === -1) {
    alert("Not specified start or end");
    return;
  }

  let prevNodes: Map<number, number> = new Map();
  let adjList: number[] = [];
  let queue: q[] = [];
  let visited: boolean[] = [];

  for (let i = 0; i < numberOfSquares; i++) visited.push(false);

  queue = insert(queue, {
    index: start_node,
    h_cost: calculateHCost(start_node),
    g_cost: 0,
  });

  // back-tracking from the end node
  let backTrack = (
    bt: boolean = true,
    i: number | undefined = prevNodes.get(end_node)
  ): void => {
    if (!bt) return;
    if (i) {
      let element = document.getElementById(i.toString());
      if (element) {
        element.style.backgroundColor = finalPathColor;
      }
      i = prevNodes.get(i);
    }
    return backTrack(i !== start_node, i);
  };

  let main = async () => {
    if (!ended) {
      if (queue[0] === undefined) return;

      let currentIndex = queue[0].index;
      let gCost = queue[0].g_cost;

      queue.shift();

      if (currentIndex === undefined) return;

      adjList = getAdjacentNodes(currentIndex);

      if (currentIndex === end_node) {
        if (toBacktrack) {
          backTrack();
          toBacktrack = false;
        }
        ended = true;
        return;
      }

      let element = document.getElementById(currentIndex.toString());
      if (element !== null && currentIndex !== start_node) {
        element.style.backgroundColor = "#26AEC9";
      }

      let loopAdjNodes = async (i: number): Promise<void> => {
        if (i === adjList.length)
          return new Promise((resolve, reject) => resolve());

        let adjIndex = adjList[i];

        if (adjIndex !== -1 && !visited[adjIndex] && !isObstacle(adjIndex)) {
          let element = document.getElementById(adjIndex.toString());
          let notStartEnd: boolean =
            adjIndex !== start_node && adjIndex !== end_node;
          if (element !== null && notStartEnd) {
            element.style.backgroundColor = "blue";
          }
          queue = insert(queue, {
            index: adjIndex,
            g_cost: gCost + 1,
            h_cost: gCost + calculateHCost(adjIndex),
          });

          visited[adjIndex] = true;
          prevNodes.set(adjIndex, currentIndex);
        }

        loopAdjNodes(i + 1);
      };

      await loopAdjNodes(0);
      visited[currentIndex] = true;
      return setInterval(main, 500);
    }
  };

  main();
};

export default Astar;
