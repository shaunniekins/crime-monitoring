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
  selectedMonth,
  setSelectedMonth,
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
          {/* <div className="w-3/6 flex gap-3"> */}
          {/* <NextSelect
            label="Month"
            aria-label="Select Month"
            placeholder="All"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}>
            <SelectItem key="all" value="All" textValue="All">
              All
            </SelectItem>
            <SelectItem key="january" value="January" textValue="January">
              January
            </SelectItem>
            <SelectItem key="february" value="February" textValue="February">
              February
            </SelectItem>
            <SelectItem key="march" value="March" textValue="March">
              March
            </SelectItem>
            <SelectItem key="april" value="April" textValue="April">
              April
            </SelectItem>
            <SelectItem key="may" value="May" textValue="May">
              May
            </SelectItem>
            <SelectItem key="june" value="June" textValue="June">
              June
            </SelectItem>
            <SelectItem key="july" value="July" textValue="July">
              July
            </SelectItem>
            <SelectItem key="august" value="August" textValue="August">
              August
            </SelectItem>
            <SelectItem key="september" value="September" textValue="September">
              September
            </SelectItem>
            <SelectItem key="october" value="October" textValue="October">
              October
            </SelectItem>
            <SelectItem key="november" value="November" textValue="November">
              November
            </SelectItem>
            <SelectItem key="december" value="December" textValue="December">
              December
            </SelectItem>
          </NextSelect> */}
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
