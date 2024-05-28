import React from 'react';
import MousePositionProvider from './MousePositionProvider';

const CustomTooltip2 = ({ active, payload, label }) => {
  return (
    <MousePositionProvider>
      {(mousePosition) => {
        if (active && payload && payload.length) {
          const data = payload[0].payload; // The data for the hovered/clicked bar

          // You can now access additional data in 'data' and use it in the tooltip
          const tooltipStyle = {
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            zIndex: 9999, // Set a higher z-index
          };

          return (
            <div className='absolute top-0 left-0 w-screen h-screen flex justify-center items-center text-xs'>
              <div className="tooltip bg-white border-4 border-slate-400 p-5 w-[600px] h-auto rounded shadow-lg" style={tooltipStyle}>
                <p className='font-semibold'>Barangay: <span className='font-bold text-lg'>{label}</span></p>
                <p className='font-semibold'>Total Cases:  <span className='font-bold text-lg'>{data.total_cases}</span></p>
                {payload[0].payload.offenses.map((data, index) => (
                  <div key={index} className="border-b-2 border-slate-400 ps-2">
                    <p><span className='font-bold'>Offense: </span>{data.offense}( <span className='font-bold'>{data.count} cases</span> )</p>
                  </div>
                ))}
                {/* Display additional data here */}
              </div>
            </div>

          );
        }

        return null;
      }}
    </MousePositionProvider>
  );
};

export default CustomTooltip2;