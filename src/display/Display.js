import React, { useRef } from "react";
import styled from "styled-components";

const Display = ({
  appData,
  setCanvasRef,
  sourceImg,
  sizeInfo,
  currCellIndex
}) => {
  const canvasRef = useRef(null);
  setCanvasRef(canvasRef.current);

  const { height: displayHeight, width: displayWidth } = sizeInfo;

  if (sourceImg) {
    const gridCanvas = createGridCanvas({
      sourceCanvas: sourceImg,
      currCellIndex,
      displayHeight,
      displayWidth,
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
  currCellIndex,
  displayHeight,
  displayWidth,
  showSource,
  showGrid,
  labelGrid,
  cols,
  rows,
  showCell
}) => {
  const outputCanvas = document.createElement("canvas");
  const { width: imgW, height: imgH } = sourceCanvas;

  const currCell = getCurrCell(currCellIndex, cols, rows);

  const cellHeight = imgH / rows;
  const cellWidth = imgW / cols;

  if (showCell) {
    createCellCanvas({
      displayHeight,
      displayWidth,
      sourceCanvas,
      outputCanvas,
      cellWidth,
      cellHeight,
      col: currCell[0],
      row: currCell[1]
    });
  } else {
    drawFullCanvas({
      currCell,
      outputCanvas,
      sourceCanvas,
      showSource,
      showGrid,
      labelGrid,
      cols,
      rows,
      cellWidth,
      cellHeight,
      imgW,
      imgH
    });
  }

  return outputCanvas;
};

export const getCurrCell = (currCellIndex, cols, rows) => {
  const currRow = Math.floor(currCellIndex / cols);
  const currCol = currCellIndex % cols;

  return [currCol, currRow];
};

const createCellCanvas = ({
  sourceCanvas,
  outputCanvas,
  displayWidth,
  col,
  row,
  cellWidth,
  cellHeight
}) => {
  const wToHRatio = cellHeight / cellWidth;

  const padding = 10;
  const topPadding = 60;
  let outputWidth = displayWidth;
  let outputHeight = displayWidth * wToHRatio;

  outputCanvas.width = outputWidth + padding + padding;
  outputCanvas.height = outputHeight + topPadding + padding;
  const ctx = outputCanvas.getContext("2d");

  // BG
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

  const fontSize = 42;
  const text = `${getColLabel(col)}, ${getRowLabel(row)}`;
  ctx.fillStyle = "black";

  ctx.font = `${fontSize}px serif`;
  ctx.fillText(text, 10, fontSize);

  const srcX = col * cellWidth;
  const srcY = row * cellHeight;

  ctx.drawImage(
    sourceCanvas,
    srcX,
    srcY,
    cellWidth,
    cellHeight,
    padding,
    topPadding,
    outputWidth,
    outputHeight
  );

  ctx.strokeRect(padding, topPadding, outputWidth, outputHeight);

  drawGuideLines({
    ctx,
    x: padding,
    y: topPadding,
    width: outputWidth,
    height: outputHeight
  });
};

const drawGuideLines = ({ ctx, x, y, width, height }) => {
  const halfXPos = x + width / 2;
  const halfYPos = y + height / 2;

  // middle
  ctx.beginPath();
  ctx.moveTo(halfXPos, y);
  ctx.lineTo(halfXPos, y + height);
  ctx.setLineDash([5, 25]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, halfYPos);
  ctx.lineTo(x + width, halfYPos);
  ctx.setLineDash([5, 25]);
  ctx.stroke();
};

const drawFullCanvas = ({
  currCell,
  outputCanvas,
  sourceCanvas,
  showSource,
  showGrid,
  labelGrid,
  cols,
  rows,
  cellWidth,
  cellHeight,
  imgW,
  imgH
}) => {
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
    drawGrid({
      ctx,
      cols,
      rows,
      cellHeight,
      cellWidth,
      xOffset,
      yOffset,
      currCell
    });
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
};

const drawImageAsGrid = ({
  ctx,
  img,
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

const drawGrid = ({
  ctx,
  cols = 14,
  rows = 10,
  currCell,
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

  ctx.strokeStyle = "red";
  ctx.strokeRect(
    xOffset + currCell[0] * cellWidth,
    yOffset + currCell[1] * cellHeight,
    cellWidth,
    cellHeight
  );
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
  ctx.font = `${fontSize}px serif`;

  // TOP
  let textX = cellWidth / 2 - fontSize / 2;
  let textY = cellHeight - 10;
  for (let c = 0; c < cols; c++) {
    const label = getColLabel(c);
    ctx.fillText(label, xOffset + textX + c * cellWidth, textY);
  }

  // SIDE
  textY = cellHeight / 2 - fontSize / 2 + fontSize;
  textX = cellWidth - 10;
  ctx.textAlign = "right";
  for (let r = 0; r < rows; r++) {
    const label = getRowLabel(r);
    ctx.fillText("" + label, textX, yOffset + textY + r * cellHeight);
  }
};

const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getColLabel = colIndex => {
  return colIndex < rowLabels.length ? rowLabels[colIndex] : colIndex + 1;
};

const getRowLabel = rowIndex => {
  return rowIndex + 1;
};
