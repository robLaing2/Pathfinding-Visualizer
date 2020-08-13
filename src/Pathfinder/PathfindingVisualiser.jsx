import React, {Component} from 'react';
import Node from './Node';

import './PathfindingVisualiser.css'

import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstras.js';
import {aStar} from '../algorithms/aStar.js';
import {primsAlgorithm} from '../algorithms/mazeCreation.js';

const START_NODE_ROW = 8;
const START_NODE_COL = 4;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 40;

const NO_ROWS = 17;
const NO_COLS = 43;



export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        var visitString = "Visited Nodes: " + i;
          document.getElementById(`visitCounter`).innerHTML = visitString;
      }, 10 * i);
    }
  }

  makeAllNodesWall() {

    var gridO = this.state.grid;

    for (let row = 0; row < NO_ROWS; row++) {
        for (let col = 0; col < NO_COLS; col++) {
            gridO = getNewGridWithWallToggled(gridO, row, col);
            
        }
    }
    this.setState({grid: gridO});
  }

  resetGrid() {
    var gridO = this.state.grid;

    for (let row = 0; row < NO_ROWS; row++) {
        for (let col = 0; col < NO_COLS; col++) {
            gridO = getNewGridReset(gridO, row, col);

            if (row==START_NODE_ROW && col==START_NODE_COL) {
              document.getElementById(`node-${row}-${col}`).className = 'node node-start';
            }
            else if (row==FINISH_NODE_ROW && col==FINISH_NODE_COL){
              document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
            }
            else {
              document.getElementById(`node-${row}-${col}`).className = 'node';
            }
        }
    }
    this.setState({grid: gridO});

    document.getElementById(`visitCounter`).innerHTML = "Visited Nodes: 0";
    document.getElementById(`distanceFound`).innerHTML = "Final Distance: 0";
    
  }


  animateMaze(mazeLayout) {

    this.makeAllNodesWall()

    var gridO = this.state.grid;

    for (let i = 0; i < mazeLayout.length; i++) {

        setTimeout(() => {
            const {row, col} = mazeLayout[i];
            gridO = getNewGridWithWallToggled(gridO, row, col);

            if (row==START_NODE_ROW && col==START_NODE_COL ||
              (row==FINISH_NODE_ROW && col==FINISH_NODE_COL)) {
            }
            else {
              document.getElementById(`node-${row}-${col}`).className = 'node';
            }


            
          }, 20 * i);
    }
    this.setState({grid: gridO});
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
        var distanceString = "Final Distance: " + i;
        document.getElementById(`distanceFound`).innerHTML = distanceString;
      }, 50 * i);
    }
  }



  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualiseMazeCreation() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const mazeLayout = primsAlgorithm(grid, startNode, finishNode);

    this.animateMaze(mazeLayout);
  }



  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        
        <div class="container">
        <div class="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} class="gridRow">
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, distance, isWall, isVisitedMaze, neighbourNum} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      distance = {distance}
                      isWall={isWall}
                      isVisitedMaze={isVisitedMaze}
                      neighbourNum={neighbourNum}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
        <div class="selectionGrid">
          <div class="sel"> 
            <div class="algorithmDiv">
            <button class="algorithmBtn" onClick={() => this.visualiseMazeCreation()}>
              Create <br></br>maze
            </button>
            <div class="algorithmText">
              (Initialisation)<br></br>
              Add start to set<br></br>
              while set is not empty<br></br>
              &emsp;  cell = random cell in set<br></br>
              &emsp;  neighbours = getNeighbours(cell) <br></br>
              &emsp;  if neighbours is not empty <br></br>
              &emsp; &emsp; randNeighbour = random cell in neighbours<br></br>
              &emsp; &emsp; create connection with cell and randNeighbour<br></br>
              &emsp;  add neighbours to set<br></br>
            </div>
            </div>
            
          </div>
          <div class="selright">
          <div class="algorithmDiv">
            <button class="algorithmBtn" onClick={() => this.visualizeDijkstra()}>
              Solve with Dijkstras
            </button>
            <div class="algorithmText">
              (Initialisation)<br></br>
              for each node in grid:<br></br>
              &emsp;  dist[v] = infinity<br></br>
              &emsp;  previous[v] = undefined<br></br>
              dist[start] = 0<br></br>
              queue = all node in grid<br></br>
              <br></br>
              while the queue is not empty <br></br>
              &emsp; u = node in queue with smallest distance <br></br>
              &emsp; remove u from queue <br></br>
              &emsp; for each neighbor v of u:<br></br>
              &emsp;   alt = dist[u] + dist_between(u, v)<br></br>
              &emsp;   if alt less than dist[v] <br></br>
              &emsp; &emsp;     dist[v] = alt<br></br>
              &emsp; &emsp;     previous[v] = u<br></br>
              return previous<br></br>
              </div>
            </div>

            
            <div class="algorithmDiv">
              <button class="algorithmBtn" onClick={() => this.visualizeAStar()}>
                Solve with <br></br>A Star
              </button>
              <div class="algorithmText">

              (Initialisation)<br></br>
              open_list = (start)<br></br>
              closed_list = ()<br></br>
              g(start) = 0<br></br>
              h(start) = h(start, end)<br></br>
              f(start) = g(start) + h(start)<br></br>
              <br></br>
              while the open_list is not empty <br></br>
              &emsp;m = open_list the node node_current with the lowest f <br></br>
              &emsp;if m == end <br></br>
              &emsp;&emsp; return<br></br>
              &emsp;   remove m from open_listadd m to closed_list<br></br>
              &emsp;   for each n in child(m)<br></br>
              &emsp; &emsp;     if n in closed_list<br></br>
              &emsp; &emsp; &emsp;       continue<br></br>
              &emsp; &emsp;     cost = g(m) + distance(m, n)<br></br>
              &emsp; &emsp;     if n in open_list and cost less than g(n)<br></br>
              &emsp; &emsp; &emsp;       remove n from open_list as new path is better<br></br>
              &emsp; &emsp;     if n in closed_list and cost less than g(n)<br></br>
              &emsp; &emsp;       remove n from closed_list<br></br>
              &emsp; &emsp;     if n not in open_list and n not in closed_list<br></br>
              &emsp; &emsp; &emsp;       add n to open_list<br></br>
              &emsp; &emsp; &emsp;       g(n) = costh(n) = h(n, end)<br></br>
              &emsp; &emsp; &emsp;       f(n) = g(n) + h(n)<br></br>
              
        
              </div>
            </div>
            


            
            
          </div>

          <div class="selright">
            <button class="algorithmBtn" onClick={() => this.resetGrid()}>
              Reset<br></br>Grid     
            </button>
          
          </div>
          

          
        </div>

        <div class="statsDiv">
              <p class="visitCounter" id="visitCounter">
                Visited Nodes: 0
              </p>
              <p class="visitCounter" id="distanceFound">
                Final Distance: 0
              </p>
            </div>
      </>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < NO_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NO_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    f: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    isVisitedMaze:false,
    neighbourNum:0,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridReset = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    f: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    isVisitedMaze: false,
    neighbourNum: 0,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};