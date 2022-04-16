import React from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

function marks(min, max) {
  const points = {};

  for (const i = Math.ceil(min / 10); Math.floor(i * 10) <= max; i += 1) {
    points[`${i * 10}`] = `${i * 10}`;
  }

  return points;
}

function Configurator({ options, values, onChange }) {
  return (
    <div
      style={{
        position: 'fixed',
        right: '0',
        padding: '20px 40px',
        top: '0',
        maxWidth: '100%',
        width: '400px',
        textAlign: 'left',
      }}
    >
      {options.map((option) => {
        const value = values[option.name];

        return (
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>{option.name}</div>
              <div style={{ color: '#aaa' }}>
                {value[0]} - {value[1]}
              </div>
            </div>
            <Slider.Range
              min={option.min || -20}
              max={option.max || 20}
              step={option.step || 1}
              marks={marks(option.min || -20, option.max || 20)}
              value={value}
              onChange={(value) => {
                onChange({ ...values, [option.name]: value });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Configurator;

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
        position: 'fixed',
        right: '0',
        padding: '20px 40px',
        top: '0',
        maxWidth: '100%',
        width: '400px',
        textAlign: 'left',
      }}
    >
      {options.map((option) => {
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
          <div key={option.name} style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>{option.name}</div>
              <div style={{ color: '#aaa' }}>
                {type === 'range' && `${value[0]} - ${value[1]}`}
                {type === 'slider' && value}
              </div>
            </div>
            {type === 'range' && (
              <Slider
                range
                min={option.min || -20}
                max={option.max || 20}
                step={option.step || 1}
                marks={marks(option.min || -20, option.max || 20, option.marksStep || 10)}
                value={value}
                onChange={(value) => {
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
                onChange={(value) => {
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
