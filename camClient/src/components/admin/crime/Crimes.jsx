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
} from "@nextui-org/react";

export default function Crimes({ accessToken }) {
  const [datas, setDatas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [offense, setOffense] = useState(null);
  const [barangay, setBarangay] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [crimeType, setCrimeType] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const printRef = React.useRef();

  const entriesPerPage = 8;

  // SELECT OPTIONS
  const crimeTypeOpt = [
    { label: "Index Crimes", value: "index" },
    { label: "Non-Index Crimes", value: "non-index" },
  ];

  const offenseOpt = [
    { label: "Under Investigation", value: "Under Investigation" },
    {
      label: "ALARMS AND SCANDALS  - RPC Art. 155",
      value: "ALARMS AND SCANDALS  - RPC Art. 155",
    },
    {
      label:
        "AN ACT INCREASING THE PENALTIES FOR ILLEGAL NUMBERS GAMES, AMENDING CERTAIN PROVISIONS OF PD. NO. 1602, AND FOR OTHER PURPOSES - RA 9287 amending pd 1602",
      value:
        "AN ACT INCREASING THE PENALTIES FOR ILLEGAL NUMBERS GAMES, AMENDING CERTAIN PROVISIONS OF PD. NO. 1602, AND FOR OTHER PURPOSES - RA 9287 amending pd 1602",
    },
    {
      label:
        "ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994  - RA 7832",
      value:
        "ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994  - RA 7832",
    },
    {
      label: "ANTI-GAMBLING LAW  - PD 1602",
      value: "ANTI-GAMBLING LAW  - PD 1602",
    },
    {
      label: "ARSON OF PROPERTY OF SMALL VALUE  - RPC Art. 323",
      value: "ARSON OF PROPERTY OF SMALL VALUE  - RPC Art. 323",
    },
    {
      label: "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002  - RA 9165",
      value: "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002  - RA 9165",
    },
    {
      label:
        "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF DANGEROUS DRUGS - RA 9165 Article II Section 11",
      value:
        "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF DANGEROUS DRUGS - RA 9165 Article II Section 11",
    },
    {
      label:
        "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF EQUIPMENT, INSTRUMENT, APPARATUS AND OTHER PARAPHERNALIA FOR DANGEROUS DRUGS - RA 9165 Article II Section 12",
      value:
        "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF EQUIPMENT, INSTRUMENT, APPARATUS AND OTHER PARAPHERNALIA FOR DANGEROUS DRUGS - RA 9165 Article II Section 12",
    },
    {
      label:
        "COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION  - RA 10591 (covers RA 9516, RA 8294, PD 1866)",
      value:
        "COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION  - RA 10591 (covers RA 9516, RA 8294, PD 1866)",
    },
    {
      label: "DESTRUCTIVE ARSON  - RPC Art. 320 amended by PD 1613 and PD 1744",
      value: "DESTRUCTIVE ARSON  - RPC Art. 320 amended by PD 1613 and PD 1744",
    },
    {
      label: "DIRECT ASSAULTS  - RPC Art. 148",
      value: "DIRECT ASSAULTS  - RPC Art. 148",
    },
    {
      label: "DISCHARGE OF FIREARMS - RPC Art 254",
      value: "DISCHARGE OF FIREARMS - RPC Art 254",
    },
    {
      label:
        "HIGHGRADING OR THEFT OF GOLD FROM A MINING CLAIM OR MINING CAMP (PRESCRIBING A HEAVIER MINIMUM PENALTY FOR) - PD 581",
      value:
        "HIGHGRADING OR THEFT OF GOLD FROM A MINING CLAIM OR MINING CAMP (PRESCRIBING A HEAVIER MINIMUM PENALTY FOR) - PD 581",
    },
    { label: "HOMICIDE  - RPC Art. 249", value: "HOMICIDE  - RPC Art. 249" },
    {
      label:
        "ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 as amended by RA 8294 and RA 9516",
      value:
        "ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 as amended by RA 8294 and RA 9516",
    },
    {
      label:
        "KIDNAPPING AND SERIOUS ILLEGAL DETENTION  - RPC Art. 267 as amended by RA 18 and RA 1084",
      value:
        "KIDNAPPING AND SERIOUS ILLEGAL DETENTION  - RPC Art. 267 as amended by RA 18 and RA 1084",
    },
    {
      label: "LESS SERIOUS PHYSICAL INJURIES  - RPC Art. 265",
      value: "LESS SERIOUS PHYSICAL INJURIES  - RPC Art. 265",
    },
    {
      label: "LIGHT THREATS  - RPC Art. 283",
      value: "LIGHT THREATS  - RPC Art. 283",
    },
    {
      label: "MALICIOUS MISCHIEF  - RPC Art. 327",
      value: "MALICIOUS MISCHIEF  - RPC Art. 327",
    },
    { label: "MURDER  - RPC Art. 248", value: "MURDER  - RPC Art. 248" },
    {
      label:
        "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
      value:
        "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
    },
    {
      label: "OMNIBUS ELECTION CODE OF THE PHILIPPINES - BP 881",
      value: "OMNIBUS ELECTION CODE OF THE PHILIPPINES - BP 881",
    },
    {
      label: "OTHER FORMS OF TRESPASS  - RPC Art. 281",
      value: "OTHER FORMS OF TRESPASS  - RPC Art. 281",
    },
    { label: "PARRICIDE  - RPC Art. 246", value: "PARRICIDE  - RPC Art. 246" },
    {
      label: "PHILIPPINE MINING ACT OF 1995 - RA 7942",
      value: "PHILIPPINE MINING ACT OF 1995 - RA 7942",
    },
    {
      label: "QUALIFIED THEFT  - RPC Art. 310  as amended by BP Blg 71",
      value: "QUALIFIED THEFT  - RPC Art. 310  as amended by BP Blg 71",
    },
    {
      label: "QUALIFIED TRESPASS TO DWELLING  - RPC Art. 280",
      value: "QUALIFIED TRESPASS TO DWELLING  - RPC Art. 280",
    },
    {
      label: "RAPE WITH HOMICIDE - RPC Art. 266-B",
      value: "RAPE WITH HOMICIDE - RPC Art. 266-B",
    },
    {
      label:
        "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
      value:
        "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
    },
    {
      label: "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC Art 365",
      value: "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC Art 365",
    },
    {
      label:
        "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE DAMAGE TO PROPERTY - RPC Art 365",
      value:
        "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE DAMAGE TO PROPERTY - RPC Art 365",
    },
    {
      label: "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE HOMICIDE - RPC Art 365",
      value: "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE HOMICIDE - RPC Art 365",
    },
    {
      label:
        "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE PHYSICAL INJURY - RPC Art 365",
      value:
        "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE PHYSICAL INJURY - RPC Art 365",
    },
    {
      label: "RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC Art 365",
      value: "RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC Art 365",
    },
    {
      label:
        "RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON  - RPC Art. 151",
      value:
        "RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON  - RPC Art. 151",
    },
    {
      label: "REVISED FORESTRY CODE OF THE PHILIPPINES - PD 705",
      value: "REVISED FORESTRY CODE OF THE PHILIPPINES - PD 705",
    },
    { label: "ROBBERY  - RPC Art. 293", value: "ROBBERY  - RPC Art. 293" },
    {
      label: "SERIOUS PHYSICAL INJURIES  - RPC Art. 263",
      value: "SERIOUS PHYSICAL INJURIES  - RPC Art. 263",
    },
    {
      label: "SLANDER (ORAL DEFAMATION) - RPC Art. 358",
      value: "SLANDER (ORAL DEFAMATION) - RPC Art. 358",
    },
    {
      label: "SLIGHT PHYSICAL INJURIES AND MALTREATMENT  - RPC Art. 266",
      value: "SLIGHT PHYSICAL INJURIES AND MALTREATMENT  - RPC Art. 266",
    },
    {
      label: "SWINDLING (ESTAFA)  - RPC Art. 315 as amended by PD 1689",
      value: "SWINDLING (ESTAFA)  - RPC Art. 315 as amended by PD 1689",
    },
    {
      label:
        "THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705",
      value:
        "THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705",
    },
    { label: "THEFT  - RPC Art. 308", value: "THEFT  - RPC Art. 308" },
    {
      label: "UNJUST VEXATIONS - RPC Art. 287",
      value: "UNJUST VEXATIONS - RPC Art. 287",
    },
  ];

  let barangayOpt = [
    { label: "Consuelo", value: "Consuelo" },
    { label: "San Teodoro", value: "San Teodoro" },
    { label: "Bunawan Brook", value: "Bunawan Brook" },
    { label: "Libertad", value: "Libertad" },
    { label: "San Andres", value: "San Andres" },
    { label: "Imelda", value: "Imelda" },
    { label: "Poblacion", value: "Poblacion" },
    { label: "Mambalili", value: "Mambalili" },
    { label: "Nueva Era", value: "Nueva Era" },
    { label: "San Marcos", value: "San Marcos" },
  ];

  const monthOpt = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const indexCrimes = [
    "murder",
    "homicide",
    "physical injury",
    "rape",
    "robbery",
    "theft",
    "carnapping",
  ];

  const isIndexCrime = (offense) => {
    return indexCrimes.some((keyword) =>
      offense.toLowerCase().includes(keyword)
    );
  };

  useEffect(() => {
    setOffense("");
  }, [crimeType]);

  const currentYear = new Date().getFullYear();
  const yearOpt = [];

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
          offense: offense,
          barangay: barangay,
          year: year,
          month: monthNumber,
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
    content: () => printRef.current,
    pageStyle: `
            @media print {
                /* Hide the footer */
                @page {
                  size: auto;
                  margin: 20mm;
                }
                body {
                  margin: 0;
                }
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
    <div className="flex flex-col gap-2 w-full p-3 bg-white text-sm">
      <div className="border-b-2 border-slate-200 p-2">
        <p>Filter:</p>
        <div className="flex gap-2 justify-end items-center w-full">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="" className="ps-2">
              Barangay
            </label>
            <Autocomplete
              aria-label="Barangay"
              placeholder="Select Barangay"
              value={barangay}
              onInputChange={(value) => setBarangay(value)}>
              {barangayOpt.map((option) => (
                <AutocompleteItem
                  key={option.value}
                  value={option.label}
                  textValue={option.label}>
                  {option.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="" className="ps-2">
              Crime Type
            </label>
            <NextSelect
              aria-label="Crime Type"
              placeholder="Select Crime Type"
              value={crimeType}
              onChange={(e) => setCrimeType(e.target.value)}>
              {crimeTypeOpt.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </NextSelect>
          </div>

          {crimeType && (
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="" className="ps-2">
                Offense
              </label>
              <Autocomplete
                aria-label="Offense"
                placeholder="Select Offense"
                value={offense}
                onInputChange={(value) => setOffense(value)}>
                {offenseOpt
                  .filter((option) => {
                    if (crimeType === "index") {
                      return isIndexCrime(option.label);
                    } else {
                      return !isIndexCrime(option.label);
                    }
                  })
                  .map((option) => (
                    <AutocompleteItem
                      key={option.value}
                      value={option.value}
                      textValue={option.label}>
                      {option.label}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
            </div>
          )}

          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="" className="ps-2">
              Year
            </label>
            <Autocomplete
              aria-label="Year"
              placeholder="Select Year"
              value={year}
              onInputChange={(value) => {
                setYear(value);
              }}>
              {yearOpt.map((option) => (
                <AutocompleteItem
                  key={option.value}
                  value={option.value}
                  textValue={option.label.toString()}>
                  {option.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="" className="ps-2">
              Month
            </label>
            <Autocomplete
              aria-label="Month"
              placeholder="Select Month"
              value={month}
              onInputChange={(value) => setMonth(value)}>
              {monthOpt.map((option) => (
                <AutocompleteItem
                  key={option.value}
                  value={option.label}
                  textValue={option.label}>
                  {option.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

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
      <div className="py-2 px-2 bg-slate-100 flex items-center">
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
