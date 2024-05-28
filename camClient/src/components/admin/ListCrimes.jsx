import React from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

export default function ListCrimes({ reportedCrime }) {
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
  const sendAwareness = (e) => {
    e.preventDefault();
    if (!e.target.id) return;
    const result = window.confirm("Wan't to send awareness?");

    if (result) {
      // User clicked "OK"
      // Perform the action you want to do on confirmation
      socket.emit("send_message", { message: e.target.id });
    }
  };
  return (
    <>
      {!reportedCrime ? (
        <>Loading...</>
      ) : (
        reportedCrime.map((data) => (
          <div
            key={data.id}
            id={`offence: ${data.offense} Date: ${getSpecificDate(
              data.created_at
            )} Address: ${data.city + ", " + data.barangay}`}
            className="w-full p-2 border-t-2 border-slate-300 cursor-pointer hover:underline"
            onClick={(e) => sendAwareness(e)}>
            <p
              id={`offence: ${data.offense} Date: ${getSpecificDate(
                data.created_at
              )} Address: ${data.city + ", " + data.barangay}`}>
              <span className="font-semibold">Offense:</span> {data.offense}
            </p>
            <p
              id={`offence: ${data.offense} Date: ${getSpecificDate(
                data.created_at
              )} Address: ${data.city + ", " + data.barangay}`}>
              <span className="font-semibold">Date:</span>{" "}
              {getSpecificDate(data.created_at)}
            </p>
            <p
              id={`offence: ${data.offense} Date: ${getSpecificDate(
                data.created_at
              )} Address: ${data.city + ", " + data.barangay}`}>
              <span className="font-semibold">Address:</span>{" "}
              {data.city + ", " + data.barangay}
            </p>
            <p
              id={`offence: ${data.offense} Date: ${getSpecificDate(
                data.created_at
              )} Address: ${data.city + ", " + data.barangay}`}>
              <span className="font-semibold">Reported By:</span>{" "}
              {data.first_name + ", " + data.last_name}
            </p>
          </div>
        ))
      )}
    </>
  );
}
