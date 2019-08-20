import React, { useState, createContext, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import Konva from 'konva';

import Configurator from './components/Configurator';

import "./styles.css";


function randomNumber(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomNumber(min, max));
}



function grassShape(points) {
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

  // const leftPoints = sad.map(([x2, y2]) => `${x2},${y2}`);
  // const rightPoints = sad2.map(([x2, y2]) => `L ${x2},${y2}`);
  // const middlePoints = middle.map(([x2, y2]) => `${x2},${y2}`);

  return [...sad.reverse(), ...sad2];
}

function Canvas() {
  const canvasRef = useRef();

  const width = 1000;
  const height = 800;

  useLayoutEffect(() => {
    var stage = new Konva.Stage({
      container: canvasRef.current,
      width: width,
      height: height
    });

    let rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fill: '#000',
    });

    let grass = new Konva.Shape({
      x: 100,
      y: 100,
      stroke: '#00D2FF',
      height: 200,
      width: 200,
      points: grassShape([[0,0], [100, -100]]),
      sceneFunc: function (context, shape) {
        context.beginPath();
        // don't need to set position of rect, Konva will handle it
        // context.moveTo(points[0][0], points[0][1]);
        shape.getAttr('points').forEach(point => {
          context.lineTo(point[0], point[1]);
        });

        context.

        // context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
        // context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
        // (!) Konva specific method, it is very important
        // it will apply are required styles
        context.fillStrokeShape(shape);
      }
    });


    layer.add(grass);
    stage.add(layer);
  }, []);

  return (
    <div width={width} height={height} ref={canvasRef}>

    </div>
  );
}

const ConfigContext = createContext(null);

function App() {
  const [values, setValues] = useState({
    curve: [-10, 10],
    skew: [-20, 20],
    segments: [1, 5]
  });

  const positions = new Array(200).fill(0).map(() => randomNumber(0, 1700));
  return (
    <ConfigContext.Provider value={values}>
      <div className="App">
        <Configurator
          options={[
            { name: "curve", min: -30, max: 30 },
            { name: "skew", min: -40, max: 40 },
            { name: "segments", min: 1, max: 20 }
          ]}
          values={values}
          onChange={setValues}
        />
      </div>
      <Canvas />
    </ConfigContext.Provider>
  );
}

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
