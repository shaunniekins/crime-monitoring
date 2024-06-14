import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import headDesign from "../assets/header.jpg";
import logo from "../assets/logo.png";
import UpdatePersonalInfoModal from "./admin/UpdatePersonalInfoModal";
import { Button, useDisclosure } from "@nextui-org/react";

export default function Header({
  user,
  setUser,
  getUser,
  activePage,
  handleActivePage,
  setAccessToken,
  accessToken,
}) {
  const cookies = new Cookies({ path: "/" });

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <header className="w-full">
      <UpdatePersonalInfoModal
        selectedOfficer={selectedOfficer}
        accessToken={accessToken}
        getUser={getUser}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <div className="w-full relative">
        <img
          src={logo}
          alt="Design"
          className="absolute w-28 top-2 left-1/2 transform -translate-x-1/2 md:w-44 md:top-8 md:left-10 md:translate-x-0 rounded-lg shadow-lg"
        />
        <img
          src={headDesign}
          alt="Design"
          className="w-full h-32 md:h-60 object-cover"
        />
        <div className="w-full absolute bottom-0 bg-neutral-700 h-10 opacity-30"></div>
      </div>
      <nav className="flex justify-between items-center text-white p-2 sm:p-5 gap-2 bg-neutral-900">
        <div>
          <p
            className="hover:text-slate-200 cursor-pointer"
            onClick={() => handleActivePage("home")}>
            Crime Monitoring
          </p>
        </div>

        {user.id ? (
          <div className="flex gap-2 items-center">
            <Button onPress={onOpen} variant="light" className="text-slate-300">
              {user.last_name + ", " + user.first_name}
            </Button>
            <button
              className="text-xs font-semibold p-3 bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg rounded-md text-white duration-200"
              onClick={() => {
                cookies.remove("user");
                setUser({});
                setAccessToken("");
              }}>
              SIGN OUT
            </button>
          </div>
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
      {user.id && (
        <div className="flex flex-col md:flex-row justify-center md:gap-5 bg-neutral-800 text-yellow-500 text-sm md:text-medium font-bold">
          <button
            className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "crime" ? "text-yellow-600 bg-slate-200" : ""
            }
          `}
            onClick={() => handleActivePage("crime")}>
            REPORT CRIME
          </button>
          <button
            className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "wanted" ? "text-yellow-600 bg-slate-200" : ""
            }`}
            onClick={() => handleActivePage("wanted")}>
            REPORT WANTED PERSON
          </button>
          <button
            className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "missing" ? "text-yellow-600 bg-slate-200" : ""
            }`}
            onClick={() => handleActivePage("missing")}>
            REPORT MISSING PERSON
          </button>
        </div>
      )}
    </header>
  );
}
