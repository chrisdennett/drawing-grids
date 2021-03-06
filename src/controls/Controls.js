import React from "react";
import styled from "styled-components";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";
// comps
import SliderControl from "./sliderControl/SliderControl";
import { SwitchControl } from "./switchControl/SwitchControl";
import ColourPicker from "../components/colourPicker/ColourPicker";
import PhotoSelector from "../components/photoSelector/PhotoSelector";
import QuickSelectMenu from "../components/quickSelectControl/QuickSelectControl";
import NumberStepper from "../components/numberStepper/NumberStepper";

const Controls = ({
  appData,
  onUpdate,
  wrap = false,
  onSaveImage,
  onAddImage,
  currCellIndex,
  setCurrCellIndex
}) => {
  const { settings } = appData;

  const { rows, cols } = appData;

  const updateSettings = (key, newValue) => {
    onUpdate({ ...appData, [key]: newValue });
  };

  const updateMultipleSettings = updates => {
    onUpdate({ ...appData, ...updates });
  };

  const onPhotoSelected = file => {
    onAddImage(file);
  };

  const settingsKeys = Object.keys(settings);

  return (
    <Container>
      <ControlsUI wrapControls={wrap}>
        <ButtHolder>
          <PhotoSelector onPhotoSelected={onPhotoSelected} />
        </ButtHolder>

        <ButtHolder>
          <Button label="SAVE" raised onClick={onSaveImage} />
        </ButtHolder>

        <ControlHolder dividerAbove={true}>
          <NumberStepper
            value={currCellIndex}
            onUpdate={setCurrCellIndex}
            min={0}
            max={rows * cols - 1}
          />
        </ControlHolder>

        {settingsKeys.map(key => {
          const currSetting = settings[key];
          const currValue = appData[key];
          const { dividerAbove } = currSetting;

          if (currSetting.showIfs) {
            for (let condition of currSetting.showIfs)
              if (appData[condition.key] !== condition.condition) {
                return null;
              }
          }

          if (currSetting.type === "select") {
            return (
              <ControlHolder dividerAbove={dividerAbove} key={key}>
                <QuickSelectMenu
                  currentOptionKey={currValue}
                  label={currSetting.label}
                  options={currSetting.options}
                  onUpdate={selectedOption => {
                    updateMultipleSettings({
                      [key]: selectedOption,
                      ...currSetting.options[currValue].data
                    });
                  }}
                />
              </ControlHolder>
            );
          }

          if (currSetting.type === "stepper") {
            return (
              <ControlHolder dividerAbove={dividerAbove} key={key}>
                <NumberStepper
                  label={currSetting.label}
                  value={currValue}
                  onUpdate={value => updateSettings(key, value)}
                  min={currSetting.min}
                  max={currSetting.max}
                />
              </ControlHolder>
            );
          }

          if (currSetting.type === "colour") {
            return (
              <ControlHolder dividerAbove={dividerAbove} key={key}>
                <ColourPicker
                  label={currSetting.label}
                  value={currValue}
                  onChange={value => updateSettings(key, value)}
                />
              </ControlHolder>
            );
          }

          if (currSetting.type === "boolean") {
            return (
              <ControlHolder dividerAbove={dividerAbove} key={key}>
                <SwitchControl
                  label={currSetting.label}
                  value={currValue}
                  onChange={value => updateSettings(key, value)}
                />
              </ControlHolder>
            );
          }

          if (currSetting.type === "range") {
            return (
              <ControlHolder dividerAbove={dividerAbove} key={key}>
                <SliderControl
                  labelStyle={{ minWidth: 150 }}
                  label={currSetting.label}
                  displayValue={true}
                  min={currSetting.min}
                  max={currSetting.max}
                  value={currValue}
                  step={currSetting.step}
                  onChange={value => updateSettings(key, value)}
                />
              </ControlHolder>
            );
          }

          return null;
        })}
      </ControlsUI>
    </Container>
  );
};

export default Controls;

// STYLES
const Container = styled.div`
  padding-top: 5px;
  color: white;

  .mdc-button--raised:not(:disabled),
  .mdc-button--unelevated:not(:disabled) {
    background-color: #ffc300;
    color: black;
    width: 100%;
  }
`;

const ControlsUI = styled.div`
  margin: 0px 10px 10px 8px;
  display: ${props => (props.wrapControls ? "flex" : "")};
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const ControlHolder = styled.div`
  border-top: ${props => (props.dividerAbove ? "1px solid #ccc" : "none")};
  margin-top: ${props => (props.dividerAbove ? "3px" : "")};
  padding: 10px 0;
`;

const ButtHolder = styled.div`
  margin: 5px 5px 15px 5px;
`;
