import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import headDesign from "../../assets/header.jpg";
import logo from "../../assets/logo.png";
import UpdatePersonalInfoModal from "./UpdatePersonalInfoModal";
import { Button, useDisclosure } from "@nextui-org/react";

export default function AdminHeader({
  user,
  setUser,
  getUser,
  activePage,
  accessToken,
  setAccessToken,
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
        setSelectedOfficer={setSelectedOfficer}
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
      <nav className="flex flex-col md:flex-row justify-between items-center text-white py-3 px-2 sm:p-5 gap-2 bg-neutral-900">
        <div>
          <Link to={"/"} className="hover:text-slate-200">
            Criminal Activity Monitoring
          </Link>
        </div>

        <div className="flex">
          {user.id ? (
            <div className="flex gap-2 items-center">
              <Button
                onPress={onOpen}
                variant="light"
                className="text-slate-300">
                {user.last_name + ", " + user.first_name}
              </Button>
              <button
                className="text-xs font-semibold py-2 md:py-3 px-3 bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg rounded-md text-white duration-200"
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
        </div>
      </nav>
    </header>
  );
}
