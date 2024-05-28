import React, { useState, useEffect } from "react";
import PersonTable from "./PersonTable";
import axios from "axios";
import PersonModal from "./PersonModal";
import io from "socket.io-client";
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
      {isModalOpen ? (
        <PersonModal
          getPerson={getPerson}
          handleModal={handleModal}
          selected={selected}
          setSelected={setSelected}
        />
      ) : (
        ""
      )}
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl font-serif">WANTED PERSON</p>
        <div className="flex items-center gap-2 w-3/6">
          <div>
            <p className="cursor-pointer">
              <input
                type="radio"
                name="type"
                className="cursor-pointer"
                onChange={handleFilterChange}
                checked={filter === "WANTED PERSON"}
                value={"WANTED PERSON"}
              />{" "}
              WANTED PERSON
            </p>
            <p className="cursor-pointer">
              <input
                type="radio"
                name="type"
                className="cursor-pointer"
                onChange={handleFilterChange}
                checked={filter === "MISSING PERSON"}
                value={"MISSING PERSON"}
              />{" "}
              MISSING PERSON
            </p>
          </div>
          <input
            type="search"
            className="w-full border-2 border-slate-400 p-2 rounded-md outline-none"
            placeholder="Search"
            onChange={handleKeywordsChange}
            value={keywords}
          />
        </div>
      </div>
      <div className="flex flex-col py-2 gap-4">
        <button
          className="p-2 ms-2 bg-emerald-500 rounded-md border-b-4 border-emerald-700 text-white font-semibold hover:bg-emerald-600 hover:border-emerald-800 w-36 duration-150"
          onClick={() => handleModal(true)}>
          ADD
        </button>
        <PersonTable
          personList={personList}
          handleModal={handleModal}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}
