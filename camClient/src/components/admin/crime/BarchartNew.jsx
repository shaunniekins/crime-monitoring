import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

import { Select as NextSelect, SelectItem } from "@nextui-org/react";

const BarChartNew = ({ title, crimes }) => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const months = useMemo(() => {
    if (!crimes) return [];

    const monthsSet = new Set(
      crimes
        .map((crime) => new Date(crime.date_committed).getMonth())
        .filter((month) => !isNaN(month))
    );

    const sortedMonths = Array.from(monthsSet).sort((a, b) => b - a);

    return ["All", ...sortedMonths];
  }, [crimes]);

  const years = useMemo(() => {
    if (!crimes) return [];

    const yearsSet = new Set(
      crimes
        .map((crime) => new Date(crime.date_committed).getFullYear())
        .filter((year) => !isNaN(year))
    );

    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    return ["All", ...sortedYears];
  }, [crimes]);

  const formattedData = useMemo(() => {
    const counts = {};

    if (crimes) {
      crimes.forEach((crime) => {
        const { barangay, type, offense, date_committed } = crime;
        const crimeDate = new Date(date_committed);
        const crimeYear = crimeDate.getFullYear();
        const crimeMonth = crimeDate.getMonth();

        // Skip this crime if its year doesn't match the selected year
        if (selectedYear !== "All" && crimeYear !== parseInt(selectedYear)) {
          return;
        }

        // Skip this crime if its month doesn't match the selected month
        if (selectedMonth !== "All" && crimeMonth !== parseInt(selectedMonth)) {
          return;
        }

        // Initialize counts object for the barangay if not already exists
        counts[barangay] = counts[barangay] || { total_cases: 0, offenses: {} };

        // If the crime type is index, increment the total_cases count for the barangay
        if (type === "index") {
          counts[barangay].total_cases++;

          // Increment the count for the offense type
          counts[barangay].offenses[offense] =
            (counts[barangay].offenses[offense] || 0) + 1;
        }
      });
    }

    // Convert counts object to the desired format
    const result = Object.entries(counts).map(
      ([barangay, { total_cases, offenses }]) => ({
        barangay,
        total_cases,
        offenses: Object.entries(offenses).map(([offense, count]) => ({
          offense,
          count,
        })),
      })
    );

    return result;
  }, [crimes, selectedYear, selectedMonth]);

  useEffect(() => {
    if (!selectedMonth || selectedMonth === "") {
      setSelectedMonth("All");
    }

    if (!selectedYear || selectedYear === "") {
      setSelectedYear("All");
    }
  }, [selectedMonth, selectedYear]);

  const monthNames = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex flex-col w-[100%] h-[350px]">
      <div className="flex justify-between items-center mx-5">
        <p className="text-lg font-bold text-slate-500">{title}</p>
        <div className="w-3/12 flex gap-3">
          <NextSelect
            label="Month"
            aria-label="Select Month"
            placeholder="All"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}>
            {monthNames.map((month, index) => (
              <SelectItem
                key={index.toString()} // change this to match the value prop
                value={index.toString()}
                textValue={month}>
                {month}
              </SelectItem>
            ))}
          </NextSelect>
          <NextSelect
            label="Year"
            aria-label="Select Year"
            placeholder="All"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map((year) => (
              <SelectItem key={year} value={year} textValue={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </NextSelect>
        </div>
      </div>
      <ResponsiveContainer>
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          className="text-xs">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="barangay"
            tick={{ fontSize: 14 }}
            textAnchor="end"
            interval={0}
          />
          <YAxis dataKey="total_cases" domain={[0, 500]} />
          <Tooltip
            content={
              <CustomTooltip
                payload={formattedData}
                className="overflow-auto"
              />
            }
            className="overflow-auto"
          />
          <Bar dataKey="total_cases" fill="#dc143c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartNew;
