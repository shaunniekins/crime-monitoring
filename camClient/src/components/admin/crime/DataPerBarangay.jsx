import React from "react";

export default function DataPerBarangay({ totalCasesPerBrgy }) {
  const formattedData = [];

  totalCasesPerBrgy.forEach((entry) => {
    const { barangay, total_cases, offense, count_per_barangay } = entry;

    // Check if the barangay already exists in the formattedData array
    const existingBarangay = formattedData.find(
      (item) => item.barangay === barangay
    );

    if (existingBarangay) {
      // Barangay exists, add the offense details
      existingBarangay.offenses.push({ offense, count_per_barangay });
    } else {
      // Barangay doesn't exist, create a new entry
      formattedData.push({
        barangay,
        total_cases,
        offenses: [{ offense, count_per_barangay }],
      });
    }
  });
  return (
    <>
      <p className="text-start p-2 font-bold text-slate-500">
        Total Cases Per Barangay
      </p>
      <hr></hr>
      {!totalCasesPerBrgy ? (
        <></>
      ) : (
        formattedData.map((count, index) => (
          <div className="border-b-2 border-slate-200" key={index}>
            <p className="text-center font-serif text-lg m-2">
              {count.barangay} :{" "}
              <span className="text-2xl font-bold">{count.total_cases}</span>
            </p>
            <p className="text-center font-semibold">Crimes:</p>
            {count.offenses.map((data, index) => (
              <p className="text-xs text-start" key={index}>
                {data.offense.split(" ").slice(0, 5).join(" ")} (
                <span className="font-bold"> {data.count_per_barangay} </span>)
              </p>
            ))}
          </div>
        ))
      )}
    </>
  );
}
