import { range } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Jumbotron,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import "./App.css";
import { GenerateBitMapCode } from "./generate-code";
import { Grid } from "./grid";
const baseGrid = range(16).map(() => range(16).map(() => false));

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    good for drawing diagonals
  </Tooltip>
);

let latestSnapshot = null;
let inTransaction = false;

function App() {
  const [grid, setGridBase] = useState(baseGrid);
  const [history, updateHistory] = useState({ prev: [], next: [] });

  const [slowMode, setSlowMode] = useState(false);
  const undoFn = useRef(null);
  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.key === "z") {
        undoFn.current();
        event.preventDefault();
      }
    });
  }, []);

  const setGrid = (newGrid) => {
    startChangeGrid();
    setGridBase(newGrid);
    doneChangeGrid();
  };


  const undoDisabled = () => !history.prev.length;
  const redoDisabled = () => !history.next.length;

  const undo = () => {
    if (!undoDisabled()) {
      const prevGrid = history.prev.pop();
      history.next.push(grid);
      setGridBase(prevGrid);
      updateHistory({ ...history });
    }
  };
  undoFn.current = undo;

  const redo = () => {
    const prevUndoGrid = history.next.pop();
    if (history.prev.length === 20) {
      history.prev = history.prev.slice(1);
    }

    history.prev.push(grid);
    setGridBase(prevUndoGrid);
    updateHistory({ ...history });
  };


  const startChangeGrid = () => {
    if (!inTransaction) {
      inTransaction = true;
      latestSnapshot = grid;
    }
  };

  const doneChangeGrid = () => {
    if (inTransaction) {
      if (history.prev.length === 20) {
        history.prev = history.prev.slice(1);
      }

      history.prev.push(latestSnapshot);
      history.next = [];
      updateHistory({ ...history });
      inTransaction = false;
    }
  };

  const code = GenerateBitMapCode(grid);

  const updateGrid = (i, j, val) => {
    const dup = grid.map((row) => row.map((c) => c));
    dup[i][j] = val;
    setGridBase(dup);
  };

  const clear = () => {
    setGrid(baseGrid);
  };

  const reverse = () => {
    const reverse = grid.map((row) => row.map((c) => !c));
    setGrid(reverse);
  };

  const rotate = () => {
    const dup = grid.map((row) => row.map((c) => c));
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        dup[j][15 - i] = grid[i][j];
      }
    }
    setGrid(dup);
  };

  const mirror = () => {
    const dup = grid.map((row) => row.map((c) => c));
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        dup[i][15 - j] = grid[i][j];
      }
    }
    setGrid(dup);
  };

  return (
    <div className="App">
      <Jumbotron>
        <h1 draggable={false}>Bitmap editor</h1>
      </Jumbotron>
      <Container>
        <Row style={{ marginBottom: 50, marginTop: 50 }}>
          <Col md={{ offset: 0, span: 6 }}>
            <Grid
              grid={grid}
              updateGrid={updateGrid}
              slowMode={slowMode}
              startChangeGrid={startChangeGrid}
              doneChangeGrid={doneChangeGrid}
            ></Grid>
          </Col>
          <Col>
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <textarea
                value={code}
                readOnly
                style={{ height: "95%", width: "95%" }}
              ></textarea>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <Container>
              <Row>
                <Col>
                  <Button variant="danger" onClick={clear}>
                    Clear
                  </Button>
                </Col>
                <Col>
                  <Button variant="secondary" onClick={reverse}>
                    Reverse
                  </Button>
                </Col>
                <Col>
                  <Button variant="secondary" onClick={rotate}>
                    Rotate
                  </Button>
                </Col>
                <Col>
                  <Button variant="secondary" onClick={mirror}>
                    Mirror
                  </Button>
                </Col>
                <Col md={4}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => setSlowMode(!slowMode)}
                    >
                      {slowMode ? "Disable slow mode" : "Enable Slow Mode"}
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row style={{ paddingTop: 24 }}>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={undo}
                    disabled={undoDisabled()}
                  >
                    Undo
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={redo}
                    disabled={redoDisabled()}
                  >
                    Redo
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
