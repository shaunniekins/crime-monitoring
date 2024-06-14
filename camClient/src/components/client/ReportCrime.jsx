import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { serverUrl } from "../../urlConfig";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
} from "@nextui-org/react";
import { barangayOpt1, felonyOpt, offenseOpt1, placeOpt } from "../options";

const socket = io.connect(serverUrl);

export default function ReportCrime({
  user,
  accessToken,
  history,
  update,
  setUpdate,
}) {
  const [details, setDetails] = useState({
    officer_id: user.id,
    region: "Caraga Region XIII",
    province: "Agusan del Sur",
    city: "Bunawan",
    offense: "",
    barangay: "",
  });

  const [loading, setLoading] = useState(false);

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

  const regionOpt = [];
  let provinceOpt = [];
  let cityOpt = [];

  // GET FUNCTIONS

  // const getRegion = async () => {
  //   const regionResult = await regions().then((region) => region);
  //   regionResult.map((region) =>
  //     regionOpt.push({ label: region.region_name, value: region.region_code })
  //   );
  // };

  // const getProvince = async (code) => {
  //   setDetails({...details, region: code.label})
  //   const provinceResult = await provinces(code.value).then((province) => province);
  //   while (provinceOpt.length > 0) {
  //     provinceOpt.pop();
  //   }
  //   provinceResult.map((province) => {
  //     provinceOpt.push({
  //       label: province.province_name,
  //       value: province.province_code,
  //     });
  //   });
  // };

  // const getCities = async (code) => {
  //   const citiesResult = await cities(code).then((city) => city);
  //   while (cityOpt.length > 0) {
  //     cityOpt.pop();
  //   }
  //   citiesResult.map((city) => {
  //     cityOpt.push({ label: city.city_name, value: city.city_code });
  //   });
  // };

  // const getBarangay = async (code) => {
  //   const barangayResult = await barangays(code).then((barangays) => barangays);
  //   // console.log(barangayResult)
  //   while (barangayOpt.length > 0) {
  //     barangayOpt.pop();
  //   }
  //   barangayResult.map((barangay) => {
  //     barangayOpt.push({
  //       label: barangay.brgy_name,
  //       value: barangay.brgy_name,
  //     });
  //   });
  // };

  // HANDLE SUBMIT

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.offense) return showErrorMessage("Please select offense.");
    if (!details.barangay) return showErrorMessage("Please select barangay.");
    await axios
      .post("/crime", details)
      .then(async (res) => {
        setLoading(false);
        showSuccessMessage("Crime Reported Successfully.");
        socket.emit("send_report", { message: "Hello" });
        setDetails({ ...details, offense: "", barangay: "" });
        setUpdate(!update);
        await axios
          .post("/history", { officer_id: user.id })
          // .then((res) => console.log(res))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
        showErrorMessage(
          error.response.data.error + ". " + error.response.data.message
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDetails({
              ...details,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser");
      }
    };

    getLocation();
  }, []);

  return (
    <div className="w-full justify-center items-start flex md:gap-2">
      <ToastContainer />
      <Card className="w-full">
        <CardHeader>
          <h1 className="font-serif font-bold text-lg md:text-2xl">
            REPORT CRIME
          </h1>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="">Offense</label>
            <Select
              options={offenseOpt1}
              value={{ label: details.offense, value: details.offense }}
              onChange={(e) => setDetails({ ...details, offense: e.value })}
            />
          </div>
          <div className="flex flex-col">
            <div>Address</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <label>Region</label>
                <Select
                  defaultValue={{
                    label: details.region,
                    value: details.region,
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label>Provinces</label>
                <Select
                  defaultValue={{
                    label: details.province,
                    value: details.province,
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label>City</label>
                <Select
                  defaultValue={{ label: details.city, value: details.city }}
                />
              </div>
              <div className="flex flex-col">
                <label>Barangay</label>
                <Select
                  options={barangayOpt1}
                  value={{ label: details.barangay, value: details.barangay }}
                  onChange={(e) =>
                    setDetails({ ...details, barangay: e.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Place Type</label>
            <Select
              options={placeOpt}
              defaultValue={details.type_place}
              onChange={(e) => setDetails({ ...details, type_place: e.value })}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Stages Felony</label>
            <Select
              options={felonyOpt}
              defaultValue={details.stages_felony}
              onChange={(e) =>
                setDetails({ ...details, stages_felony: e.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label htmlFor="">Date Reported</label>
              <input
                type="date"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.date_reported}
                onChange={(e) =>
                  setDetails({ ...details, date_reported: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Time Reported</label>
              <input
                type="time"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.time_reported}
                onChange={(e) =>
                  setDetails({ ...details, time_reported: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Date Committed</label>
              <input
                type="date"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.date_committed}
                onChange={(e) =>
                  setDetails({ ...details, date_committed: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Time Committed</label>
              <input
                type="time"
                className="border border-neutral-300 p-2 rounded-md"
                value={details.time_committed}
                onChange={(e) =>
                  setDetails({ ...details, time_committed: e.target.value })
                }
              />
            </div>
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
        <p className="font-bold">Reported History</p>

        {!history ? (
          <>Loading...</>
        ) : (
          history.map((data, index) => (
            <div key={index} className="w-full p-2 border-b-2 border-slate-300">
              <p>
                <span className="font-semibold">Offense:</span> {data.offense}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {getSpecificDate(data.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
