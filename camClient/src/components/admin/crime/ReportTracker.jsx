import React, { useState, useEffect, useMemo } from "react";
import LineChart from "./LineChartVisual";
import StackedBarCharts from "./StackedBarCharts";
import DataPerBarangay from "./DataPerBarangay";
import BarChartNew from "./BarchartNew";
import BarChartNonIndex from "./BarChartNonIndex";

import axios from "axios";

const keywords = [
  "murder",
  "homicide",
  "physical injury",
  "rape",
  "robbery",
  "theft",
  "carnapping",
];

export default function ReportTracker({
  crimes,
  caseStatus,
  totalCasesPerBrgy,
  accessToken,
}) {
  const [updatedData, setUpdatedData] = useState(null);
  const [totalCasesPerYear, setTotalCasesPerYear] = useState([]);
  const [selectedCrimePerYear, setSelectedCrimePerYear] = useState("All");

  const [casePerYear, setCasePerYear] = useState([]);
  const [selectedCrimeCase, setSelectedCrimeCase] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // console.log("crimes", crimes);

  const countCasesPerYear = async () => {
    await axios
      .get(`/crime/countPerYearLineChart?crimeType=${selectedCrimePerYear}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setTotalCasesPerYear(res.data.data);
      });
  };

  useEffect(() => {
    countCasesPerYear();
  }, [selectedCrimePerYear]);

  const getCaseStatusPerYear = async () => {
    await axios
      .get(`/crime/caseStatusPerYearGraph?crimeType=${selectedCrimeCase}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCasePerYear(res.data.data);
      });
  };

  useEffect(() => {
    getCaseStatusPerYear();
  }, [selectedCrimeCase]);

  // Memoized calculation of updated data list
  const memoizedUpdatedDataList = useMemo(() => {
    if (crimes) {
      return crimes.map((dataItem) => {
        // Check if offense contains any of the specified keywords
        const isIndexed = keywords.some((keyword) =>
          dataItem.offense.toLowerCase().includes(keyword)
        );

        // Create new object with updated data
        return { ...dataItem, type: isIndexed ? "index" : "non-index" };
      });
    }
  }, [crimes]);

  useEffect(() => {
    setUpdatedData(memoizedUpdatedDataList);
  }, [memoizedUpdatedDataList]);

  return (
    <div className="flex flex-col w-full h-full gap-3 p-2 sm:p-5 rounded-smoverflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* per brgy */}
        <div className="w-full max-h-56 bg-white shadow-md rounded-md p-3 overflow-y-scroll">
          <div className="text-center w-full">
            <DataPerBarangay totalCasesPerBrgy={totalCasesPerBrgy} />
          </div>
        </div>
        {/* per year */}
        <div className="w-full max-h-56 bg-white shadow-md rounded-md p-3 overflow-y-scroll">
          <div className="text-center w-full">
            <p className="text-start p-2 font-bold text-slate-500">
              Total Cases Per Year
            </p>
            <hr></hr>
            {totalCasesPerYear &&
              totalCasesPerYear.map((count, index) => (
                <p className="font-serif text-lg m-2" key={index}>
                  {count.extracted_year} :{" "}
                  <span className="text-2xl font-bold">
                    {count.total_cases}
                  </span>
                </p>
              ))}
          </div>
        </div>
        {/* Case Status */}
        <div className="w-full max-h-56 bg-white shadow-md rounded-md p-3 overflow-y-scroll">
          <div className="text-center w-full">
            <p className="text-start p-2 font-bold text-slate-500">
              Over All Case Status
            </p>
            <hr></hr>
            <div className="flex flex-col w-full h-full justify-center">
              {caseStatus &&
                caseStatus.map((count, index) => (
                  <p className="font-serif text-lg m-2" key={index}>
                    {count.case_status} :{" "}
                    <span className="text-2xl font-bold">{count.total}</span>
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* charts */}
      <div className="flex flex-col w-full bg-white rounded-md shadow-md p-2">
        {updatedData && (
          <BarChartNew
            title={"Visualizing Total Cases Across Barangays (Index Crimes)"}
            crimes={updatedData}
          />
        )}
      </div>
      <div className="flex flex-col w-full bg-white rounded-md shadow-md p-2">
        {updatedData && (
          <BarChartNonIndex
            title={
              " Visualizing Total Cases Across Barangays (Non-Index Crimes)"
            }
            crimes={updatedData}
          />
        )}
      </div>

      <div className="w-full">
        {/* LINE */}
        <div className="flex gap-5 w-full">
          <div className="flex flex-col w-full bg-white rounded-md shadow-md p-2">
            <LineChart
              title={"Visualizing Trends: Total Cases Over Different Dates"}
              totalCasesPerYear={totalCasesPerYear}
              selectedCrimePerYear={selectedCrimePerYear}
              setSelectedCrimePerYear={setSelectedCrimePerYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full bg-white rounded-md shadow-md p-2">
        <StackedBarCharts
          title={"Yearly Distribution of Cases"}
          casePerYear={casePerYear}
          selectedCrimeCase={selectedCrimeCase}
          setSelectedCrimeCase={setSelectedCrimeCase}
        />
      </div>
    </div>
  );
}
