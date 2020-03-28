import React, { useRef } from "react";
import styled from "styled-components";

const Display = ({ appData, setCanvasRef, sourceImg, sizeInfo }) => {
  const canvasRef = useRef(null);
  setCanvasRef(canvasRef.current);

  const { height: displayHeight } = sizeInfo;

  if (sourceImg) {
    const gridCanvas = createGridCanvas({
      sourceCanvas: sourceImg,
      ...appData
    });
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = gridCanvas.width;
    canvasRef.current.height = gridCanvas.height;
    ctx.drawImage(gridCanvas, 0, 0);
  }

  return (
    <Container>
      <CanvasHolder style={{ height: displayHeight }}>
        <CanvasStyled ref={canvasRef} />
      </CanvasHolder>
    </Container>
  );
};

export default Display;

// STYLES
const Container = styled.div`
  background: #fff;
  border-radius: 10px;
  background-image: url(./img/cutting-mat-tile.png);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const CanvasHolder = styled.div`
  padding: 1%;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CanvasStyled = styled.canvas`
  max-width: 100%;
  max-height: 100%;
`;

// helper functions
const createGridCanvas = ({
  sourceCanvas,
  showSource,
  showGrid,
  labelGrid,
  cols,
  rows
}) => {
  const outputCanvas = document.createElement("canvas");
  const { width: imgW, height: imgH } = sourceCanvas;

  const cellHeight = imgH / rows;
  const cellWidth = imgW / cols;
  const xOffset = labelGrid ? cellWidth : 10;
  const yOffset = labelGrid ? cellHeight : 10;

  outputCanvas.width = imgW + xOffset + 10;
  outputCanvas.height = imgH + yOffset + 10;

  const ctx = outputCanvas.getContext("2d");

  // BG
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

  // IMAGE
  if (showSource) {
    ctx.drawImage(sourceCanvas, xOffset, yOffset);
  }

  // GRID
  if (showGrid) {
    drawGrid({ ctx, cols, rows, cellHeight, cellWidth, xOffset, yOffset });
  }

  // GRID LABELS
  if (labelGrid) {
    drawGridLabels({
      ctx,
      cols,
      rows,
      cellHeight,
      cellWidth,
      xOffset,
      yOffset
    });
  }

  return outputCanvas;
};

const drawGrid = ({
  ctx,
  cols = 14,
  rows = 10,
  cellHeight,
  cellWidth,
  xOffset,
  yOffset
}) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.strokeRect(
        xOffset + c * cellWidth,
        yOffset + r * cellHeight,
        cellWidth,
        cellHeight
      );
    }
  }
};

const drawGridLabels = ({
  ctx,
  cols = 14,
  rows = 10,
  cellHeight,
  cellWidth,
  xOffset,
  yOffset
}) => {
  const fontSize = Math.min(cellWidth / 2, cellHeight / 2);
  ctx.fillStyle = "black";
  ctx.font = `${fontSize}px calibri`;
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // TOP
  let textX = cellWidth / 2 - fontSize / 2;
  let textY = cellHeight - 10;
  for (let c = 0; c < cols; c++) {
    const label = c < rowLabels.length ? rowLabels[c] : c;
    ctx.fillText(label, xOffset + textX + c * cellWidth, textY);
  }

  // SIDE
  textY = cellHeight / 2 - fontSize / 2 + fontSize;
  textX = cellWidth - 10;
  ctx.textAlign = "right";
  for (let r = 0; r < rows; r++) {
    const label = r + 1;
    ctx.fillText("" + label, textX, yOffset + textY + r * cellHeight);
  }
};
