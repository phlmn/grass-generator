import React, { useState, createContext, useContext, useLayoutEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Color from 'color';

import './styles.css';

import { randomInt, randomNumber } from './random';
import Configurator from './Configurator';

function Grass({ points, x = 0, y = 0 }) {
  const leftPoints = [];
  const rightPoints = [];

  let width = 0;

  points.reverse().forEach(([x2, y2]) => {
    leftPoints.push([x2 - width / 2.0, -y2]);
    rightPoints.push([x2 + width / 2.0, -y2]);
    width += 3;
  });

  const leftPath = leftPoints.map(([x2, y2]) => `L ${x2},${y2}`);
  const rightPath = rightPoints.map(([x2, y2]) => `L ${x2},${y2}`);

  const svgPoints = [...leftPath.reverse(), ...rightPath].join('\n');
  const color = Color('#94BC5C').darken(randomNumber(0, 0.3));
  return (
    <>
      <path
        fill={color}
        stroke={color.darken(0.4)}
        transform={`translate(${x}, ${y})`}
        d={`M 0 0 \n${svgPoints}`}
      />
    </>
  );
}

function RandomGrass({ x, y, size, skew = randomNumber(-15, 15), curve = randomNumber(-10, 10) }) {
  const pointCount = size || randomInt(4, 6);

  let lastHeight = 0;
  const points = new Array(pointCount).fill(0).map((_, i) => {
    lastHeight = lastHeight + randomNumber(50, 100);
    return [randomNumber(-5, 5) + skew * (i + 1) + curve * Math.pow(i + 1, 2), lastHeight];
  });

  return <Grass x={x} y={y} points={[[0, 0], ...points]} />;
}

function ConfiguredGrass({ x, y }) {
  const config = useContext(ConfigContext);

  return (
    <RandomGrass
      x={x}
      y={y}
      curve={randomNumber(config.curve[0], config.curve[1])}
      size={randomInt(config.segments[0], config.segments[1])}
      skew={randomNumber(config.skew[0], config.skew[1])}
    />
  );
}

const ConfigContext = createContext(null);

function App() {
  const [values, setValues] = useState({
    curve: [-10, 10],
    skew: [-20, 20],
    segments: [2, 6],
    amount: 300,
  });

  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1700);
  const svgRef = useRef();

  useLayoutEffect(() => {
    setHeight(svgRef.current.clientHeight);
    setWidth(svgRef.current.clientWidth);
  });

  const positions = new Array(values.amount).fill(0).map(() => randomNumber(0, width));

  return (
    <ConfigContext.Provider value={values}>
      <Configurator
        options={[
          { name: 'curve', min: -30, max: 30 },
          { name: 'skew', min: -40, max: 40 },
          { name: 'segments', min: 1, max: 20 },
          { name: 'amount', min: 100, max: 800, marksStep: 100, step: 50 },
        ]}
        values={values}
        onChange={setValues}
      />
      <svg
        ref={svgRef}
        style={{ display: 'flex', height: '100vh', width: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {positions.map((pos, i) => (
          <ConfiguredGrass key={i} x={pos} y={height} />
        ))}
      </svg>
    </ConfigContext.Provider>
  );
}

const reactRoot = createRoot(document.getElementById('app'));
reactRoot.render(<App />);
