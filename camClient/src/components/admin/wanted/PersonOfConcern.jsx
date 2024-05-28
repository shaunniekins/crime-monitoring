import React, { useState, useEffect } from "react";
import PersonTable from "./PersonTable";
import axios from "axios";
import PersonModal from "./PersonModal";
import io from "socket.io-client";
import { Tabs, Tab, Input, Button } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";

const socket = io.connect("http://localhost:3001");

export default function PersonOfConcern({ accessToken }) {
  const [personList, setPersonList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("WANTED PERSON");

  const handleModal = (action) => {
    setModalOpen(action);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
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
          </div>
        </div>
        <div>
          <PersonTable
            personList={personList}
            handleModal={handleModal}
            setSelected={setSelected}
          />
        </div>
      </div>
    </div>
  );
}
