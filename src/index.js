import React, { useState, createContext, useContext } from "react";
import ReactDOM from "react-dom";
import Color from "color";
import Slider from "rc-slider";

import "./styles.css";
import "rc-slider/assets/index.css";

function Grass({ points, x = 0, y = 0 }) {
  const sad = [];
  const sad2 = [];
  const middle = [];

  let width = 0;

  points.reverse().forEach(([x2, y2]) => {
    sad.push([x2 - width / 2.0, -y2]);
    sad2.push([x2 + width / 2.0, -y2]);
    middle.push([x2, -y2]);
    width += 3;
  });

  const leftPoints = sad.map(([x2, y2]) => `L ${x2},${y2}`);
  const rightPoints = sad2.map(([x2, y2]) => `L ${x2},${y2}`);
  const middlePoints = middle.map(([x2, y2]) => `${x2},${y2}`);

  const svgPoints = [...leftPoints.reverse(), ...rightPoints].join("\n");
  const color = Color("#94BC5C").darken(randomNumber(0, 0.3));
  return (
    <>
      <path
        fill={color}
        stroke={color.darken(0.4)}
        transform={`translate(${x}, ${y})`}
        d={`M 0 0 \n${svgPoints}`}
      />
      {/*<polyline
        stroke={color.darken(0.2)}
        fill="none"
        strokeWidth="1px"
        transform={`translate(${x}, ${y})`}
        points={middlePoints.join(" ")}
      />*/}
    </>
  );
}

function randomNumber(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomNumber(min, max));
}

function RandomGrass({
  x,
  y,
  size,
  skew = randomNumber(-15, 15),
  curve = randomNumber(-10, 10)
}) {
  const pointCount = size || randomInt(4, 6);

  let lastHeight = 0;
  const points = new Array(pointCount).fill(0).map((_, i) => {
    lastHeight = lastHeight + randomNumber(50, 100);
    return [
      randomNumber(-5, 5) + skew * (i + 1) + curve * Math.pow(i + 1, 2),
      lastHeight
    ];
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
function marks(min, max, step) {
  const points = [];

  for (let i = Math.ceil(min / step); Math.floor(i * step) <= max; i += 1) {
    points[`${i * step}`] = `${i * step}`;
  }

  return points;
}

function Configurator({ options, values, onChange }) {
  return (
    <div
      style={{
        position: "fixed",
        right: "0",
        padding: "20px 40px",
        top: "0",
        maxWidth: "100%",
        width: "400px",
        textAlign: "left"
      }}
    >
      {options.map(option => {
        const value = values[option.name];

        let type;
        if (typeof value === 'number') {
          type = 'slider';
        } else if (value instanceof Array) {
          type = 'range';
        } else {
          throw new Error(`Unknown type for ${option.name}`);
        }

        return (
          <div key={option.name} style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div>{option.name}</div>
              <div style={{ color: "#aaa" }}>
                {type === 'range' && `${value[0]} - ${value[1]}`}
                {type === 'slider' && value}
              </div>
            </div>
            {type === 'range' && (
              <Slider.Range
                min={option.min || -20}
                max={option.max || 20}
                step={option.step || 1}
                marks={marks(option.min || -20, option.max || 20, option.marksStep || 10)}
                value={value}
                onChange={value => {
                  onChange({ ...values, [option.name]: value });
                }}
              />
            )}
            {type === 'slider' && (
              <Slider
                min={option.min || -20}
                max={option.max || 20}
                step={option.step || 1}
                marks={marks(option.min || -20, option.max || 20, option.marksStep || 10)}
                value={value}
                onChange={value => {
                  onChange({ ...values, [option.name]: value });
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const ConfigContext = createContext(null);

function App() {
  //<Grass points={[[20, 0], [10, 200], [15, 500], [12, 800]]} />

  const [values, setValues] = useState({
    curve: [-10, 10],
    skew: [-20, 20],
    segments: [2, 6],
    amount: 300,
  });

  const positions = new Array(values.amount).fill(0).map(() => randomNumber(0, 1700));

  return (
    <ConfigContext.Provider value={values}>
      <div className="App">
        <Configurator
          options={[
            { name: "curve", min: -30, max: 30 },
            { name: "skew", min: -40, max: 40 },
            { name: "segments", min: 1, max: 20 },
            { name: "amount", min: 100, max: 800, marksStep: 100, step: 50 }
          ]}
          values={values}
          onChange={setValues}
        />
        <svg
          style={{ height: "1000px", width: "100%" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {positions.map((pos, i) => (
            <ConfiguredGrass key={i} x={pos} y={1000} />
          ))}
        </svg>
      </div>
    </ConfigContext.Provider>
  );
}

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
