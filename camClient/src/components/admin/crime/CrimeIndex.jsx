import React, { useState, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

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

export default function CrimeIndex({ accessToken }) {
  const [datas, setDatas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isIndexCrime, setIsIndexCrime] = useState("true");
  const printRef = React.useRef();

  const entriesPerPage = 20;

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
    <div className="w-full h-full p-2 sm:p-5 shadow-lg rounded-sm bg-white">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="font-bold text-2xl">INDEX/NON-INDEX CRIME</p>
          <div className="flex items-center gap-2">
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

        <div className="py-2 px-2 bg-slate-100 flex items-center rounded-xl mt-2 mb-3">
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
    </div>
  );
}
