import React from "react";
import "@rmwc/icon/styles";
import "@rmwc/icon-button/styles";
import { IconButton } from "@rmwc/icon-button";
import styled from "styled-components";

const NumberStepper = ({ value, onUpdate, min, max, label }) => {
  const onChange = newValue => {
    if (newValue < min) newValue = max;
    if (newValue > max) newValue = min;

    onUpdate(newValue);
  };

  return (
    <Outer>
      <Label>{label}:</Label>
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
    </Outer>
  );
};

export default NumberStepper;

const Outer = styled.div``;

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

const Label = styled.div`
  width: 100%;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;
