import React, { useMemo, useState, useEffect } from "react";
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
import { CustomTooltip2 } from "./CustomTooltip";

const BarChartNonIndex = ({ title, crimes }) => {
  const [selectedOffense, setSelectedOffense] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const offenses = Array.from(
    new Set(
      crimes
        .filter((crime) => crime.type === "non-index")
        .map((crime) => crime.offense)
    )
  ).sort();
  offenses.unshift("All");
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

  useEffect(() => {
    if (!selectedMonth || selectedMonth === "") {
      setSelectedMonth("All");
    }

    if (!selectedYear || selectedYear === "") {
      setSelectedYear("All");
    }

    if (!selectedOffense || selectedOffense === "") {
      setSelectedOffense("All");
    }
  }, [crimes, selectedMonth, selectedYear, selectedOffense]);

  const formattedData = useMemo(() => {
    const counts = {};

    const defaultData = [
      { barangay: "Bunawan Brook", total_cases: 0 },
      { barangay: "Consuelo", total_cases: 0 },
      { barangay: "Imelda", total_cases: 0 },
      { barangay: "Libertad", total_cases: 0 },
      { barangay: "Mambalili", total_cases: 0 },
      { barangay: "Nueva Era", total_cases: 0 },
      { barangay: "Poblacion", total_cases: 0 },
      { barangay: "San Andres", total_cases: 0 },
      { barangay: "San Marcos", total_cases: 0 },
      { barangay: "San Teodoro", total_cases: 0 },
    ];

    if (crimes) {
      crimes.forEach((crime) => {
        const { barangay, type, offense, date_committed } = crime;
        const crimeDate = new Date(date_committed);
        const crimeYear = crimeDate.getFullYear();
        const crimeMonth = crimeDate.getMonth();

        // Skip this crime if it's an index crime
        if (type === "index") {
          return;
        }

        // Skip this crime if its year doesn't match the selected year
        if (selectedYear !== "All" && crimeYear !== parseInt(selectedYear)) {
          return;
        }

        // Skip this crime if its month doesn't match the selected month and the selected month is not "All"
        if (
          selectedMonth !== "All" &&
          selectedMonth !== "0" &&
          crimeMonth !== parseInt(selectedMonth)
        ) {
          return;
        }

        // Skip this crime if its offense doesn't match the selected offense and the selected offense is not "All"
        if (selectedOffense !== "All" && offense !== selectedOffense) {
          return;
        }

        // Initialize counts object for the barangay if not already exists
        counts[barangay] = counts[barangay] || { total_cases: 0, offenses: {} };

        // Increment the total_cases count for the barangay
        counts[barangay].total_cases++;

        // Increment the count for the offense type
        counts[barangay].offenses[offense] =
          (counts[barangay].offenses[offense] || 0) + 1;
      });
    }

    // Update the default data with the actual values
    const updatedData = defaultData.map((item) => {
      const actualCounts = counts[item.barangay];
      if (actualCounts) {
        return { ...item, ...actualCounts };
      } else {
        return item;
      }
    });

    return updatedData;
  }, [crimes, selectedYear, selectedMonth, selectedOffense]);

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
        <div className="w-full md:w-3/6 grid grid-cols-1 md:flex gap-3">
          <NextSelect
            label="Offense"
            aria-label="Select Offense"
            placeholder="All"
            className="md:w-[300px]"
            value={selectedOffense}
            onChange={(e) => setSelectedOffense(offenses[e.target.value])}>
            {offenses.map((offense, index) => {
              return (
                <SelectItem
                  key={index.toString()}
                  value={index}
                  textValue={offense}>
                  {offense}
                </SelectItem>
              );
            })}
          </NextSelect>
          <NextSelect
            label="Month"
            aria-label="Select Month"
            placeholder="All"
            className="md:w-[300px]"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}>
            {monthNames.map((month, index) => (
              <SelectItem
                key={index.toString()}
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
            className="md:w-[300px]"
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
      {isMdScreen ? (
        <ResponsiveContainer width={containerWidth} height={containerHeight}>
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
                <CustomTooltip2
                  payload={formattedData}
                  className="overflow-auto"
                />
              }
              className="overflow-auto"
            />
            <Bar dataKey="total_cases" fill="#0000cd" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full overflow-x-auto md:overflow-x-hidden">
          <ResponsiveContainer width={containerWidth} height={containerHeight}>
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
                  <CustomTooltip2
                    payload={formattedData}
                    className="overflow-auto"
                  />
                }
                className="overflow-auto"
              />
              <Bar dataKey="total_cases" fill="#0000cd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BarChartNonIndex;
