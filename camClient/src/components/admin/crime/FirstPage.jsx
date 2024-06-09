import React, { useState, useEffect, useMemo } from "react";
import PolygonMap from "./PolygonMap";
import { FaLocationDot } from "react-icons/fa6";
import DisplayWanted from "../../DisplayWanted";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { indexCrimes, offenseOpt1 } from "../../options";

const barangayColors = {
  Consuelo: "bg-gray-600",
  "Bunawan Brook": "bg-yellow-400",
  "San Teodoro": "bg-pink-300",
  Libertad: "bg-green-500",
  "San Andres": "bg-orange-400",
  Imelda: "bg-purple-600",
  Poblacion: "bg-fuchsia-500",
  Mambalili: "bg-teal-600",
  "Nueva Era": "bg-cyan-300",
};

const barangayList = Object.keys(barangayColors);

export default function FirstPage({ crimes }) {
  const [updatedData, setUpdatedData] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCrimeType, setSelectedCrimeType] = useState("all");
  const [selectedIndexCrime, setSelectedIndexCrime] = useState("");
  const [selectedNonIndexCrime, setSelectedNonIndexCrime] = useState("");

  const getBarangayColor = (barangay) => {
    return barangayColors[barangay] || "bg-blue-500";
  };

  const isIndexCrime = (offense) => {
    if (selectedIndexCrime) {
      return offense.toLowerCase().includes(selectedIndexCrime.toLowerCase());
    }
    return indexCrimes.some((keyword) =>
      offense.toLowerCase().includes(keyword)
    );
  };

  const isNonIndexCrime = (offense) => {
    if (selectedNonIndexCrime) {
      return (
        offense.toLowerCase().includes(selectedNonIndexCrime.toLowerCase()) &&
        !indexCrimes.some((keyword) =>
          offense.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    return !indexCrimes.some((keyword) =>
      offense.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const processedData = useMemo(() => {
    if (!crimes) return [];

    return crimes.map((dataItem) => ({
      ...dataItem,
      type: isIndexCrime(dataItem.offense)
        ? "index"
        : isNonIndexCrime(dataItem.offense)
        ? "non-index"
        : "other",
    }));
  }, [crimes, selectedIndexCrime, selectedNonIndexCrime]);

  const years = useMemo(() => {
    const yearsSet = new Set();
    processedData.forEach((crime) => {
      const year = new Date(crime.date_committed).getFullYear();
      if (!isNaN(year)) {
        yearsSet.add(year);
      }
    });
    return [...yearsSet].sort((a, b) => b - a);
  }, [processedData]);

  const counts = useMemo(() => {
    const counts = {};
    processedData.forEach((crime) => {
      const { barangay, type } = crime;
      const year = new Date(crime.date_committed).getFullYear();

      if (
        (barangay === selectedBarangay || selectedBarangay === "all") &&
        (year.toString() === selectedYear || selectedYear === "all") &&
        (type === selectedCrimeType || selectedCrimeType === "all")
      ) {
        counts[barangay] = counts[barangay] || {
          index: 0,
          nonIndex: 0,
          other: 0,
        };
        if (type === "index") {
          counts[barangay].index++;
        } else if (type === "non-index") {
          counts[barangay].nonIndex++;
        } else {
          counts[barangay].other++;
        }
      }
    });
    return counts;
  }, [
    processedData,
    selectedBarangay,
    selectedYear,
    selectedCrimeType,
    selectedNonIndexCrime,
  ]);

  const filteredData = useMemo(() => {
    return processedData.filter((data) => {
      const year = new Date(data.date_committed).getFullYear();
      return (
        (data.barangay === selectedBarangay || selectedBarangay === "all") &&
        (year.toString() === selectedYear || selectedYear === "all") &&
        (data.type === selectedCrimeType || selectedCrimeType === "all")
      );
    });
  }, [processedData, selectedBarangay, selectedYear, selectedCrimeType]);

  useEffect(() => {
    setUpdatedData(processedData);
  }, [processedData]);

  const getLegendItems = () => {
    const legendItems = [];

    if (selectedCrimeType === "all" || selectedCrimeType === "index") {
      legendItems.push(
        <div key="index" className="flex gap-1">
          <FaLocationDot className="text-red-600 text-2xl" />
          <p>
            Index Crimes
            {/* (
            {selectedIndexCrime || indexCrimes.join(", ")}) */}
          </p>
        </div>
      );
    }

    if (selectedCrimeType === "all" || selectedCrimeType === "non-index") {
      legendItems.push(
        <div key="non-index" className="flex gap-1">
          <FaLocationDot className="text-blue-600 text-2xl" />
          <p>
            Non-Index Crimes
            {/* (
            {selectedNonIndexCrime || nonIndexCrimes.join(", ")}) */}
          </p>
        </div>
      );
    }

    return legendItems;
  };

  return (
    <div className="w-full">
      <Tabs aria-label="Options">
        <Tab key="crime" title="Crime">
          <Card>
            <CardBody>
              <div className="flex relative">
                <div className="w-full">
                  {updatedData && (
                    <PolygonMap
                      crimes={filteredData}
                      barangay={selectedBarangay}
                    />
                  )}
                </div>
                <div className="w-56 py-3 px-2 absolute top-0 right-0 text-sm flex-flex-col bg-black">
                  <select
                    name="filter-barangay"
                    id="filter-barangay"
                    onChange={(e) => setSelectedBarangay(e.target.value)}
                    className="px-3 py-2 rounded-lg mb-3 w-full">
                    <option value="">Select Barangay</option>
                    <option value="all">All Barangay</option>
                    {barangayList.map((barangay) => (
                      <option value={barangay} key={barangay}>
                        {barangay}
                      </option>
                    ))}
                  </select>
                  <select
                    name="filter-year"
                    id="filter-year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-2 rounded-lg mb-3 w-full">
                    <option value="all">All Years</option>
                    {years.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    name="filter-crime-type"
                    id="filter-crime-type"
                    onChange={(e) => setSelectedCrimeType(e.target.value)}
                    className="px-3 py-2 rounded-lg w-full">
                    <option value="all">All Crimes</option>
                    <option value="index">Index Crimes</option>
                    <option value="non-index">Non-Index Crimes</option>
                  </select>

                  {selectedCrimeType === "index" && (
                    <select
                      name="filter-index-crime"
                      id="filter-index-crime"
                      onChange={(e) => setSelectedIndexCrime(e.target.value)}
                      className="px-3 py-2 rounded-lg mt-3 w-full">
                      <option value="">All Index Crimes</option>
                      {offenseOpt1
                        .filter((opt) =>
                          indexCrimes.some((crime) =>
                            opt.label
                              .toLowerCase()
                              .includes(crime.toLowerCase())
                          )
                        )
                        .map((crime) => (
                          <option value={crime.value} key={crime.value}>
                            {crime.label
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </option>
                        ))}
                    </select>
                  )}

                  {selectedCrimeType === "non-index" && (
                    <select
                      name="filter-non-index-crime"
                      id="filter-non-index-crime"
                      onChange={(e) => setSelectedNonIndexCrime(e.target.value)}
                      className="px-3 py-2 rounded-lg mt-3 w-full">
                      <option value="">All Non-Index Crimes</option>
                      {offenseOpt1
                        .filter(
                          (opt) =>
                            !indexCrimes.some((crime) =>
                              opt.label
                                .toLowerCase()
                                .includes(crime.toLowerCase())
                            )
                        )
                        .map((opt) => (
                          <option value={opt.value} key={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                  )}

                  {Object.entries(counts).map(
                    ([barangay, { index, nonIndex, other }]) => (
                      <div
                        key={barangay}
                        className={`flex justify-between items-center gap-2 p-1 mt-3 text-xs ${getBarangayColor(
                          barangay
                        )}`}>
                        <p className="text-white p-2 font-bold">{barangay}</p>
                        {selectedCrimeType === "all" ? (
                          <>
                            <div className="text-white">
                              <p className="text-xs">
                                Index:{" "}
                                <span className="font-semibold">{index}</span>
                              </p>
                              <p className="text-xs">
                                Non-Index:{" "}
                                <span className="font-semibold">
                                  {nonIndex}
                                </span>
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-white">
                              <p className="text-xs">
                                {selectedCrimeType === "index"
                                  ? `${selectedIndexCrime || "Index Crimes"}: `
                                      .split(" ")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")
                                  : `${
                                      selectedNonIndexCrime ||
                                      "Non-Index Crimes"
                                    }: `
                                      .split(" ")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                <span className="font-semibold">
                                  {selectedCrimeType === "index"
                                    ? index
                                    : nonIndex}
                                </span>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  )}

                  {selectedCrimeType === "all" &&
                    filteredData &&
                    filteredData.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1 text-white">
                        {getLegendItems()}
                      </div>
                    )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="person-of-concern" title="Person of Concern">
          <Card>
            <CardBody>
              <div className="container mx-auto h-full bg-gray-100 shadow-md p-3 m-2 rounded-lg text-center text-slate-500 font-bold">
                <DisplayWanted />
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
