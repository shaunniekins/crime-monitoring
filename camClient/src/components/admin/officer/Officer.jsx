import { useState, useEffect } from "react";
import axios from "axios";
import OfficerTable from "./OfficerTable";
import OfficerModal from "./OfficerModal";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

export default function Officer({ accessToken, user }) {
  const [officerList, setOfficerList] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({
    email: "",
    first_name: "",
    id: "",
    last_name: "",
    ranks: "",
    phone_number: "",
    role: "",
    birth_date: "",
    address: "",
  });

  const handleModal = (action) => {
    setModalOpen(action);
    if (action === false) {
      setSelectedOfficer({
        email: "",
        first_name: "",
        id: "",
        last_name: "",
        ranks: "",
        phone_number: "",
        role: "",
        birth_date: "",
        address: "",
      });
    }
  };
  const getUser = async () => {
    axios
      .get(`/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setOfficerList(res.data.data);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);
  socket.on("receive_update", (message) => {
    getUser();
  });

  return (
    <div className="w-full h-full p-2 sm:p-5 shadow-lg rounded-sm bg-white">
      {isModalOpen ? (
        <OfficerModal
          selectedOfficer={selectedOfficer}
          setSelectedOfficer={setSelectedOfficer}
          handleModal={handleModal}
          accessToken={accessToken}
        />
      ) : (
        ""
      )}
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl font-serif">USER LIST</p>
        <div className="w-2/6">
          <input
            type="search"
            className="w-full border-2 border-slate-400 p-2 rounded-md outline-none hidden"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex flex-col py-2 gap-4">
        <button
          className="p-2 ms-2 bg-emerald-500 rounded-md border-b-4 border-emerald-700 text-white font-semibold hover:bg-emerald-600 hover:border-emerald-800 w-36 duration-150 hidden"
          onClick={() => handleModal(true)}>
          ADD
        </button>
        {officerList ? (
          <OfficerTable
            officerList={officerList}
            setSelectedOfficer={setSelectedOfficer}
            handleModal={handleModal}
            accessToken={accessToken}
          />
        ) : (
          "Loading"
        )}
      </div>
    </div>
  );
}
