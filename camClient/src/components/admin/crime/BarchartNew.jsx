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

import { Select as NextSelect, SelectItem } from "@nextui-org/react";

const BarChartNew = ({ title, crimes }) => {
  const [selectedBarangay, setSelectedBarangay] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const barangays = useMemo(() => {
    return crimes
      ? ["All", ...new Set(crimes.map((crime) => crime.barangay))]
      : [];
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
        const crimeYear = new Date(date_committed).getFullYear();
        if (
          (selectedBarangay !== "All" && barangay !== selectedBarangay) ||
          (selectedYear !== "All" && crimeYear !== parseInt(selectedYear))
        ) {
          return;
        }
        let offenseName = offense.split(" - ")[0];
        counts[offenseName] = (counts[offenseName] || 0) + 1;
      });
    }
    const result = Object.entries(counts).map(([offense, count]) => ({
      offense,
      count,
    }));
    return result;
  }, [crimes, selectedBarangay, selectedYear]);

  useEffect(() => {
    if (!selectedBarangay || selectedBarangay === "") {
      setSelectedBarangay("All");
    }

    if (!selectedYear || selectedYear === "") {
      setSelectedYear("All");
    }
  }, [selectedBarangay, selectedYear]);

  return (
    <div className="flex flex-col w-[100%] h-[350px]">
      <div className="flex justify-between items-center mx-5">
        <p className="text-lg font-bold text-slate-500">{title}</p>
        <div className="w-3/12 flex gap-3">
          <NextSelect
            label="Barangay"
            aria-label="Select Barangay"
            placeholder="All"
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}>
            {barangays.map((barangay) => (
              <SelectItem key={barangay} value={barangay} textValue={barangay}>
                {barangay}
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
            dataKey="offense"
            tick={{ fontSize: 10 }}
            angle={-90}
            textAnchor="end"
            interval={0}
          />
          <YAxis dataKey="count" domain={[0, "auto"]} />
          <Tooltip />
          <Bar dataKey="count" fill="#dc143c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartNew;
