import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import io from "socket.io-client";
import { Button } from "@nextui-org/react";
import { clientUrl, serverUrl } from "../../../urlConfig";
import {
  genderOpt,
  typeOpt,
  eyeColorOpt,
  hairColorOpt,
  hairStyleOpt,
} from "../../options";
const socket = io.connect(serverUrl);

export default function PersonModal({
  handleModal,
  selected,
  setSelected,
  getPerson,
}) {
  const [credentials, setCredentials] = useState(selected);
  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  const [isImageChanged, setIsImageChanged] = useState(false);

  useEffect(() => {
    setImgSrc(selected.url || null);
    setCredentials(selected);
  }, [selected]);

  const typeOpt = !selected.id
    ? [
        { value: "MISSING PERSON", label: "MISSING PERSON" },
        { value: "WANTED PERSON", label: "WANTED PERSON" },
      ]
    : [{ value: selected.type, label: selected.type }];

  const statusOpt =
    selected.type === "MISSING PERSON"
      ? [
          { value: "Under Investigation", label: "Under Investigation" },
          { value: "Active Search", label: "Active Search" },
          { value: "Public Appeal", label: "Public Appeal" },
          { value: "Unresolved", label: "Unresolved" },
          { value: "Located", label: "Located" },
          { value: "Closed", label: "Closed" },
        ]
      : [
          { value: "Under Investigation", label: "Under Investigation" },
          { value: "Active", label: "Active" },
          { value: "Warrant Issued", label: "Warrant Issued" },
          { value: "Fugitive", label: "Fugitive" },
          { value: "Escaped", label: "Escaped" },
          { value: "In Custody", label: "In Custody" },
          { value: "Closed", label: "Closed" },
        ];

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

  // handle change functions

  const handleFirstNameChange = (e) => {
    setCredentials({ ...credentials, first_name: e.target.value });
  };
  const handleLastNameChange = (e) => {
    setCredentials({ ...credentials, last_name: e.target.value });
  };
  const handleGenderChange = (selected) => {
    setCredentials({ ...credentials, gender: selected.value });
  };
  const handleEyeColorChange = (selected) => {
    setCredentials({ ...credentials, eye_color: selected.value });
  };
  const handleHairColorChange = (selected) => {
    setCredentials({ ...credentials, hair_color: selected.value });
  };
  const handleHairStyleChange = (selected) => {
    setCredentials({ ...credentials, hair_style: selected.value });
  };
  const handleAddressChange = (e) => {
    setCredentials({ ...credentials, last_known_address: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgSrc(URL.createObjectURL(file));
      setIsImageChanged(true);
    } else {
      setImgSrc(null);
      setImage(null);
      setIsImageChanged(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.type)
      return showErrorMessage("Error, please select type.");

    const imageData = new FormData();
    imageData.append("image", image);

    // Append other form data fields
    Object.entries(credentials).forEach(([key, value]) => {
      imageData.append(key, value);
    });

    try {
      if (selected.id) {
        const res = await axios.put(`/person?id=${credentials.id}`, imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        getPerson();
        showSuccessMessage(res.data.message);
        setTimeout(() => {
          handleModal(false);
          setSelected({});
        }, 1000);
      } else {
        const res = await axios.post("/person", imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        getPerson();
        showSuccessMessage(res.data.message);
        setTimeout(() => {
          handleModal(false);
          setSelected({});
        }, 1000);
      }

      setImage(null);
      setImgSrc(null);
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <ToastContainer />
        <form className="relative w-3/6 my-6 mx-auto">
          {/*content*/}
          <div className="flex flex-col border-0 rounded-lg shadow-lg relative w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold">
                {selected.id
                  ? "UPDATE PERSON OF CONCERN"
                  : "ADD PERSON OF CONCERN"}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => handleModal(false)}>
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex flex-col gap-4 p-6 flex-auto">
              {/* UPLOAD */}
              <div className="flex flex-col gap-1">
                <img
                  src={
                    !imgSrc
                      ? `${clientUrl}/default.jpg`
                      : isImageChanged
                      ? imgSrc
                      : `data:image/jpeg;base64,${imgSrc}`
                  }
                  className="w-40"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {/* First Row */}
              <div className="flex gap-2">
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Taylor"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.first_name}
                    onChange={handleFirstNameChange}
                  />
                </div>

                <div className="flex w-3/12 flex-col">
                  <label className="ps-2">Middle Name</label>
                  <input
                    type="text"
                    placeholder="Swift"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.middle_name}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        middle_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex w-5/12 flex-col">
                  <label className="ps-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Swift"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.last_name}
                    onChange={handleLastNameChange}
                  />
                </div>
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Alias</label>
                  <input
                    type="text"
                    placeholder="Robert Baker"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.alias}
                    onChange={(e) =>
                      setCredentials({ ...credentials, alias: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Second Row */}
              <div className="flex gap-2">
                <div className="flex w-full flex-col">
                  <label className="ps-2">Last Known Address</label>
                  <input
                    type="text"
                    placeholder="Agusan del Sur"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.last_known_address}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="flex w-6/12 flex-col">
                  <label className="ps-2">Type</label>
                  <Select
                    options={typeOpt}
                    defaultValue={{
                      label: credentials.type,
                      value: credentials.type,
                    }}
                    onChange={(e) =>
                      setCredentials({ ...credentials, type: e.value })
                    }
                  />
                </div>
              </div>

              {/* Third Row */}
              <div className="flex gap-2">
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Gender</label>
                  <Select
                    options={genderOpt}
                    onChange={handleGenderChange}
                    defaultValue={{
                      label: credentials.gender,
                      value: credentials.gender,
                    }}
                  />
                </div>
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Status</label>
                  <Select
                    options={statusOpt}
                    onChange={(e) =>
                      setCredentials({ ...credentials, status: e.value })
                    }
                    defaultValue={{
                      label: credentials.status,
                      value: credentials.status,
                    }}
                  />
                </div>
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Height (cm)</label>
                  <input
                    type="text"
                    placeholder="170"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.height}
                    onChange={(e) =>
                      setCredentials({ ...credentials, height: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Weight (kg)</label>
                  <input
                    type="text"
                    placeholder="55"
                    className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                    value={credentials.weight}
                    onChange={(e) =>
                      setCredentials({ ...credentials, weight: e.target.value })
                    }
                  />
                </div>
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Eye Color</label>
                  <Select
                    options={eyeColorOpt}
                    onChange={handleEyeColorChange}
                    defaultValue={{
                      label: credentials.eye_color,
                      value: credentials.eye_color,
                    }}
                  />
                </div>
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Hair Color</label>
                  <Select
                    options={hairColorOpt}
                    onChange={handleHairColorChange}
                    defaultValue={{
                      label: credentials.hair_color,
                      value: credentials.hair_color,
                    }}
                  />
                </div>
                <div className="flex w-4/12 flex-col">
                  <label className="ps-2">Hair Style</label>
                  <Select
                    options={hairStyleOpt}
                    onChange={handleHairStyleChange}
                    defaultValue={{
                      label: credentials.hair_style,
                      value: credentials.hair_style,
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col">
                <label className="ps-2">Remarks</label>
                <input
                  type="text"
                  placeholder="Write update"
                  className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                  value={credentials.remarks}
                  onChange={(e) =>
                    setCredentials({ ...credentials, remarks: e.target.value })
                  }
                />
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-3">
              <Button
                color="danger"
                variant="light"
                onClick={() => [handleModal(false), setSelected({})]}>
                CLOSE
              </Button>

              <Button color="success" onClick={handleSubmit}>
                SUBMIT
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
