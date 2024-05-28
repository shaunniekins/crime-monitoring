import React, { useEffect } from "react";
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

  return (
    <div className="flex flex-col w-full h-[350px]">
      <div className="flex justify-between items-center mx-5">
        <p className="text-lg font-bold text-slate-500">{title}</p>
        <div className="w-3/12">
          <NextSelect
            label="Crime"
            aria-label="Select Crime Type"
            placeholder="All"
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
      <ResponsiveContainer>
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
    </div>
  );
}
