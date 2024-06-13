import { useState, useEffect, useMemo } from "react";
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
import { barangayColors, indexCrimes, offenseOpt1 } from "./components/options";

const socket = io.connect(serverUrl);

const barangayList = Object.keys(barangayColors);

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
          <p>Index Crimes</p>
        </div>
      );
    }

    if (selectedCrimeType === "all" || selectedCrimeType === "non-index") {
      legendItems.push(
        <div key="non-index" className="flex gap-1">
          <FaLocationDot className="text-blue-600 text-2xl" />
          <p>Non-Index Crimes</p>
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
          <p className="mx-3 md:container md:mx-auto bg-red-200 shadow-md p-2 my-2 rounded-lg text-center text-slate-500 font-bold">
            Please login to access more of the page.
          </p>
          <div className="mx-3 md:container md:mx-auto h-full bg-gray-100 shadow-md p-3 m-2 rounded-lg text-center text-slate-500 font-bold">
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
                                {offenseOpt1
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
                                {offenseOpt1
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
