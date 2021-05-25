import { range, debounce } from "lodash";
import React, { useEffect, useState } from "react";
const gridLen = 16;


export const Grid = (props) => {
  const grid = props.grid;

  const [isDragging, setIsDragging] = useState(false);
  const [currentBrush, setCurrentBrush] = useState(false);


  const onGridClick = (e) => {
    /** @type HTMLElement */
    const el = e.target;
    const i = el.getAttribute("data-id-row");
    const j = el.getAttribute("data-id-col");
    setCurrentBrush( !grid[i][j]);
    props.startChangeGrid();
    props.updateGrid(i, j, !grid[i][j]);
    setIsDragging(true);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    props.doneChangeGrid();
  };


  let onGridCellEnter =(e) => {
    const el = e.target;
    const i = el.getAttribute("data-id-row");
    const j = el.getAttribute("data-id-col");
    if (isDragging) {
      if (grid[i][j] !== currentBrush) {
        props.updateGrid(i, j, currentBrush);
      }
    }
  };

  if (props.slowMode) {
    onGridCellEnter =  debounce(onGridCellEnter,  50, {trailing: true});
  }
  

  return (
    <div>
      <table cellSpacing={0} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <thead>
          <tr>
            {range(0, gridLen + 1).map((i) => (
              <th className="header-cell" key={"header" + i} draggable={false}>
                {i ? i : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {range(gridLen).map((i) => (
            <tr key={"row_" + i}  draggable={false}>
              <th className="header-cell" key={"rowHeader" + i}  draggable={false}>
                {i + 1}
              </th>

              {range(gridLen).map((j) => (
                <td
                  className="cell"
                  key={`cell${i}_${j}`}
                  data-id-row={i}
                  data-id-col={j}
                  onMouseOver={onGridCellEnter}
                  onMouseDown={onGridClick}
                  style={{ background: grid[i][j] ? "black" : "white" }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
