import React, { useState, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
} from "@nextui-org/react";

export default function CrimeIndex({ accessToken }) {
  const [datas, setDatas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isIndexCrime, setIsIndexCrime] = useState("true");
  const printRef = React.useRef();

  const entriesPerPage = 8;

  const handleRadioChange = (event) => {
    setIsIndexCrime(event.target.value);
  };

  // SELECT OPTIONS
  const currentYear = new Date().getFullYear();
  const yearOpt = [];
  for (let year = currentYear; 2000 <= year; year--) {
    if (year === currentYear) {
      yearOpt.push({ label: "CLEAR", value: "CLEAR" });
    }
    yearOpt.push({ label: year, value: year });
  }

  // GET
  const getCrimes = async () => {
    await axios
      .get(`/crime/index`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: currentPage,
          limit: entriesPerPage,
          isIndex: isIndexCrime,
        },
      })
      .then((res) => {
        setDatas(res.data.data);
        setTotalCount(res.data.totalCount);
        setTotalPages(Math.ceil(res.data.totalCount / entriesPerPage));
      });
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
            @page {
                margin: 10mm; /* Adjust margin size as needed */
            }
            `,
  });

  useEffect(() => {
    getCrimes();
  }, [currentPage, isIndexCrime]);

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
    <div className="flex flex-col gap-2 w-full p-3 bg-white text-sm">
      <div className="border-b-2 border-slate-200 p-2">
        <p>Filter:</p>
        <div className="flex ps-14 gap-5 justify-between px-5">
          <div className="flex w-2/6 gap-2">
            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="type"
                onChange={handleRadioChange}
                value={true}
                checked={isIndexCrime === "true"}
              />
              Index Crimes
            </div>
            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="type"
                onChange={handleRadioChange}
                value={false}
                checked={isIndexCrime === "false"}
              />
              Non-Index Crimes
            </div>
          </div>
          <div>
            <button
              className="flex gap-2 items-center hover:text-slate-600 duration-200"
              onClick={handlePrint}>
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
              Print
            </button>
          </div>
        </div>
      </div>
      <div className="py-2 px-2 bg-slate-100 flex items-center">
        <p className="font-semibold text-slate-600">
          Total Cases: <span className="font-bold">{totalCount}</span>
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
                        className={`p-1 ${
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
  );
}
