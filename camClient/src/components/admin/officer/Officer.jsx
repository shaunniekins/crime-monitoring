import { useState, useEffect } from "react";
import axios from "axios";
import OfficerTable from "./OfficerTable";
import OfficerModal from "./OfficerModal";
import io from "socket.io-client";
import { Button, Input } from "@nextui-org/react";
import { serverUrl } from "../../../urlConfig";
import { SearchIcon } from "../wanted/SearchIcon";
const socket = io.connect(serverUrl);

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

  const [keywords, setKeywords] = useState("");

  const getUser = async () => {
    axios
      .get(`/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          keywords: keywords,
        },
      })
      .then((res) => {
        setOfficerList(res.data.data);
      });
  };

  useEffect(() => {
    getUser();
  }, [keywords]);

  const [isModalOpen, setModalOpen] = useState(false);

  socket.on("receive_update", (message) => {
    getUser();
  });

  return (
    <div className="w-full h-full p-2 sm:p-5 shadow-lg rounded-sm bg-white">
      {isModalOpen && (
        <OfficerModal
          selectedOfficer={selectedOfficer}
          setSelectedOfficer={setSelectedOfficer}
          handleModal={handleModal}
          accessToken={accessToken}
        />
      )}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <p className="font-bold text-2xl">USER LIST</p>
          <div className="flex items-center gap-2">
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
              className="hidden"
              onClick={() => handleModal(true)}>
              ADD
            </Button>
          </div>
        </div>
        <div>
          {officerList ? (
            <OfficerTable
              officerList={officerList}
              setSelectedOfficer={setSelectedOfficer}
              handleModal={handleModal}
              accessToken={accessToken}
              getUser={getUser}
            />
          ) : (
            "Loading"
          )}
        </div>
      </div>
    </div>
  );
}
