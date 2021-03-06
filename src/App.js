import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
// comps
import TopBar from "./top-bar/TopBar";
import Display from "./display/Display";
import Controls from "./controls/Controls";
import { getAppData } from "./appData";
import useWindowDimensions from "./hooks/usWindowDimensions";
import {
  GetImage,
  createMaxSizeCanvas,
  createOrientatedCanvas
} from "./ImageHelper";

export default function App() {
  const [sourceImg, setSourceImg] = useState(null);
  const [currCellIndex, setCurrCellIndex] = useState(0);
  const [appData, setAppData] = useState(getAppData());
  const [canvasRef, setCanvasRef] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(true);
  const { width, height } = useWindowDimensions();

  const mainOutterPadding = 10;
  const mainInnerPadding = 10;
  const controlsOnLeft = width > 700;
  const appBarHeight = 60;
  const controlPanelSize = optionsVisible ? 200 : mainOutterPadding;

  const controlPanelTop = controlsOnLeft
    ? appBarHeight
    : height - controlPanelSize;
  const controlPanelWidth = controlsOnLeft ? controlPanelSize : width;

  const mainLeft = controlsOnLeft ? controlPanelSize : mainOutterPadding;
  const mainWidth = width - mainInnerPadding * 2;
  const mainHeight = height - mainInnerPadding * 2;

  const mainBottom = controlsOnLeft ? mainOutterPadding : controlPanelSize;

  const onSaveImage = () => {
    if (canvasRef) {
      canvasRef.toBlob(blob => {
        saveAs(blob, appData.defaultSaveName);
      });
    }
  };

  const onAddImage = imgFile => {
    createCanvasFromFile(imgFile, img => {
      setSourceImg(img);
    });
  };

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "./img/doug.png";
    }
  });

  return (
    <AppHolder>
      <AppBar height={appBarHeight}>
        <TopBar
          title={appData.title}
          infoUrl={appData.infoUrl}
          optionsVisible={optionsVisible}
          setOptionsVisible={setOptionsVisible}
          width={width}
        />
      </AppBar>

      {optionsVisible && (
        <ControlPanel top={controlPanelTop} width={controlPanelWidth}>
          <Controls
            currCellIndex={currCellIndex}
            setCurrCellIndex={setCurrCellIndex}
            onSaveImage={onSaveImage}
            onAddImage={onAddImage}
            onUpdate={setAppData}
            appData={appData}
            wrap={width < 700}
          />
        </ControlPanel>
      )}

      <Main
        top={appBarHeight}
        bottom={mainBottom}
        right={mainOutterPadding}
        left={mainLeft}
      >
        <Display
          sourceImg={sourceImg}
          currCellIndex={currCellIndex}
          setCanvasRef={setCanvasRef}
          sizeInfo={{ width: mainWidth, height: mainHeight }}
          appData={appData}
        />
      </Main>
    </AppHolder>
  );
}

export const createCanvasFromFile = (file, callback) => {
  const maxOutputCanvasSize = 1000;

  GetImage(file, (sourceImg, imgOrientation) => {
    const maxWidthCanvas = createMaxSizeCanvas(
      sourceImg,
      maxOutputCanvasSize,
      maxOutputCanvasSize
    );
    const canvas = createOrientatedCanvas(maxWidthCanvas, imgOrientation);

    callback(canvas);
  });
};

//
const AppHolder = styled.div`
  padding: 10;
`;

const AppBar = styled.div`
  padding: 10;
`;

const ControlPanel = styled.div`
  padding: 10;
  position: fixed;
  left: 0;
  top: ${props => props.top}px;
  bottom: 0;
  width: ${props => props.width}px;
  overflow: auto;
`;

const Main = styled.div`
  padding: 10;
  position: fixed;
  left: ${props => props.left}px;
  right: ${props => props.right}px;
  top: ${props => props.top}px;
  bottom: ${props => props.bottom}px;
  overflow: hidden;
`;
