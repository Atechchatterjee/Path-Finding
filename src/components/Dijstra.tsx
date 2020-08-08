interface q {
  index: number;
  distance: number;
}

interface Props {
  start_node: number;
  end_node: number;
  numberOfSquares: number;
  finalPathColor: string;
  getAdjacentNodes: Function;
  isObstacle: Function;
  insert: Function;
}

let Dijstra = ({
  start_node,
  end_node,
  numberOfSquares,
  finalPathColor,
  getAdjacentNodes,
  isObstacle,
  insert,
}: Props) => {
  let toBacktrack = true;

  if (start_node === -1 || end_node === -1) {
    alert("Not specified start or end");
    return;
  }

  let prevNodes: Map<number, number> = new Map();
  let adjList: number[] = [];
  let queue: q[] = [];
  let visited: boolean[] = [];

  queue = insert(queue, { index: start_node, distance: 0 });

  for (let i = 0; i < numberOfSquares; i++) visited.push(false);

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
    if (queue[0] === undefined) {
      return;
    }

    let currentIndex: number = queue[0].index;
    let currentDistance: number = queue[0].distance;

    if (currentIndex === end_node) {
      if (toBacktrack) {
        console.log("backtracking");
        backTrack();
        toBacktrack = false;
      }
      return;
    }

    // getting the adjacent elements of current node
    adjList = getAdjacentNodes(currentIndex);

    if (currentIndex === undefined) return;

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
          distance: currentDistance + 1,
        });
        visited[adjIndex] = true;
        prevNodes.set(adjIndex, currentIndex);
      }

      loopAdjNodes(i + 1);
    };

    await loopAdjNodes(0);
    visited[currentIndex] = true;
    queue.shift();

    return setInterval(main, 500);
  };

  main();
};

export default Dijstra;
