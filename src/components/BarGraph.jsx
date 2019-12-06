import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientTealBlue } from '@vx/gradient';
import { letterFrequency } from '@vx/mock-data';
import { scaleBand, scaleLinear } from '@vx/scale';

const data = letterFrequency.slice(5);

console.log(data);

// accessors
const x = d => d.letter;
const y = d => +d.frequency * 100;

const BarChart = ({ width, height }) => {
  // bounds
  const xMax = width;
  const yMax = height - 120;

  // scales
  const xScale = scaleBand({
    rangeRound: [0, xMax],
    domain: data.map(x),
    padding: 0.4
  });
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...data.map(y))]
  });

  return (
    <svg width={width} height={height}>
      <GradientTealBlue id="teal" />
      <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00AE99" stopOpacity={1} />
              <stop offset="100%" stopColor="#00AE99" stopOpacity={0.2} />
            </linearGradient>
          </defs>
      <rect width={width} height={height} fill={"#141414"} rx={14} />
      <Group top={40}>
        {data.map((d, i) => {
          const letter = x(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(y(d));
          const barX = xScale(letter);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(23, 233, 217, .5)"
              onClick={event => {
                alert(`clicked: ${JSON.stringify(Object.values(d))}`);
              }}
            />
          );
        })}
      </Group>
    </svg>
  );
};

export {
    BarChart,
};