import React from "react";
import "@rmwc/icon/styles";
import "@rmwc/icon-button/styles";
import { IconButton } from "@rmwc/icon-button";
import styled from "styled-components";

const NumberStepper = ({ value, onUpdate, min, max }) => {
  const onChange = newValue => {
    if (newValue < min) newValue = max;
    if (newValue > max) newValue = min;

    onUpdate(newValue);
  };

  return (
    <Container>
      <IconButton
        icon="remove"
        label="decrease"
        onClick={e => onChange(value - 1)}
      />
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(e.target.value)}
      />
      <IconButton
        icon="add"
        label="increase"
        onClick={e => onChange(value + 1)}
      />
    </Container>
  );
};

export default NumberStepper;

const Container = styled.div`
  display: flex;
  align-items: center;

  input {
    font-size: 18px;
    padding: 5px 5px;
    max-width: 60px;
    border: none;
    border-radius: 5px;
  }
`;
