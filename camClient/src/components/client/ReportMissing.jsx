import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MissingTable from "./MissingTable";
import { clientUrl } from "../../urlConfig";
import { genderOpt, eyeColorOpt, hairColorOpt, hairStyleOpt } from "../options";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { MdHistory } from "react-icons/md";

export default function ReportMissing({
  user,
  missingHistory,
  getMissingHistory,
}) {
  const [details, setDetails] = useState({
    type: "MISSING PERSON",
    officer_id: user.id,
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const currentTimestamp = Date.now();

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

  const getSpecificDate = (created_at) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const date = new Date(created_at);
    const longDate = date.toLocaleDateString("en-US", options);
    return longDate;
  };

  const hoursDifference = (date) => {
    const dif = (currentTimestamp - date) / (1000 * 60 * 60);
    if (dif >= 24) {
      return "Validated";
    } else {
      return "Not validated";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgSrc(URL.createObjectURL(file)); // Set the image src for preview
    } else {
      setImgSrc(null);
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.type) return showErrorMessage("Please select type.");
    if (!details.first_name)
      return showErrorMessage("Please select first name.");
    if (!details.gender) return showErrorMessage("Please select gender.");

    const imageData = new FormData();
    imageData.append("image", image);

    // Append other form data fields
    Object.entries(details).forEach(([key, value]) => {
      imageData.append(key, value);
    });

    try {
      const res = await axios.post("/person", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      setImage(null);
      setImgSrc(null);
      showSuccessMessage(`${details.type} Reported Successfully.`);
      await axios
        .post("/personHistory", { officer_id: user.id, type: "missing" })
        // .then((res) => console.log(res))
        .catch((error) => console.log(error));
      getMissingHistory();
      setDetails({
        ...details,
        first_name: "",
        last_name: "",
        middle_name: "",
        gender: "",
        alias: "",
        last_known_address: "",
        weight: "",
        height: "",
        eye_color: "",
        hair_color: "",
        hair_style: "",
      });
    } catch (error) {
      showErrorMessage(error.response.data.error);
      setTimeout(() => {
        setImgSrc(null);
        setImage(null);
      }, 1000);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full justify-center items-start flex md:gap-2">
      <MissingTable
        missingHistory={missingHistory}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
      <ToastContainer />
      <Card className="w-full">
        <CardHeader>
          <div className="w-full flex justify-between items-center">
            <h1 className="font-serif font-bold text-lg md:text-2xl">
              REPORT MISSING PERSON
            </h1>
            <Button
              isIconOnly
              onPress={onOpen}
              variant="light"
              className="md:hidden text-2xl">
              <MdHistory />
            </Button>
          </div>
        </CardHeader>
        <Divider />

        <CardBody className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <img
              src={!imgSrc ? `${clientUrl}/default.jpg` : imgSrc}
              className="w-40"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.first_name}
                onChange={(e) =>
                  setDetails({ ...details, first_name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label>Middle Name</label>
              <input
                type="text"
                placeholder="Middle Name"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.middle_name}
                onChange={(e) =>
                  setDetails({ ...details, middle_name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.last_name}
                onChange={(e) =>
                  setDetails({ ...details, last_name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label>Alias</label>
              <input
                type="text"
                placeholder="Alias"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.alias}
                onChange={(e) =>
                  setDetails({ ...details, alias: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label>Gender</label>
              <Select
                options={genderOpt}
                value={{ label: details.gender, value: details.gender }}
                onChange={(e) => setDetails({ ...details, gender: e.value })}
              />
            </div>
            <div className="flex flex-col">
              <label>Height (cm)</label>
              <input
                type="text"
                placeholder="170"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.height}
                onChange={(e) =>
                  setDetails({ ...details, height: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label>Weight (kg)</label>
              <input
                type="text"
                placeholder="55"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.weight}
                onChange={(e) =>
                  setDetails({ ...details, weight: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label>Eye Color</label>
              <Select
                options={eyeColorOpt}
                value={{ label: details.eye_color, value: details.eye_color }}
                onChange={(e) => setDetails({ ...details, eye_color: e.value })}
              />
            </div>
            <div className="flex flex-col">
              <label>Hair Color</label>
              <Select
                options={hairColorOpt}
                value={{
                  label: details.hair_color,
                  value: details.hair_color,
                }}
                onChange={(e) =>
                  setDetails({ ...details, hair_color: e.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label>Hair Style</label>
              <Select
                options={hairStyleOpt}
                value={{
                  label: details.hair_style,
                  value: details.hair_style,
                }}
                onChange={(e) =>
                  setDetails({ ...details, hair_style: e.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label>Last Known Address</label>
            <input
              type="text"
              placeholder="Last Known Address"
              className="border border-neutral-300 p-2 rounded-md"
              value={details.last_known_address}
              onChange={(e) =>
                setDetails({ ...details, last_known_address: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label>Type</label>
            <Select
              isDisabled={true}
              value={{ label: details.type, value: details.type }}
              onChange={(e) => setDetails({ ...details, type: e.value })}
            />
          </div>
        </CardBody>
        <Divider />

        <CardFooter className="w-full flex justify-center items-center">
          <Button color="success" className="text-white" onClick={handleSubmit}>
            SUBMIT REPORT
          </Button>
        </CardFooter>
      </Card>
      <div className="w-1/6 bg-white rounded-md p-2 max-h-96 overflow-y-scroll hidden md:block">
        <p className="font-bold">Reported Missing History</p>
        <Button onPress={onOpen} variant="light">
          {" "}
          View All
        </Button>

        {missingHistory &&
          missingHistory.map((data, index) => (
            <div key={index} className="w-full p-2 border-b-2 border-slate-300">
              <img
                src={
                  data.url
                    ? `data:image/jpeg;base64,${data.url}`
                    : `${clientUrl}/default.jpg`
                }
                className="w-20 rounded-md border-2 border-slate-100"
              />
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {data.first_name + ", " + data.last_name}
              </p>
              <p>
                <span className="font-semibold">Alias:</span> {data.alias}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {getSpecificDate(data.created_at)}
              </p>
              <p>
                status:
                <span
                  className={
                    hoursDifference(new Date(data.created_at).getTime()) ===
                    "Validated"
                      ? "p-1 bg-emerald-200"
                      : "bg-red-200 p-1"
                  }>
                  {hoursDifference(new Date(data.created_at).getTime()) ===
                  "Validated"
                    ? data.status
                    : hoursDifference(new Date(data.created_at).getTime())}
                </span>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
