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

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchValue]);

  return (
    <div>
      {personList ? (
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{filter}</h1>
            <Tabs
              key="lg"
              size="lg"
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
                // title="WANTED PERSON"
              />
              <Tab
                key="MISSING PERSON"
                title={
                  <div className="flex items-center space-x-2">
                    <GiWantedReward />
                    <span>MISSING PERSON</span>
                  </div>
                }
                // title="MISSING PERSON"
              />
            </Tabs>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-7">
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
                    className="w-full h-fit object-cover mb-2"
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
                    <div className="text-small">
                      {person.weight && `${person.weight} kg`}
                      {person.weight && person.height && " | "}
                      {person.height && `${person.height} cm`}
                    </div>
                    <div className="text-small font-semibold font-serif text-gray-500 my-3">
                      {person.status}
                    </div>
                  </div>
                </Card>
              </Tooltip>
            ))}
          </div>
          {/* {totalPages > 0 ? ( */}
          <Pagination
            isCompact
            showControls
            showShadow
            color="default"
            page={currentPage}
            total={totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
          {/* ) : null} */}
        </div>
      ) : null}
    </div>
  );
}

export default DisplayWanted;
