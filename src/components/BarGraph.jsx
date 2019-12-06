import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { Area, LinePath, Line } from '@vx/shape';

// import { GradientTealBlue } from '@vx/gradient';
import { scaleBand, scaleLinear } from '@vx/scale';
import { AxisLeft, AxisRight, AxisBottom } from '@vx/axis';


const x = d => d.connectionCount;
const y = d => d.totalNodes;

function numTicksForHeight(height) {
    if (height <= 300) return 3;
    if (300 < height && height <= 600) return 5;
    return 10;
  }
  
  function numTicksForWidth(width) {
    if (width <= 300) return 2;
    if (300 < width && width <= 400) return 5;
    return 10;
  }
  

const BarChart = ({ width, height, data }) => {
  // bounds
  const xMax = width ;
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
      {/* <GradientTealBlue id="teal" /> */}
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
      <Group left={0}>

      {/* <AxisBottom
          top={height - 0}
          left={0}
          scale={xScale}
          numTicks={numTicksForWidth(width)}
          label="Time"
        >
          {axis => {
            const tickLabelSize = 10;
            const tickRotate = 45;
            const tickColor = '#ffffff';
            const axisCenter = (axis.axisToPoint.x - axis.axisFromPoint.x) / 2;
            return (
              <g className="my-custom-bottom-axis">
                {axis.ticks.map((tick, i) => {
                  const tickX = tick.to.x;
                  const tickY = tick.to.y + tickLabelSize + axis.tickLength;
                  return (
                    <Group key={`vx-tick-${tick.value}-${i}`} className={'vx-axis-tick'}>
                      <Line from={tick.from} to={tick.to} stroke={tickColor} />
                      <text
                        transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                        fontSize={tickLabelSize}
                        textAnchor="middle"
                        fill={tickColor}
                      >
                        {tick.formattedValue}
                      </text>
                    </Group>
                  );
                })}
                <text textAnchor="middle" transform={`translate(${axisCenter}, 50)`} fontSize="8">
                  {axis.label}
                </text>
              </g>
            );
          }}
        </AxisBottom> */}

        {/* <AxisLeft
          top={0}
          left={20}
          scale={yScale}
          hideZero
          numTicks={numTicksForHeight(height)}
          label="Axis Left Label"
          labelProps={{
            fill: '#ffffff',
            textAnchor: 'middle',
            fontSize: 12,
            fontFamily: 'Roboto'
          }}
          stroke="#ffffff"
          tickStroke="#ffffff"
          tickLabelProps={(value, index) => ({
            fill: '#ffffff',
            textAnchor: 'end',
            fontSize: 10,
            fontFamily: 'Roboto',
            dx: '-0.25em',
            dy: '0.25em'
          })}
          tickComponent={({ formattedValue, ...tickProps }) => (
            <text {...tickProps}>{formattedValue}</text>
          )}
        /> */}
        </Group>
    </svg>
  );
};

export {
    BarChart,
};