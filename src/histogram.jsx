import React from 'react';
import Plot from 'react-plotly.js';

const Histogram = ({ data }) => {
  console.log(data)
  return (
    <Plot
      data={[
        {
          x: data,
          type: 'histogram',
        },
      ]}
      layout={{
        title: 'Histogram',
        xaxis: { title: 'Heights' },
        yaxis: { title: 'Count' },
      }}
    />
  );
};

export default Histogram;