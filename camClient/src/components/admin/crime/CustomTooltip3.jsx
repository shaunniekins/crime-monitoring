import React, { useEffect } from "react";
import MousePositionProvider from "./MousePositionProvider";

const CustomTooltip3 = ({ active, payload, label }) => {
  return (
    <MousePositionProvider>
      {(mousePosition) => {
        const data = payload; // The data for the hovered/clicked bar

        // You can now access additional data in 'data' and use it in the tooltip
        const tooltipStyle = {
          minWidth: "200px",
          minHeight: "100px",
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y + 400}px`,
          overflowX: "scroll", // Use 'scroll' for scroll priority
          whiteSpace: "nowrap",
          zIndex: 9999, // Set a higher z-index
        };

        return (
          <div
            className="tooltip absolute bg-white p-4 w-[600px] h-96 border rounded shadow-lg overflow-auto overflow-y-auto overflow-x-scroll"
            style={tooltipStyle}>
            <p>WEWJEKWHEKWEKHWKEHWJHWEKJWH</p>
            <p>{`Barangay: ${label}`}</p>
            <p>{`Total Cases: ${data.total_cases}`}</p>
          </div>
        );
      }}
    </MousePositionProvider>
  );
};

export default CustomTooltip3;
