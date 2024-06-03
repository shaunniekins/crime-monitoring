import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import Pagination from "./Pagination";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Select as NextSelect,
  SelectItem,
  Spinner,
  Pagination,
  Autocomplete,
  AutocompleteItem,
  Button,
} from "@nextui-org/react";
import {
  barangayOpt,
  crimeTypeOpt,
  indexCrimes,
  monthOpt,
  offenseOpt,
} from "../../options";

export default function Crimes({ accessToken }) {
  const [datas, setDatas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [offense, setOffense] = useState("Select Offense");
  const [barangay, setBarangay] = useState("Select Barangay");
  const [year, setYear] = useState("Select Year");
  const [month, setMonth] = useState("Select Month");
  const [crimeType, setCrimeType] = useState("Select Crime Type");
  const [totalCount, setTotalCount] = useState(0);
  const printRef = React.useRef();

  const entriesPerPage = 20;

  // SELECT OPTIONS

  const isIndexCrime = (offense) => {
    return indexCrimes.some((keyword) =>
      offense.toLowerCase().includes(keyword)
    );
  };

  // useEffect(() => {
  //   setOffense("");
  // }, [crimeType]);

  const currentYear = new Date().getFullYear();
  const yearOpt = [{ label: "Select Year", value: "Select Year" }];

  for (let year = currentYear; 2000 <= year; year--) {
    yearOpt.push({ label: year, value: year });
  }

  // GET
  const getCrimes = async () => {
    const monthNumber = monthOpt.find(
      (option) => option.label === month
    )?.value;

    await axios
      .get(`/crime/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: currentPage,
          limit: entriesPerPage,
          offense: offense === "Select Offense" ? null : offense,
          barangay: barangay === "Select Barangay" ? null : barangay,
          year: year === "Select Year" ? null : year,
          month: monthNumber === "Select Month" ? null : monthNumber,
        },
      })
      .then((res) => {
        setDatas(res.data.data);
        setTotalCount(res.data.totalCount);
        setTotalPages(Math.ceil(res.data.totalCount / entriesPerPage));
      });
  };

  useEffect(() => {
    getCrimes();
  }, [currentPage, offense, barangay, year, month]);

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
    { key: "id", label: "Crime ID" },
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
            <p className="font-bold text-2xl">CRIME LIST</p>
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

          <div className="mt-2">
            <div className="flex gap-2 justify-end items-center w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="" className="ps-2">
                  Barangay
                </label>
                <Select
                  placeholder="Select Barangay"
                  options={barangayOpt}
                  value={{ label: barangay, value: barangay }}
                  onChange={(e) => setBarangay(e.value)}
                />
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="" className="ps-2">
                  Crime Type
                </label>
                <Select
                  options={crimeTypeOpt}
                  value={{ label: crimeType, value: crimeType }}
                  onChange={(e) => {
                    setCrimeType(e.value);
                    setOffense("Select Offense");
                  }}></Select>
              </div>

              {crimeType && crimeType !== "Select Crime Type" && (
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="" className="ps-2">
                    Offense
                  </label>
                  <Select
                    options={offenseOpt
                      .filter((option) => {
                        if (crimeType === "index") {
                          return isIndexCrime(option.label);
                        } else {
                          return !isIndexCrime(option.label);
                        }
                      })
                      .map((option) => ({
                        label: option.label,
                        value: option.value,
                      }))}
                    value={{ label: offense, value: offense }}
                    onChange={(e) => setOffense(e.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="" className="ps-2">
                  Year
                </label>
                <Select
                  options={yearOpt}
                  value={{ label: year, value: year }}
                  onChange={(e) => setYear(e.value)}></Select>
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="" className="ps-2">
                  Month
                </label>
                <Select
                  options={monthOpt}
                  value={{ label: month, value: month }}
                  onChange={(e) => setMonth(e.value)}></Select>
              </div>
              <div className="flex flex-col gap-2 w-32">
                <label htmlFor="" className="ps-2">
                  Action
                </label>
                <Button
                  onClick={() => {
                    setOffense("Select Offense");
                    setBarangay("Select Barangay");
                    setYear("Select Year");
                    setMonth("Select Month");
                    setCrimeType("Select Crime Type");
                  }}>
                  Reset
                </Button>
              </div>
            </div>

            <hr className="my-5" />
          </div>
        </div>

        <div className="py-2 px-2 bg-slate-100 flex items-center rounded-xl mb-3">
          <p className="font-semibold text-slate-600">
            Total Cases: <span className="font-bold">{totalCount}</span>
          </p>
        </div>
        <Table
          ref={printRef}
          aria-label="Table Crimes"
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
                  if (columnKey === "id") {
                    return (
                      <TableCell className="text-xs">
                        <Button
                          onClick={() => {
                            setCrimeType(
                              isIndexCrime(item.offense) ? "index" : "non-index"
                            );
                            setBarangay(item.barangay);
                            setOffense(item.offense);
                            setYear(item.date_committed.split("-")[0]);
                            setMonth(
                              monthOpt.find(
                                (option) =>
                                  option.label ===
                                  new Date(item.date_committed).toLocaleString(
                                    "en-US",
                                    { month: "long" }
                                  )
                              )?.label
                            );
                          }}>
                          {item[columnKey]}
                        </Button>
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
