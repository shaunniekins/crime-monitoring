import React, { useEffect } from "react";
import Select from "react-select";

export default function CrimeTable({ crimes, handleSelectedCrime, handleSubmit }) {


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

  return (
    <div className="">
      <div className="flex items-center gap-2 w-full">
        <label className="ps-2">CRIMES</label>

        <Select
          className="w-5/6"
          onChange={handleSelectedCrime}
          options={crimes.map((crime) => ({
            value: crime.id,
            label:
              crime.report_number +
              " | " +
              crime.type_of_crime +
              " | " +
              getSpecificDate(crime.created_at),
          }))}
        />

        <button
          className="bg-blue-400 text-white p-2 rounded-lg border-b-4 border-blue-700 hover:border-blue-800 hover:bg-blue-500"
          // onClick={}
        >
          TRACK LOCATION
        </button>
      </div>
    </div>
  );
}
