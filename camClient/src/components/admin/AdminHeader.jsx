import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import headDesign from "../../assets/header.jpg";
import logo from "../../assets/logo.png";
import UpdatePersonalInfoModal from "./UpdatePersonalInfoModal";

export default function AdminHeader({
  user,
  setUser,
  getUser,
  activePage,
  handleActivePage,
  accessToken,
  setAccessToken,
}) {
  const cookies = new Cookies({ path: "/" });
  const [isModalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    setSelectedOfficer(user);
  }, [user]);

  const handleModal = (action) => {
    setModalOpen(action);
  };

  return (
    <header className="w-full">
      {isModalOpen && (
        <UpdatePersonalInfoModal
          selectedOfficer={selectedOfficer}
          setSelectedOfficer={setSelectedOfficer}
          handleModal={handleModal}
          accessToken={accessToken}
          getUser={getUser}
        />
      )}
      <div className="w-full relative">
        <img
          src={logo}
          alt="Design"
          className="absolute top-8 left-10 w-64 rounded-lg shadow-lg"
        />
        <img src={headDesign} alt="Design" className="w-full" />
        <div className="w-full absolute bottom-0 bg-neutral-700 h-10 opacity-30"></div>
      </div>
      <nav className="flex justify-between items-center text-white p-2 sm:p-5 gap-2 bg-neutral-900">
        <div>
          <Link to={"/"} className="hover:text-slate-200">
            Criminal Activity Monitoring
          </Link>
        </div>

        {user.id ? (
          <button
            className="flex gap-2 items-center"
            onClick={() => handleModal(true)}>
            <p className="text-slate-300 p-3">
              {user.last_name + ", " + user.first_name}
            </p>
            <button
              className="text-xs font-semibold p-3 bg-yellow-600 border-b-4 border-b-yellow-800 hover:bg-yellow-700 hover:border-b-yellow-900 hover:shadow-lg rounded-md text-white duration-200"
              onClick={() => {
                cookies.remove("user");
                setUser({});
                setAccessToken("");
              }}>
              SIGN OUT
            </button>
          </button>
        ) : (
          <div className="flex gap-2 items-center text-xs font-semibold">
            <Link
              to="/signIn"
              className="text-xs font-semibold py-3 px-5 bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg rounded-md text-white duration-200">
              SIGN IN
            </Link>
            <Link
              to="/signUp"
              className="text-xs font-semibold py-3 px-5 bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg rounded-md text-white duration-200">
              SIGN UP
            </Link>
          </div>
        )}
      </nav>
      {/* <div className="flex justify-center gap-5 pt-2 bg-neutral-800 text-yellow-500 text-md font-bold">
        <button
          className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
            activePage === "report tracker" ? "text-yellow-600 bg-slate-200" : ""
          }`}
          onClick={() => handleActivePage("report tracker")}
        >
          REPORT TRACKER
        </button>
        <button
          className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
            activePage === "person of concern" ? "text-yellow-600 bg-slate-200" : ""
          }`}
          onClick={() => handleActivePage("person of concern")}
        >
          PERSON OF CONCERN
        </button>
        <button
          className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
            activePage === "officer" ? "text-yellow-600 bg-slate-200" : ""
          }`}
          onClick={() => handleActivePage("officer")}
        >
          OFFICER
        </button>
      </div> */}
    </header>
  );
}
