import React, { useState, useEffect, useMemo } from "react";
import PolygonMap from "./PolygonMap";
import { FaLocationDot } from "react-icons/fa6";

const barangayColors = {
  Consuelo: "bg-gray-600",
  "Bunawan Brook": "bg-yellow-400",
  "San Teodoro": "bg-pink-300",
  Libertad: "bg-green-500",
  "San Andres": "bg-orange-400",
  Imelda: "bg-purple-600",
  Poblacion: "bg-fuchsia-500",
  Mambalili: "bg-teal-600",
  "Nueva Era": "bg-cyan-300",
};

const barangayList = Object.keys(barangayColors);
const indexCrimes = [
  "murder",
  "homicide",
  "physical injury",
  "rape",
  "robbery",
  "theft",
  "carnapping",
];

const offenseOpt = [
  { label: "Under Investigation", value: "Under Investigation" },
  {
    label: "ALARMS AND SCANDALS  - RPC Art. 155",
    value: "ALARMS AND SCANDALS  - RPC Art. 155",
  },
  {
    label:
      "AN ACT INCREASING THE PENALTIES FOR ILLEGAL NUMBERS GAMES, AMENDING CERTAIN PROVISIONS OF PD. NO. 1602, AND FOR OTHER PURPOSES - RA 9287 amending pd 1602",
    value:
      "AN ACT INCREASING THE PENALTIES FOR ILLEGAL NUMBERS GAMES, AMENDING CERTAIN PROVISIONS OF PD. NO. 1602, AND FOR OTHER PURPOSES - RA 9287 amending pd 1602",
  },
  {
    label:
      "ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994  - RA 7832",
    value:
      "ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994  - RA 7832",
  },
  {
    label: "ANTI-GAMBLING LAW  - PD 1602",
    value: "ANTI-GAMBLING LAW  - PD 1602",
  },
  {
    label: "ARSON OF PROPERTY OF SMALL VALUE  - RPC Art. 323",
    value: "ARSON OF PROPERTY OF SMALL VALUE  - RPC Art. 323",
  },
  {
    label: "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002  - RA 9165",
    value: "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002  - RA 9165",
  },
  {
    label:
      "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF DANGEROUS DRUGS - RA 9165 Article II Section 11",
    value:
      "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF DANGEROUS DRUGS - RA 9165 Article II Section 11",
  },
  {
    label:
      "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF EQUIPMENT, INSTRUMENT, APPARATUS AND OTHER PARAPHERNALIA FOR DANGEROUS DRUGS - RA 9165 Article II Section 12",
    value:
      "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF EQUIPMENT, INSTRUMENT, APPARATUS AND OTHER PARAPHERNALIA FOR DANGEROUS DRUGS - RA 9165 Article II Section 12",
  },
  {
    label:
      "COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION  - RA 10591 (covers RA 9516, RA 8294, PD 1866)",
    value:
      "COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION  - RA 10591 (covers RA 9516, RA 8294, PD 1866)",
  },
  {
    label: "DESTRUCTIVE ARSON  - RPC Art. 320 amended by PD 1613 and PD 1744",
    value: "DESTRUCTIVE ARSON  - RPC Art. 320 amended by PD 1613 and PD 1744",
  },
  {
    label: "DIRECT ASSAULTS  - RPC Art. 148",
    value: "DIRECT ASSAULTS  - RPC Art. 148",
  },
  {
    label: "DISCHARGE OF FIREARMS - RPC Art 254",
    value: "DISCHARGE OF FIREARMS - RPC Art 254",
  },
  {
    label:
      "HIGHGRADING OR THEFT OF GOLD FROM A MINING CLAIM OR MINING CAMP (PRESCRIBING A HEAVIER MINIMUM PENALTY FOR) - PD 581",
    value:
      "HIGHGRADING OR THEFT OF GOLD FROM A MINING CLAIM OR MINING CAMP (PRESCRIBING A HEAVIER MINIMUM PENALTY FOR) - PD 581",
  },
  { label: "HOMICIDE  - RPC Art. 249", value: "HOMICIDE  - RPC Art. 249" },
  {
    label:
      "ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 as amended by RA 8294 and RA 9516",
    value:
      "ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 as amended by RA 8294 and RA 9516",
  },
  {
    label:
      "KIDNAPPING AND SERIOUS ILLEGAL DETENTION  - RPC Art. 267 as amended by RA 18 and RA 1084",
    value:
      "KIDNAPPING AND SERIOUS ILLEGAL DETENTION  - RPC Art. 267 as amended by RA 18 and RA 1084",
  },
  {
    label: "LESS SERIOUS PHYSICAL INJURIES  - RPC Art. 265",
    value: "LESS SERIOUS PHYSICAL INJURIES  - RPC Art. 265",
  },
  {
    label: "LIGHT THREATS  - RPC Art. 283",
    value: "LIGHT THREATS  - RPC Art. 283",
  },
  {
    label: "MALICIOUS MISCHIEF  - RPC Art. 327",
    value: "MALICIOUS MISCHIEF  - RPC Art. 327",
  },
  { label: "MURDER  - RPC Art. 248", value: "MURDER  - RPC Art. 248" },
  {
    label: "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
    value: "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
  },
  {
    label: "OMNIBUS ELECTION CODE OF THE PHILIPPINES - BP 881",
    value: "OMNIBUS ELECTION CODE OF THE PHILIPPINES - BP 881",
  },
  {
    label: "OTHER FORMS OF TRESPASS  - RPC Art. 281",
    value: "OTHER FORMS OF TRESPASS  - RPC Art. 281",
  },
  { label: "PARRICIDE  - RPC Art. 246", value: "PARRICIDE  - RPC Art. 246" },
  {
    label: "PHILIPPINE MINING ACT OF 1995 - RA 7942",
    value: "PHILIPPINE MINING ACT OF 1995 - RA 7942",
  },
  {
    label: "QUALIFIED THEFT  - RPC Art. 310  as amended by BP Blg 71",
    value: "QUALIFIED THEFT  - RPC Art. 310  as amended by BP Blg 71",
  },
  {
    label: "QUALIFIED TRESPASS TO DWELLING  - RPC Art. 280",
    value: "QUALIFIED TRESPASS TO DWELLING  - RPC Art. 280",
  },
  {
    label: "RAPE WITH HOMICIDE - RPC Art. 266-B",
    value: "RAPE WITH HOMICIDE - RPC Art. 266-B",
  },
  {
    label: "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
    value: "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
  },
  {
    label: "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC Art 365",
    value: "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC Art 365",
  },
  {
    label:
      "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE DAMAGE TO PROPERTY - RPC Art 365",
    value:
      "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE DAMAGE TO PROPERTY - RPC Art 365",
  },
  {
    label: "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE HOMICIDE - RPC Art 365",
    value: "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE HOMICIDE - RPC Art 365",
  },
  {
    label:
      "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE PHYSICAL INJURY - RPC Art 365",
    value:
      "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE PHYSICAL INJURY - RPC Art 365",
  },
  {
    label: "RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC Art 365",
    value: "RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC Art 365",
  },
  {
    label:
      "RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON  - RPC Art. 151",
    value:
      "RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON  - RPC Art. 151",
  },
  {
    label: "REVISED FORESTRY CODE OF THE PHILIPPINES - PD 705",
    value: "REVISED FORESTRY CODE OF THE PHILIPPINES - PD 705",
  },
  { label: "ROBBERY  - RPC Art. 293", value: "ROBBERY  - RPC Art. 293" },
  {
    label: "SERIOUS PHYSICAL INJURIES  - RPC Art. 263",
    value: "SERIOUS PHYSICAL INJURIES  - RPC Art. 263",
  },
  {
    label: "SLANDER (ORAL DEFAMATION) - RPC Art. 358",
    value: "SLANDER (ORAL DEFAMATION) - RPC Art. 358",
  },
  {
    label: "SLIGHT PHYSICAL INJURIES AND MALTREATMENT  - RPC Art. 266",
    value: "SLIGHT PHYSICAL INJURIES AND MALTREATMENT  - RPC Art. 266",
  },
  {
    label: "SWINDLING (ESTAFA)  - RPC Art. 315 as amended by PD 1689",
    value: "SWINDLING (ESTAFA)  - RPC Art. 315 as amended by PD 1689",
  },
  {
    label:
      "THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705",
    value:
      "THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705",
  },
  { label: "THEFT  - RPC Art. 308", value: "THEFT  - RPC Art. 308" },
  {
    label: "UNJUST VEXATIONS - RPC Art. 287",
    value: "UNJUST VEXATIONS - RPC Art. 287",
  },
];

export default function FirstPage({ crimes }) {
  const [updatedData, setUpdatedData] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCrimeType, setSelectedCrimeType] = useState("all");
  const [selectedIndexCrime, setSelectedIndexCrime] = useState("");
  const [selectedNonIndexCrime, setSelectedNonIndexCrime] = useState("");

  const getBarangayColor = (barangay) => {
    return barangayColors[barangay] || "bg-blue-500";
  };

  const isIndexCrime = (offense) => {
    if (selectedIndexCrime) {
      return offense.toLowerCase().includes(selectedIndexCrime.toLowerCase());
    }
    return indexCrimes.some((keyword) =>
      offense.toLowerCase().includes(keyword)
    );
  };

  const isNonIndexCrime = (offense) => {
    if (selectedNonIndexCrime) {
      return (
        offense.toLowerCase().includes(selectedNonIndexCrime.toLowerCase()) &&
        !indexCrimes.some((keyword) =>
          offense.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    return !indexCrimes.some((keyword) =>
      offense.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const processedData = useMemo(() => {
    if (!crimes) return [];

    return crimes.map((dataItem) => ({
      ...dataItem,
      type: isIndexCrime(dataItem.offense)
        ? "index"
        : isNonIndexCrime(dataItem.offense)
        ? "non-index"
        : "other",
    }));
  }, [crimes, selectedIndexCrime, selectedNonIndexCrime]);

  const years = useMemo(() => {
    const yearsSet = new Set();
    processedData.forEach((crime) => {
      const year = new Date(crime.date_committed).getFullYear();
      if (!isNaN(year)) {
        yearsSet.add(year);
      }
    });
    return [...yearsSet].sort((a, b) => b - a);
  }, [processedData]);

  const counts = useMemo(() => {
    const counts = {};
    processedData.forEach((crime) => {
      const { barangay, type } = crime;
      const year = new Date(crime.date_committed).getFullYear();

      if (
        (barangay === selectedBarangay || selectedBarangay === "all") &&
        (year.toString() === selectedYear || selectedYear === "all") &&
        (type === selectedCrimeType || selectedCrimeType === "all")
      ) {
        counts[barangay] = counts[barangay] || {
          index: 0,
          nonIndex: 0,
          other: 0,
        };
        if (type === "index") {
          counts[barangay].index++;
        } else if (type === "non-index") {
          counts[barangay].nonIndex++;
        } else {
          counts[barangay].other++;
        }
      }
    });
    return counts;
  }, [
    processedData,
    selectedBarangay,
    selectedYear,
    selectedCrimeType,
    selectedNonIndexCrime,
  ]);

  const filteredData = useMemo(() => {
    return processedData.filter((data) => {
      const year = new Date(data.date_committed).getFullYear();
      return (
        (data.barangay === selectedBarangay || selectedBarangay === "all") &&
        (year.toString() === selectedYear || selectedYear === "all") &&
        (data.type === selectedCrimeType || selectedCrimeType === "all")
      );
    });
  }, [processedData, selectedBarangay, selectedYear, selectedCrimeType]);

  useEffect(() => {
    setUpdatedData(processedData);
  }, [processedData]);

  const getLegendItems = () => {
    const legendItems = [];

    if (selectedCrimeType === "all" || selectedCrimeType === "index") {
      legendItems.push(
        <div key="index" className="flex gap-1">
          <FaLocationDot className="text-red-600 text-2xl" />
          <p>
            Index Crimes
            {/* (
            {selectedIndexCrime || indexCrimes.join(", ")}) */}
          </p>
        </div>
      );
    }

    if (selectedCrimeType === "all" || selectedCrimeType === "non-index") {
      legendItems.push(
        <div key="non-index" className="flex gap-1">
          <FaLocationDot className="text-blue-600 text-2xl" />
          <p>
            Non-Index Crimes
            {/* (
            {selectedNonIndexCrime || nonIndexCrimes.join(", ")}) */}
          </p>
        </div>
      );
    }

    return legendItems;
  };

  return (
    <div className="bg-white gap-2 w-full">
      <div className="flex relative">
        <div className="w-full">
          {updatedData && (
            <PolygonMap crimes={filteredData} barangay={selectedBarangay} />
          )}
        </div>
        <div className="w-56 py-3 px-2 absolute top-0 right-0 text-sm flex-flex-col bg-black">
          <select
            name="filter-barangay"
            id="filter-barangay"
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-3 py-2 rounded-lg mb-3 w-full">
            <option value="">Select Barangay</option>
            {barangayList.map((barangay) => (
              <option value={barangay} key={barangay}>
                {barangay}
              </option>
            ))}
          </select>
          <select
            name="filter-year"
            id="filter-year"
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-lg mb-3 w-full">
            <option value="all">All Years</option>
            {years.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            name="filter-crime-type"
            id="filter-crime-type"
            onChange={(e) => setSelectedCrimeType(e.target.value)}
            className="px-3 py-2 rounded-lg w-full">
            <option value="all">All Crimes</option>
            <option value="index">Index Crimes</option>
            <option value="non-index">Non-Index Crimes</option>
          </select>

          {selectedCrimeType === "index" && (
            <select
              name="filter-index-crime"
              id="filter-index-crime"
              onChange={(e) => setSelectedIndexCrime(e.target.value)}
              className="px-3 py-2 rounded-lg mt-3 w-full">
              <option value="">All Index Crimes</option>
              {offenseOpt
                .filter((opt) =>
                  indexCrimes.some((crime) =>
                    opt.label.toLowerCase().includes(crime.toLowerCase())
                  )
                )
                .map((crime) => (
                  <option value={crime.value} key={crime.value}>
                    {crime.label
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
            </select>
          )}

          {selectedCrimeType === "non-index" && (
            <select
              name="filter-non-index-crime"
              id="filter-non-index-crime"
              onChange={(e) => setSelectedNonIndexCrime(e.target.value)}
              className="px-3 py-2 rounded-lg mt-3 w-full">
              <option value="">All Non-Index Crimes</option>
              {offenseOpt
                .filter(
                  (opt) =>
                    !indexCrimes.some((crime) =>
                      opt.label.toLowerCase().includes(crime.toLowerCase())
                    )
                )
                .map((opt) => (
                  <option value={opt.value} key={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
          )}

          {Object.entries(counts).map(
            ([barangay, { index, nonIndex, other }]) => (
              <div
                key={barangay}
                className={`flex justify-between items-center gap-2 p-1 mt-3 text-xs ${getBarangayColor(
                  barangay
                )}`}>
                <p className="text-white p-2 font-bold">{barangay}</p>
                {selectedCrimeType === "all" ? (
                  <>
                    <div className="text-white">
                      <p className="text-xs">
                        Index: <span className="font-semibold">{index}</span>
                      </p>
                      <p className="text-xs">
                        Non-Index:{" "}
                        <span className="font-semibold">{nonIndex}</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-white">
                      <p className="text-xs">
                        {selectedCrimeType === "index"
                          ? `${selectedIndexCrime || "Index Crimes"}: `
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : `${selectedNonIndexCrime || "Non-Index Crimes"}: `
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                        <span className="font-semibold">
                          {selectedCrimeType === "index" ? index : nonIndex}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          )}

          {selectedCrimeType === "all" &&
            filteredData &&
            filteredData.length > 0 && (
              <div className="mt-3 flex flex-col gap-1 text-white">
                {getLegendItems()}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}