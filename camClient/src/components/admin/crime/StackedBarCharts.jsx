import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Select as NextSelect, SelectItem } from "@nextui-org/react";

export default function StackedBarCharts({
  title,
  casePerYear,
  selectedCrimeCase,
  setSelectedCrimeCase,
}) {
  useEffect(() => {
    if (!selectedCrimeCase || selectedCrimeCase === "") {
      setSelectedCrimeCase("All");
    }
  }, [selectedCrimeCase]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [containerHeight, setContainerHeight] = useState("100%");
  const [containerWidth, setContainerWidth] = useState("100%");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMdScreen = windowWidth >= 768;

  useEffect(() => {
    setContainerHeight(isMdScreen ? "100%" : 300);
    setContainerWidth(isMdScreen ? "100%" : 1000);
  }, [isMdScreen]);

  return (
    <div className="flex flex-col w-[100%] h-full md:h-[350px]">
      <div className="flex flex-col md:flex-row justify-between items-center mx-5">
        <p className="text-lg font-bold text-slate-500 mb-3 md:mb-0 text-center md:text-start">
          {title}
        </p>
        <div className="w-full md:w-3/6 grid grid-cols-1 md:flex gap-3 md:justify-end">
          <NextSelect
            label="Crime"
            aria-label="Select Crime Type"
            placeholder="All"
            className="md:w-[300px]"
            value={selectedCrimeCase}
            onChange={(e) => setSelectedCrimeCase(e.target.value)}>
            <SelectItem key="index" value="Index" textValue="Index">
              Index
            </SelectItem>
            <SelectItem key="non-index" value="Non-Index" textValue="Non-Index">
              Non-Index
            </SelectItem>
          </NextSelect>
        </div>
      </div>
      {isMdScreen ? (
        <ResponsiveContainer width={containerWidth} height={containerHeight}>
          <BarChart
            data={casePerYear}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 14 }}
              textAnchor="end"
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="under_investigation" stackId="cases" fill="#8884d8" />
            <Bar dataKey="cleared" stackId="cases" fill="#82ca9d" />
            <Bar dataKey="solved" stackId="cases" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full overflow-x-auto md:overflow-x-hidden">
          <ResponsiveContainer width={containerWidth} height={containerHeight}>
            <BarChart
              data={casePerYear}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 14 }}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="under_investigation"
                stackId="cases"
                fill="#8884d8"
              />
              <Bar dataKey="cleared" stackId="cases" fill="#82ca9d" />
              <Bar dataKey="solved" stackId="cases" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
