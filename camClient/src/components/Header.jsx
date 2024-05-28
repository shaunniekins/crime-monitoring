import React from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import headDesign from "../assets/header.jpg";
import logo from "../assets/logo.png";

export default function Header({
  user,
  setUser,
  activePage,
  handleActivePage,
  setAccessToken,
  accessToken
}) {
  const cookies = new Cookies({ path: "/" });
  return (
    <header className="w-full">
      <div className="w-full relative">
        <img src={logo} alt="Design" className="absolute top-8 left-10 w-64 rounded-lg shadow-lg" />
        <img src={headDesign} alt="Design" className="w-full" />
        <div className="w-full absolute bottom-0 bg-neutral-700 h-10 opacity-30"></div>
      </div>
      <nav className="flex justify-between items-center text-white p-2 sm:p-5 gap-2 bg-neutral-900">
        <div>
          <p className="hover:text-slate-200 cursor-pointer" onClick={() => handleActivePage("home")}>
            Crime Monitoring
          </p>
        </div>

        {user.id ? (
          <div className="flex gap-2 items-center">
            <p className="text-slate-300 p-3">
              {user.last_name + ", " + user.first_name}
            </p>
            <button
              className="text-xs font-semibold p-3 bg-yellow-600 border-b-4 border-b-yellow-800 hover:bg-yellow-700 hover:border-b-yellow-900 hover:shadow-lg rounded-md text-white duration-200"
              onClick={() => {
                cookies.remove("user");
                setUser({});
                setAccessToken("");
              }}
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center text-xs font-semibold">
            <Link
              to="/signIn"
              className="text-xs font-semibold py-3 px-5 bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg rounded-md text-white duration-200"
            >
              SIGN IN
            </Link>
            <Link
              to="/signUp"
              className="text-xs font-semibold py-3 px-5 bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg rounded-md text-white duration-200"
            >
              SIGN UP
            </Link>
          </div>
        )}
      </nav>
      <div className="flex justify-center gap-5 pt-2 bg-neutral-800 text-yellow-500 text-md font-bold">
        <button
          className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
            activePage === "crime" ? "text-yellow-600 bg-slate-200" : ""
          }
          `}
          onClick={() => handleActivePage("crime")}
          
        >
          REPORT CRIME
        </button>
        <button
          className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
            activePage === "wanted" ? "text-yellow-600 bg-slate-200" : ""
          }`}
          onClick={() => handleActivePage("wanted")}
        >
          REPORT WANTED PERSON
        </button>
        <button
          className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
            activePage === "missing" ? "text-yellow-600 bg-slate-200" : ""
          }`}
          onClick={() => handleActivePage("missing")}
        >
          REPORT MISSING PERSON
        </button>
      </div>
    </header>
  );
}
