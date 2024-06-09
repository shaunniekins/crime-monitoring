import { useState, useEffect, useRef, useMemo } from "react";
import Cookies from "universal-cookie";
import "./App.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import ReportWanted from "./components/client/ReportWanted";
import ReportCrime from "./components/client/ReportCrime";
import ReportMissing from "./components/client/ReportMissing";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationSound from "./assets/notificationsound.mp3";
import ProneArea from "./components/client/ProneArea";
import PolygonMap from "./components/admin/crime/PolygonMap";
import { FaLocationDot } from "react-icons/fa6";
import DisplayWanted from "./components/DisplayWanted";
import { serverUrl } from "./urlConfig";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";

const socket = io.connect(serverUrl);

const barangayColors = {
  Consuelo: "bg-gray-600",
  "Bunawan Brook": "bg-yellow-400",
  "San Teodoro": "bg-pink-300",
  Libertad: "bg-green-500",
  "San Andres": "bg-orange-400",
  "San Teodoro": "bg-red-200",
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

function App() {
  const cookies = new Cookies({ path: "/" });
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState({});
  const [activePage, setActivePage] = useState("home");
  const [crimes, setCrimes] = useState("");
  const [history, setHistory] = useState([]);
  const [totalCasesPerBrgy, setTotalCasesPerBrgy] = useState([]);
  const [wantedHistory, setWantedHistory] = useState([]);
  const [missingHistory, setMissingHistory] = useState([]);
  const [update, setUpdate] = useState(false);

  const [updatedData, setUpdatedData] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCrimeType, setSelectedCrimeType] = useState("all");
  const [selectedIndexCrime, setSelectedIndexCrime] = useState("");
  const [selectedNonIndexCrime, setSelectedNonIndexCrime] = useState("");

  // handle FUNCTIONS
  const handleActivePage = (page) => {
    setActivePage(page);
  };

  // GET FUNCTIONS
  const getTotalCasesPerBrgy = async () => {
    await axios
      .get(`/crime/countCasesPerBrgy`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setTotalCasesPerBrgy(res.data.data);
      });
  };
  const getHistory = async () => {
    await axios
      .get(`/history?officer_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setHistory(res.data.data);
      });
  };
  const getWantedHistory = async () => {
    await axios
      .get(`/personHistory?officer_id=${user.id}&type=wanted`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setWantedHistory(res.data.data);
      });
  };
  const getMissingHistory = async () => {
    await axios
      .get(`/personHistory?officer_id=${user.id}&type=missing`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setMissingHistory(res.data.data);
      });
  };
  const getCrimes = async () => {
    await axios
      .get(`/crime`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCrimes(res.data.data);
      });
  };
  // SET USER / LOGGED IN

  useEffect(() => {
    const getUser = async () => {
      if (cookies.get("user")) {
        const token = cookies.get("user");
        const decoded = jwt_decode(token.data);
        await axios
          .get(`/user/?id=${decoded.id}`, {
            headers: {
              Authorization: `Bearer ${token.data}`,
            },
          })
          .then((res) => {
            if (res.data.data[0].role === "admin") return navigate("/admin");
            setUser(res.data.data[0]);
          });
        setAccessToken(token.data);
      }
    };
    getUser();
    getCrimes();
    getTotalCasesPerBrgy();
  }, []);

  useEffect(() => {
    if (user.id) {
      getHistory();
      getWantedHistory();
      getMissingHistory();
    }
  }, [user, update]);

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

  // SOCKET
  useEffect(() => {
    // Listen for messages from the server
    socket.on("receive_message", (message) => {
      // Display a toast notification when a new message arrives with a 5-minute duration
      toast.warning(`Crime Awareness: ${message.message}`, {
        autoClose: 8000, // 5 minutes in milliseconds
        icon: "🚨",
      });

      // Play the notification sound only in response to user interaction
      playNotificationSound();
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const playNotificationSound = () => {
    // Create a new Audio object and play the notification sound
    const audio = new Audio(notificationSound);
    if (audio.play && typeof audio.play === "function") {
      audio.play().catch((error) => {
        console.error("Autoplay failed:", error);
      });
    }
  };

  return (
    <main className="flex flex-col min-h-screen max-w-screen bg-slate-200 overflow-x-hidden overflow-hidden">
      <Header
        user={user}
        handleActivePage={handleActivePage}
        setUser={setUser}
        setAccessToken={setAccessToken}
        accessToken={accessToken}
      />
      {!accessToken ? (
        <>
          <p className="container mx-auto bg-red-200 shadow-md p-2 m-2 rounded-lg text-center text-slate-500 font-bold">
            Please login to access more of the page.
          </p>
          <div className="container mx-auto h-full bg-gray-100 shadow-md p-3 m-2 rounded-lg text-center text-slate-500 font-bold">
            <DisplayWanted />
          </div>
        </>
      ) : (
        <section className="flex flex-col p-5">
          {activePage === "wanted" ? (
            <ReportWanted
              user={user}
              accessToken={accessToken}
              wantedHistory={wantedHistory}
              getWantedHistory={getWantedHistory}
            />
          ) : activePage === "crime" ? (
            !user ? (
              <>Loading...</>
            ) : (
              <ReportCrime
                user={user}
                history={history}
                getHistory={getHistory}
                setUpdate={setUpdate}
                update={update}
              />
            )
          ) : activePage === "missing" ? (
            <ReportMissing
              user={user}
              missingHistory={missingHistory}
              getMissingHistory={getMissingHistory}
            />
          ) : !crimes ? (
            <>Loading...</>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="w-full bg-white rounded-md p-2 px-5 ">
                <ProneArea totalCasesPerBrgy={totalCasesPerBrgy} />
              </div>
              <div className="w-full">
                <Tabs aria-label="Options">
                  <Tab key="crime" title="Crime">
                    <Card>
                      <CardBody>
                        <div className="flex relative">
                          <div className="w-full">
                            {updatedData && (
                              <PolygonMap
                                crimes={filteredData}
                                barangay={selectedBarangay}
                              />
                            )}
                          </div>
                          <div className="w-56 py-3 px-2 absolute top-0 right-0 text-sm flex-flex-col bg-black">
                            <select
                              name="filter-barangay"
                              id="filter-barangay"
                              onChange={(e) =>
                                setSelectedBarangay(e.target.value)
                              }
                              className="px-3 py-2 rounded-lg mb-3 w-full">
                              <option value="">Select Barangay</option>
                              <option value="all">All Barangay</option>
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
                              onChange={(e) =>
                                setSelectedCrimeType(e.target.value)
                              }
                              className="px-3 py-2 rounded-lg w-full">
                              <option value="all">All Crimes</option>
                              <option value="index">Index Crimes</option>
                              <option value="non-index">
                                Non-Index Crimes
                              </option>
                            </select>

                            {selectedCrimeType === "index" && (
                              <select
                                name="filter-index-crime"
                                id="filter-index-crime"
                                onChange={(e) =>
                                  setSelectedIndexCrime(e.target.value)
                                }
                                className="px-3 py-2 rounded-lg mt-3 w-full">
                                <option value="">All Index Crimes</option>
                                {offenseOpt
                                  .filter((opt) =>
                                    indexCrimes.some((crime) =>
                                      opt.label
                                        .toLowerCase()
                                        .includes(crime.toLowerCase())
                                    )
                                  )
                                  .map((crime) => (
                                    <option
                                      value={crime.value}
                                      key={crime.value}>
                                      {crime.label
                                        .split(" ")
                                        .map(
                                          (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1)
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
                                onChange={(e) =>
                                  setSelectedNonIndexCrime(e.target.value)
                                }
                                className="px-3 py-2 rounded-lg mt-3 w-full">
                                <option value="">All Non-Index Crimes</option>
                                {offenseOpt
                                  .filter(
                                    (opt) =>
                                      !indexCrimes.some((crime) =>
                                        opt.label
                                          .toLowerCase()
                                          .includes(crime.toLowerCase())
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
                                  <p className="text-white p-2 font-bold">
                                    {barangay}
                                  </p>
                                  {selectedCrimeType === "all" ? (
                                    <>
                                      <div className="text-white">
                                        <p className="text-xs">
                                          Index:{" "}
                                          <span className="font-semibold">
                                            {index}
                                          </span>
                                        </p>
                                        <p className="text-xs">
                                          Non-Index:{" "}
                                          <span className="font-semibold">
                                            {nonIndex}
                                          </span>
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-white">
                                        <p className="text-xs">
                                          {selectedCrimeType === "index"
                                            ? `${
                                                selectedIndexCrime ||
                                                "Index Crimes"
                                              }: `
                                                .split(" ")
                                                .map(
                                                  (word) =>
                                                    word
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    word.slice(1)
                                                )
                                                .join(" ")
                                            : `${
                                                selectedNonIndexCrime ||
                                                "Non-Index Crimes"
                                              }: `
                                                .split(" ")
                                                .map(
                                                  (word) =>
                                                    word
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    word.slice(1)
                                                )
                                                .join(" ")}
                                          <span className="font-semibold">
                                            {selectedCrimeType === "index"
                                              ? index
                                              : nonIndex}
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
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="person-of-concern" title="Person of Concern">
                    <Card>
                      <CardBody>
                        <div className="container mx-auto w-full h-full bg-gray-100 shadow-md p-3 m-2 rounded-lg text-center text-slate-500 font-bold">
                          <DisplayWanted />
                        </div>
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </div>
            </div>
          )}
        </section>
      )}
      <ToastContainer />
    </main>
  );
}

export default App;
