import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  Pagination,
  Card,
  Switch,
  PopoverContent,
  Popover,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { GiWantedReward } from "react-icons/gi";
import { GrDocumentMissing } from "react-icons/gr";

const socket = io.connect("http://localhost:3001");

function DisplayWanted() {
  const [personList, setPersonList] = useState([]);
  const [filter, setFilter] = useState("WANTED PERSON");

  // fetching
  const [searchValue, setSearchValue] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const entriesPerPage = 10;

  const columns = [
    { key: "url", label: "Image" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "middle_name", label: "Middle Name" },
    { key: "gender", label: "Gender" },
    { key: "last_known_address", label: "Address" },
    { key: "alias", label: "Alias" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "status", label: "Status" },
    { key: "type", label: "Type" },
    { key: "created_at", label: "Reported Date" },
  ];

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
      {/* <Table
        aria-label="Person of Concern Table"
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
          items={personList}
          emptyContent={"No rows to display."}
          loadingContent={<Spinner />}>
          {(item, index) => (
            <TableRow
              key={`${item.first_name}-${item.last_name}-${item.middle_name}`}
              className="text-center">
              {(columnKey) => {
                if (columnKey === "url") {
                  return (
                    <TableCell className="flex justify-center items-center">
                      <img
                        className="w-32"
                        src={
                          item[columnKey]
                            ? `data:image/jpeg;base64,${item[columnKey]}`
                            : "http://localhost:3000/default.jpg"
                        }
                        alt="ID"
                      />
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
      </Table> */}

      {/* <Popover key={person.id} placement="top" color={"default"}>
                <PopoverTrigger>
 </PopoverTrigger>
                {currentList && (
                  <PopoverContent>
                    <>
                      <div className="text-large font-bold">
                        {currentList.first_name} {currentList.last_name}
                      </div>
                      <div className="text-small">"{currentList.alias}"</div>
                      <div className="text-small">
                        {new Date(currentList.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}{" "}
                        (RD)
                      </div>
                      <div className="text-small">
                        {currentList.gender.charAt(0).toUpperCase() +
                          currentList.gender.slice(1)}
                      </div>
                      <div className="text-small">
                        {currentList.last_known_address}
                      </div>
                      <div className="text-small">
                        {currentList.weight && `${currentList.weight} kg`}
                        {currentList.weight && currentList.height && " | "}
                        {currentList.height && `${currentList.height} cm`}
                      </div>
                      <div className="text-small font-semibold font-serif text-red-500">
                        {currentList.status}
                      </div>
                    </>
                  </PopoverContent>
                )}
              </Popover>  */}

      {personList ? (
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{filter}</h1>
            <Switch
              defaultSelected
              size="lg"
              color="default"
              onChange={(e) => {
                setFilter(
                  e.target.checked ? "WANTED PERSON" : "MISSING PERSON"
                );
              }}
              startContent={<GrDocumentMissing />}
              endContent={<GiWantedReward />}>
              {filter === "WANTED PERSON" ? "Wanted Person" : "Missing Person"}
            </Switch>
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
                        : "http://localhost:3000/default.jpg"
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
