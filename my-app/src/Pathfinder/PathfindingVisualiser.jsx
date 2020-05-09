import React, {Component} from 'react';
import Node from './Node';

import './PathfindingVisualiser.css'

import {dijkstras} from '../algorithms/dijkstras.js'

const START_ROW = 10;
const START_COL = 5;
const END_ROW = 10;
const END_COL = 20;

export default class PathfindingVisualiser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid})
    }

    visualiseAstar(){
        const {grid} = this.state
        const startNode = grid[START_ROW][START_COL];
        const endNode = grid[END_ROW][END_COL];
        const visitedNodes = dijkstras(grid, startNode, endNode)
        console.log(visitedNodes)

    }

    render() {

        const {grid} = this.state;
        
        return (
            <>
            <button onClick={() => this.visualiseAstar()}>Visualise</button>

            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row, col, isFinish, isStart, isWall} = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        row={row}
                                    > </Node>
                                )
                            })}
                        </div>
                    );
                })}
            </div>
            </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
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
      isStart: row === START_ROW && col === START_COL,
      isFinish: row === END_ROW && col === END_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
