import React from "react";
import {
  CrimeIndexIcon,
  CrimesIcon,
  OfficerIcon,
  OverviewIcon,
  PersonOfConcernIcon,
  UploadIcon,
} from "../../assets/Icons";
import { IoMdClose } from "react-icons/io";

export default function Sidebar({
  activePage,
  handleActivePage,
  user,
  setIsSidebarOpen,
}) {
  return (
    <div className="bg-neutral-800 md:h-full md:min-h-screen">
      <div className="md:hidden flex justify-end p-5">
        <IoMdClose
          className="text-2xl cursor-pointer text-white"
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>
      <div className="pb-12 md:pb-0 h-[92svh] md:h-full flex flex-col justify-center items-center md:justify-normal text-start md:ps-2 md:pt-10  text-yellow-500 text-md font-bold sticky top-0">
        <div className="flex flex-col justify-center gap-10 md:gap-5">
          <button
            className={`flex items-center gap-1 hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "Overview" && "text-yellow-600 md:bg-slate-200"
            }`}
            onClick={() => handleActivePage("Overview")}>
            <OverviewIcon />
            Overview
          </button>
          <button
            className={`flex items-center gap-1 text-start hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "person of concern" &&
              "text-yellow-600 md:bg-slate-200"
            }`}
            onClick={() => handleActivePage("person of concern")}>
            <PersonOfConcernIcon />
            Person of Concern
          </button>
          <button
            className={`flex items-center gap-1 hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "officer" && "text-yellow-600 md:bg-slate-200"
            }`}
            onClick={() => handleActivePage("officer")}>
            <OfficerIcon />
            User List
          </button>
          <button
            className={`flex items-center gap-1 text-start hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "crimes" && "text-yellow-600 md:bg-slate-200"
            }`}
            onClick={() => handleActivePage("crimes")}>
            <CrimesIcon />
            Crime List
          </button>
          <button
            className={`flex items-center gap-2 text-start hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "crime index" && "text-yellow-600 md:bg-slate-200"
            }`}
            onClick={() => handleActivePage("crime index")}>
            <CrimeIndexIcon />
            Crime Index/Non
          </button>
          <button
            className={`flex items-center gap-1 hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
              activePage === "upload" && "text-yellow-600 md:bg-slate-200"
            }`}
            onClick={() => handleActivePage("upload")}>
            <UploadIcon />
            UPLOAD EXCEL
          </button>
        </div>
      </div>
    </div>
  );
}
