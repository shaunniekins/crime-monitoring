import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Pagination, Card, Tooltip, Tabs, Tab } from "@nextui-org/react";
import { GiWantedReward } from "react-icons/gi";
import { GrDocumentMissing } from "react-icons/gr";
import { clientUrl, serverUrl } from "../urlConfig";

const socket = io.connect(serverUrl);

function DisplayWanted() {
  const [personList, setPersonList] = useState([]);
  const [filter, setFilter] = useState("WANTED PERSON");

  // fetching
  const [searchValue, setSearchValue] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const entriesPerPage = 10;

  const getPerson = async () => {
    axios
      .get(`/person/all-person-of-concern`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
          filter: filter,
          search: searchValue,
        },
      })
      .then((res) => {
        setPersonList(res.data.data);
        setTotalPages(Math.ceil(res.data.totalCount / entriesPerPage));
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  };

  useEffect(() => {
    getPerson();
  }, [currentPage, filter, searchValue]);

  socket.on("receive_update", (message) => {
    getPerson();
  });

  return (
    <div>
      {personList ? (
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="w-full flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-0">
              {filter}
            </h1>
            <Tabs
              key="lg"
              aria-label="person-of-concern-select"
              onSelectionChange={setFilter}>
              <Tab
                key="WANTED PERSON"
                title={
                  <div className="flex items-center space-x-2">
                    <GrDocumentMissing />
                    <span>WANTED PERSON</span>
                  </div>
                }
              />
              <Tab
                key="MISSING PERSON"
                title={
                  <div className="flex items-center space-x-2">
                    <GiWantedReward />
                    <span>MISSING PERSON</span>
                  </div>
                }
              />
            </Tabs>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-7 w-full">
            {personList.map((person) => (
              <Tooltip
                key={person.id}
                delay={0}
                closeDelay={0}
                offset={-30}
                content={
                  <div className="text-small text-gray-500">{person.alias}</div>
                }>
                <Card>
                  <img
                    src={
                      person.url
                        ? `data:image/jpeg;base64,${person.url}`
                        : `${clientUrl}/default.jpg`
                    }
                    alt={person.first_name}
                    className="w-full h-36 object-contain bg-gray-200 md:mb-2"
                  />
                  <div className="py-2 font-normal">
                    <h1 className="font-semibold">
                      {person.first_name} {person.middle_name}{" "}
                      {person.last_name}
                    </h1>
                    <div className="text-small">"{person.alias}"</div>
                    <div className="text-small">
                      {new Date(person?.created_at).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}{" "}
                      (RD)
                    </div>
                    <div className="text-small">
                      {person.gender.charAt(0).toUpperCase() +
                        person.gender.slice(1)}
                    </div>
                    <div className="text-small">
                      {person.last_known_address}
                    </div>
                    <div className="text-small">{person.type}</div>
                    <div className="text-small">
                      {person.weight && `${person.weight} kg`}
                      {person.weight && person.height && " | "}
                      {person.height && `${person.height} cm`}
                    </div>
                    <div className="text-small font-semibold font-serif text-gray-500 mt-2 md:my-3">
                      {person.status}
                    </div>
                  </div>
                </Card>
              </Tooltip>
            ))}
          </div>
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
      ) : null}
    </div>
  );
}

export default DisplayWanted;
