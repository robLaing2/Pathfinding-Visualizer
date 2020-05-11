export function aStar(grid, startNode, endNode) {

  var openSet = [];
  var visitedNodesInOrder = [];

  setHScores(grid, endNode);

  openSet.push(startNode);

  startNode.distance = 0;
  startNode.f = startNode.distance + startNode.h;


  while(!!openSet.length){

    sortNodesByFScore(openSet);

    var currentNode = openSet.shift();

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode == endNode) {
      return visitedNodesInOrder;
    }

    var neighbours = getNeighbours(currentNode, grid);

    for (let i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      var potentialGScore = currentNode.distance + 1;

      if (neighbour.distance > potentialGScore) {

        neighbour.previousNode = currentNode;
        neighbour.distance = potentialGScore;

        neighbour.f = neighbour.h + neighbour.distance;

        if (!openSet.includes(neighbour)) {
          openSet.push(neighbour);
        }
      }
    }
  }
}

function setHScores(grid, endNode) {
  for (const row of grid) {
    for (const node of row) {
      var hScore = Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col)
      node.h = hScore;
    }
  }
}

function getNeighbours(node, grid) {
  const neighbors = [];
  const {col, row} = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function sortNodesByFScore(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}