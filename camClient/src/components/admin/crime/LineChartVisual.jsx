import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Select as NextSelect, SelectItem } from "@nextui-org/react";

export default function LineChartVisual({
  title,
  totalCasesPerYear,
  selectedCrimePerYear,
  setSelectedCrimePerYear,
}) {
  useEffect(() => {
    if (!selectedCrimePerYear || selectedCrimePerYear === "") {
      setSelectedCrimePerYear("All");
    }
  }, [selectedCrimePerYear]);

  return (
    <div className="flex flex-col w-full h-[350px]">
      <div className="flex justify-between items-center mx-5">
        <p className="text-lg font-bold text-slate-500">{title}</p>
        <div className="w-3/12">
          <NextSelect
            label="Crime"
            aria-label="Select Crime Type"
            placeholder="All"
            value={selectedCrimePerYear}
            onChange={(e) => setSelectedCrimePerYear(e.target.value)}>
            <SelectItem key="index" value="Index" textValue="Index">
              Index
            </SelectItem>
            <SelectItem key="non-index" value="Non-Index" textValue="Non-Index">
              Non-Index
            </SelectItem>
          </NextSelect>
        </div>
      </div>
      <ResponsiveContainer>
        <LineChart
          data={totalCasesPerYear}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="extracted_year"
            tick={{ fontSize: 14 }}
            textAnchor="end"
            interval={0}
          />
          <YAxis dataKey={"total_cases"} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_cases"
            stroke="#bf9b30"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
