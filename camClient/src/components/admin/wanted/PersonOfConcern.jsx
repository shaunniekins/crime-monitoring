import React, { useState, useEffect } from "react";
import PersonTable from "./PersonTable";
import axios from "axios";
import PersonModal from "./PersonModal";
import io from "socket.io-client";
import { Tabs, Tab, Input, Button } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";
import { serverUrl } from "../../../urlConfig";
import { barangayOpt, monthOpt, offenseOpt } from "../../options";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";

const socket = io.connect(serverUrl);

export default function PersonOfConcern({ accessToken }) {
  const [personList, setPersonList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("WANTED PERSON");

  const [barangay, setBarangay] = useState("Select Barangay");
  const [year, setYear] = useState("Select Year");
  const [month, setMonth] = useState("Select Month");

  const currentYear = new Date().getFullYear();
  const yearOpt = [{ label: "Select Year", value: "Select Year" }];

  for (let year = currentYear; 2000 <= year; year--) {
    yearOpt.push({ label: year, value: year });
  }

  const handleModal = (action) => {
    setModalOpen(action);
  };

  const getPerson = async () => {
    axios
      .get(`/person/?filter=${filter}&keywords=${keywords}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setPersonList([res.data.data]);
      });
  };

  useEffect(() => {
    getPerson();
  }, [keywords, filter]);

  socket.on("receive_update", (message) => {
    getPerson();
  });

  useEffect(() => {
    setBarangay("Select Barangay");
    setYear("Select Year");
    setMonth("Select Month");
  }, [filter]);

  const filterPersonList = () => {
    let flattenedPersonList = [].concat(...personList);

    if (barangay !== "Select Barangay") {
      flattenedPersonList = flattenedPersonList.filter((person) => {
        return (
          person.last_known_address &&
          person.last_known_address.includes(barangay)
        );
      });
    }

    if (year !== "Select Year") {
      flattenedPersonList = flattenedPersonList.filter(
        (person) => new Date(person.created_at).getFullYear() === parseInt(year)
      );
    }

    if (month !== "Select Month") {
      const monthNames = [
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
      const monthNumber = monthNames.indexOf(month) + 1;
      flattenedPersonList = flattenedPersonList.filter(
        (person) => new Date(person.created_at).getMonth() + 1 === monthNumber
      );
    }
    return flattenedPersonList;
  };

  // Use this function where you need the filtered list
  const filteredPersonList = filterPersonList();

  const printRef = React.useRef();
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

  return (
    <div className="w-full h-full p-2 sm:p-5 shadow-lg rounded-sm bg-white">
      {isModalOpen && (
        <PersonModal
          getPerson={getPerson}
          handleModal={handleModal}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <p className="font-bold text-2xl">
            {filter === "WANTED PERSON" ? "WANTED PERSON" : "MISSING PERSON"}
          </p>
          <div className="flex items-center gap-2">
            <Tabs
              key="lg"
              size="lg"
              aria-label="person-of-concern-select"
              onSelectionChange={setFilter}>
              <Tab key="WANTED PERSON" title="WANTED PERSON" />
              <Tab key="MISSING PERSON" title="MISSING PERSON" />
            </Tabs>
            <Input
              isClearable
              onClear={() => setKeywords("")}
              radius="lg"
              classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focused=true]:bg-default-200/50",
                  "dark:group-data-[focused=true]:bg-default/60",
                  "!cursor-text",
                ],
              }}
              placeholder="Type to search..."
              value={keywords}
              onChange={(e) => {
                // setCurrentPage(1);
                setKeywords(e.target.value);
              }}
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Button
              color="success"
              variant="ghost"
              onClick={() => handleModal(true)}>
              ADD
            </Button>
            <div>
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
        </div>
        <div className="flex gap-2 justify-between items-center w-full">
          <div className="flex gap-2 w-3/4">
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
                onChange={(e) => setMonth(e.label)}></Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-32">
            <label htmlFor="" className="ps-2">
              Action
            </label>
            <Button
              onClick={() => {
                setBarangay("Select Barangay");
                setYear("Select Year");
                setMonth("Select Month");
              }}>
              Reset
            </Button>
          </div>
        </div>
        <div>
          <PersonTable
            personList={filteredPersonList}
            handleModal={handleModal}
            setSelected={setSelected}
            printRef={printRef}
          />
        </div>
      </div>
    </div>
  );
}
