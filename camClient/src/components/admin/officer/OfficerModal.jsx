import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

export default function OfficerModal({
  handleModal,
  selectedOfficer,
  accessToken
}) {
  // CREDENTIAL'S STATE
  const [credentials, setCredentials] = useState({
    id: selectedOfficer.id,
    first_name: selectedOfficer.first_name,
    last_name: selectedOfficer.last_name,
    email: selectedOfficer.email,
    phone_number: selectedOfficer.phone_number,
    birth_date: selectedOfficer.birth_date,
    address: selectedOfficer.address,
    activate: selectedOfficer.activate,
    role: selectedOfficer.role
  });

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };

  //OPTION FOR SELECT
  const activateOpt = [
    { value: 1, label: "True" },
    { value: 0, label: "False" },
  ];
  const roleOpt = [
    { value: "admin", label: "admin" },
    { value: "user", label: "user" },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOfficer.email === "") {
      alert("add")
    } else {
      await axios
        .put(`/user?id=${credentials.id}`, credentials, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          showSuccessMessage(res.data.message)
          socket.emit('send_update', { message: "Hello" })
          setTimeout(()=>{handleModal(false)}, 2000)
        }).catch(error => {
          showErrorMessage(error)
        })
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form className="relative w-4/6 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold">
                {selectedOfficer.id ? "UPDATE " : "ADD NEW "}OFFICER
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => handleModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative w-full flex flex-col p-6 flex-auto">
              <div className="flex w-6/6 flex-col">
                <label className="ps-2">Email</label>
                <input
                  type="email"
                  placeholder="Taylorswift@gmail.com"
                  className="shadow-md px-3 w-full py-1 rounded-md border-2 border-slate-400"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              {/* First Row */}
              <div className="flex gap-2">
                <div className="flex w-3/6 flex-col">
                  <label className="ps-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Taylor"
                    className="shadow-md px-3 w-full py-1 rounded-md border-2 border-slate-400"
                    value={credentials.first_name}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex w-3/6 flex-col">
                  <label className="ps-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Swift"
                    className="shadow-md px-3 w-full py-1 rounded-md border-2 border-slate-400"
                    value={credentials.last_name}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {/* Second Row */}
              <div className="flex flex-col gap-2 w-full">
                <label className="ps-2">Birth Date</label>
                <input
                  type="date"
                  className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400 w-full"
                  value={credentials.birth_date}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      birth_date: e.target.value,
                    })
                  }
                />

              </div>
              {/* Third Row */}
              <div className="flex gap-2">
                <div className="flex w-6/12 flex-col">
                  <label className="ps-2">Address</label>
                  <input
                    type="text"
                    placeholder="Agusan del Sur"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.address}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex w-6/12 flex-col">
                  <label className="ps-2">Contact</label>
                  <input
                    type="text"
                    placeholder="+63"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.phone_number}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {/* Third Row */}
              <div className="flex gap-2">
                <div className="flex w-6/12 flex-col">
                  <label className="ps-2">Password</label>
                  <input
                    type="text"
                    placeholder="Password"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex w-6/12 flex-col">
                  <label className="ps-2">Role</label>
                  <Select
                    defaultValue={{ label: credentials.role, value: credentials.role }}
                    options={roleOpt}
                    onChange={(e) =>
                      setCredentials({ ...credentials, role: e.value })
                    }
                  />
                </div>
              </div>
              <div className="flex w-6/12 flex-col">
                <label className="ps-2">Activate</label>
                <Select
                  options={activateOpt}
                  onChange={(e) =>
                    setCredentials({ ...credentials, activate: e.value })
                  }
                />
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => handleModal(false)}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
