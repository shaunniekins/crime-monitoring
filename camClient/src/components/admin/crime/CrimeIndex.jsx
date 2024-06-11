import React, { useState, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Select from "react-select";

import {
  Tabs,
  Tab,
  Input,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { Select as NextSelect, SelectItem } from "@nextui-org/react";
import {
  barangayOpt1,
  indexCrimes,
  offenseOpt,
  offenseOpt1,
} from "../../options";

export default function CrimeIndex({ accessToken }) {
  const [datas, setDatas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isIndexCrime, setIsIndexCrime] = useState("true");
  const printRef = React.useRef();

  const [selectedOffense, setSelectedOffense] = useState("All");
  const [selectedBarangay, setSelectedBarangay] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCaseStatus, setSelectedCaseStatus] = useState("All");

  const [totalPercentage, setTotalPercentage] = useState(0);

  const entriesPerPage = 20;

  // SELECT OPTIONS
  const currentYear = new Date().getFullYear();
  const yearOpt = [];
  for (let year = currentYear; 2000 <= year; year--) {
    if (year === currentYear) {
      yearOpt.push({ label: "All", value: "CLEAR" });
    }
    yearOpt.push({ label: year, value: year });
  }

  const caseStatusOpt = [
    { label: "All", value: "CLEAR" },
    { label: "Solved", value: "Solved" },
    { label: "Cleared", value: "Cleared" },
    { label: "Under Investigation", value: "Under Investigation" },
  ];

  // GET
  const getCrimesForPercentage = async () => {
    let totalCount = 0;
    await axios
      .get(`/crime/index`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        totalCount = res.data.totalCount;
      });
    return totalCount;
  };

  const getCrimes = async () => {
    const barangay = selectedBarangay === "All" ? "CLEAR" : selectedBarangay;
    const offense = selectedOffense === "All" ? "CLEAR" : selectedOffense;
    const year =
      selectedYear === "Select Year" || selectedYear === "All"
        ? "CLEAR"
        : selectedYear;
    const caseStatus =
      selectedCaseStatus === "All" ? "CLEAR" : selectedCaseStatus;

    const res = await axios.get(`/crime/index`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: currentPage,
        limit: entriesPerPage,
        isIndex: isIndexCrime,
        barangay: barangay,
        offense: offense,
        year: year,
        caseStatus: caseStatus,
      },
    });

    setDatas(res.data.data);
    setTotalCount(res.data.totalCount);
    setTotalPages(Math.ceil(res.data.totalCount / entriesPerPage));

    // Compute the percentage
    const filteredCount = res.data.totalCount;
    const totalCount = await getCrimesForPercentage();
    const percentage = (filteredCount / totalCount) * 100;
    setTotalPercentage(percentage);
  };

  useEffect(() => {
    getCrimes();
  }, [
    currentPage,
    isIndexCrime,
    selectedBarangay,
    selectedOffense,
    selectedYear,
    selectedCaseStatus,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBarangay, selectedOffense, selectedYear, selectedCaseStatus]);

  const [filteredOffenseOpt1, setFilteredOffenseOpt1] = useState(offenseOpt1);

  const isIndexCrimeFunction = () => {
    const filtered = offenseOpt1.filter((option) => {
      if (isIndexCrime === "true") {
        return indexCrimes.some((keyword) =>
          option.label.toLowerCase().includes(keyword)
        );
      } else {
        return !indexCrimes.some((keyword) =>
          option.label.toLowerCase().includes(keyword)
        );
      }
    });
    setFilteredOffenseOpt1(filtered);
  };

  useEffect(() => {
    isIndexCrimeFunction();
  }, [isIndexCrime, offenseOpt1]);

  const handlePrint = useReactToPrint({
    content: () => {
      const printContent = document.createElement("div");
      const header = `
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
        <img src="${process.env.PUBLIC_URL}/pnp-logo.png" alt="Logo" className="w-5 h-5 size-2" />
          <div class="flex flex-col justify-between items-center">
            <h2 class="">Republic of the Philippines</h2>
            <h2 class="">NATIONAL POLICE COMMISSION</h2>
            <h1 class="font-semibold">PHILIPPINE NATIONAL POLICE</h1>
            <h1 class="font-semibold">CRIMINAL INVESTAGTION AND DETECTION GROUP</h1>
            <h2 class="">Camp Bgen Rafael T. Crame, Quezon City</h2>
          </div>
          <img src="${process.env.PUBLIC_URL}/bunawan-pnp-logo.jpg" alt="Logo" className="w-5 h-5" style="visibility: hidden;" />
        </div>

        <div class="w-full mt-5 self-start flex">
          <div class="w-full h-1 mt-3 mb-10 border-b-2 border-black" />
          </div>
        </div>
      </div>
    `;
      printContent.innerHTML = header + printRef.current.outerHTML;
      return printContent;
    },
    pageStyle: `
    @page {
      margin: 20mm;
    }
  `,
  });

  const columns = [
    { key: "id", label: "Crime I.D" },
    { key: "barangay", label: "Barangay" },
    { key: "date_reported", label: "Date Reported" },
    { key: "date_committed", label: "Date Committed" },
    { key: "type_place", label: "Place/Type" },
    { key: "offense", label: "Offense" },
    { key: "stages_felony", label: "Stages Felony" },
    { key: "case_status", label: "Case Status" },
  ];

  return (
    <div className="w-full h-full p-2 sm:p-5 shadow-lg rounded-sm bg-white">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-bold text-2xl">CRIME TYPE</p>
            <div className="flex justify-center items-center gap-3">
              <Tabs
                key="lg"
                size="lg"
                aria-label="crime-class-select"
                onSelectionChange={setIsIndexCrime}>
                <Tab key="true" title="Index Crimes" />
                <Tab key="false" title="Non-Index Crimes" />
              </Tabs>
              <Button
                variant="light"
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-printer-fill"
                    viewBox="0 0 16 16">
                    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1" />
                    <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                  </svg>
                }
                onClick={handlePrint}>
                Print
              </Button>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex gap-2 justify-end items-center w-full">
              <NextSelect
                label="Barangay"
                aria-label="Select Barangay"
                placeholder="All"
                // className="w-[300px]"
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}>
                <SelectItem key={"CLEAR"} value={"CLEAR"} textValue={"All"}>
                  All
                </SelectItem>
                {barangayOpt1.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    textValue={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </NextSelect>
              <NextSelect
                label="Offense"
                aria-label="Select Offense"
                placeholder="All"
                className="max-w-96"
                value={selectedOffense}
                onChange={(e) => setSelectedOffense(e.target.value)}>
                <SelectItem key={"CLEAR"} value={"CLEAR"} textValue={"All"}>
                  All
                </SelectItem>
                {filteredOffenseOpt1.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    textValue={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </NextSelect>
              <NextSelect
                label="Year"
                aria-label="Select Year"
                placeholder="All"
                // className="w-[300px]"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}>
                {yearOpt.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    textValue={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </NextSelect>

              <NextSelect
                label="Case Status"
                aria-label="Select Case Status"
                placeholder="All"
                // className="w-[300px]"
                value={selectedCaseStatus}
                onChange={(e) => setSelectedCaseStatus(e.target.value)}>
                {caseStatusOpt.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    textValue={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </NextSelect>
            </div>

            <hr className="my-5" />
          </div>
        </div>

        <div className="py-2 px-2 bg-slate-100 flex justify-between items-center rounded-xl mb-3">
          <p className="font-semibold text-slate-600">
            Total Cases: <span className="font-bold">{totalCount}</span>
          </p>
          <p>
            <span className="font-black text-red-600">
              {(!selectedBarangay ||
                selectedBarangay === "All" ||
                selectedBarangay === "CLEAR") &&
              (!selectedOffense ||
                selectedOffense === "All" ||
                selectedOffense === "CLEAR") &&
              (!selectedYear ||
                selectedYear === "All" ||
                selectedYear === "Select Year" ||
                selectedYear === "CLEAR") &&
              (!selectedCaseStatus ||
                selectedCaseStatus === "All" ||
                selectedCaseStatus === "CLEAR")
                ? "100%"
                : `${totalPercentage.toFixed(2)}%`}
            </span>
          </p>
        </div>
        <Table
          ref={printRef}
          aria-label="Table Crimes Based on Index"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="default"
                  page={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            ) : null
          }>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="text-center">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={datas}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner />}>
            {(item) => (
              <TableRow key={item.id} className="text-center">
                {(columnKey) => {
                  if (columnKey === "case_status") {
                    return (
                      <TableCell className="text-xs">
                        <span
                          className={`py-1 px-3 rounded-lg ${
                            item[columnKey] === "Cleared"
                              ? "bg-green-200"
                              : item[columnKey] === "Solved"
                              ? "bg-blue-200"
                              : "bg-amber-100"
                          }`}>
                          {item[columnKey]}
                        </span>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell className="text-xs">{item[columnKey]}</TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
