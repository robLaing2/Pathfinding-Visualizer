export function primsAlgorithm(grid, startNode, endNode) {

  var passageList = [];
  var workingSet = [];

  passageList.push(startNode);

  var connectingNode = startNode;
  connectingNode.isVisitedMaze = true;

  addUnvisitedNeighbours(grid, connectingNode, workingSet);

  var first = true;
  var count = 0;

  while (!!workingSet.length) {
    count++;

    var randIndex = Math.floor(Math.random() * workingSet.length)

    var randNeighbour = workingSet[randIndex];

    randNeighbour.isVisitedMaze = true;
    workingSet.splice(randIndex,1);

    if (first) {
      first = false;
    }
    else {
      connectingNode = getConnectingNode(grid, randNeighbour);
    }

    if (connectingNode.col == randNeighbour.col) {
      var middleRow = Math.max(connectingNode.row, randNeighbour.row) - 1;
      var col = connectingNode.col;
      var middleNode = grid[middleRow][col];
      middleNode.isVisitedMaze = true;
      passageList.push(middleNode);
    }
    else {
      var middleCol = (Math.max(connectingNode.col, randNeighbour.col)) - 1;
      var row = connectingNode.row;
      var middleNode = grid[row][middleCol];
      middleNode.isVisitedMaze = true;
      passageList.push(middleNode);
    }
    passageList.push(randNeighbour);
    addUnvisitedNeighbours(grid, randNeighbour, workingSet);
  }

  return passageList;
  
}

function getConnectingNode(grid, node) {

  var neighbours = [];
  var passage = [];
  var {col, row} = node;

  if (row > 1) neighbours.push(grid[row - 2][col]);
  if (row < grid.length - 2) neighbours.push(grid[row + 2][col]);
  if (col > 1) neighbours.push(grid[row][col - 2]);
  if (col < grid[0].length - 2) neighbours.push(grid[row][col + 2]);

  for (let i =0; i < neighbours.length; i++) {
    if (neighbours[i].isVisitedMaze) {
      passage.push(neighbours[i])
    }
  }

  var node = passage[Math.floor(Math.random() * passage.length)];

  return node;
}

function addUnvisitedNeighbours(grid, node, workingSet) {

  var {col, row} = node;

  if (row > 1) {
    var node = grid[row - 2][col];
    if (!node.isVisitedMaze && !workingSet.includes(node)) workingSet.push(node);
  } 
  if (row < grid.length - 2){
    var node = grid[row + 2][col];
    if (!node.isVisitedMaze && !workingSet.includes(node)) workingSet.push(node);
  } 
  if (col > 1){
    var node = grid[row][col - 2];
    if (!node.isVisitedMaze && !workingSet.includes(node)) workingSet.push(node);
  } 
  if (col < grid[0].length - 2){
    var node = grid[row][col + 2];
    if (!node.isVisitedMaze && !workingSet.includes(node)) workingSet.push(node);
  }
}