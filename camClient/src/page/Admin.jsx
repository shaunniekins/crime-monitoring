import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import AdminHeader from "../components/admin/AdminHeader";
import { useNavigate } from "react-router-dom";
import ReportTracker from "../components/admin/crime/ReportTracker";
import Officer from "../components/admin/officer/Officer";
import PersonOfConcern from "../components/admin/wanted/PersonOfConcern";
import Sidebar from "../components/admin/Sidebar";
import Upload from "../components/admin/upload/Upload";
import CrimeList from "../components/admin/crimelist/CrimeList";
import io from "socket.io-client";
import Crimes from "../components/admin/crime/Crimes";
import CrimeIndex from "../components/admin/crime/CrimeIndex";
import FirstPage from "../components/admin/crime/FirstPage";
import { FiMenu } from "react-icons/fi";
import { serverUrl } from "../urlConfig";
const socket = io.connect(serverUrl);

export default function Admin() {
  const cookies = new Cookies({ path: "/" });
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState({});
  const [activePage, setActivePage] = useState("");
  const [crimes, setCrimes] = useState("");
  const [totalCasesPerBrgy, setTotalCasesPerBrgy] = useState({});
  const [totalCasesPerYear, setTotalCasesPerYear] = useState({});
  const [caseStatus, setCaseStatus] = useState({});
  const [casePerYear, setCasePerYear] = useState({});
  const [reportedCrime, setReportedCrime] = useState([]);
  const [validated, setValidated] = useState(0);
  const [q, setQ] = useState("");
  const [showTooltip, setTooltip] = useState(false);

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

  const handleValidated = (value) => {
    setValidated(value);
  };

  const getReportedCrime = async () => {
    axios
      .get(`/crime/reportedCrime?validated=${validated}&q=${q}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setReportedCrime(res.data.data);
      });
  };

  const countCases = async () => {
    await axios
      .get(`/crime/countCases`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setTotalCasesPerBrgy(res.data.data);
      });
  };

  const countCasesPerYear = async () => {
    await axios
      .get(`/crime/countPerYear`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setTotalCasesPerYear(res.data.data);
      });
  };

  const getCaseStatus = async () => {
    await axios
      .get(`/crime/caseStatus`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCaseStatus(res.data.data);
      });
  };

  const getCaseStatusPerYear = async () => {
    await axios
      .get(`/crime/caseStatusPerYear`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCasePerYear(res.data.data);
      });
  };

  socket.on("crime_reported", (socket) => {
    getCrimes();
  });

  // WEB SOCKET
  useEffect(() => {
    getCrimes();
    countCases();
    countCasesPerYear();
    getCaseStatus();
    getCaseStatusPerYear();
  }, []);

  // handle FUNCTIONS
  const handleActivePage = (page) => {
    setActivePage(page);
  };
  socket.on("receive_report", (message) => {
    getReportedCrime();
  });

  // SET USER / LOGGED IN
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
          if (res.data.data[0].role === "user") return navigate("/");
          setUser(res.data.data[0]);
        });
      setAccessToken(token.data);
    }
  };

  useEffect(() => {
    getUser();
    getReportedCrime();
  }, []);

  useEffect(() => {
    getReportedCrime();
  }, [validated, q]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activePage]);

  return (
    <main
      className={`${
        isSidebarOpen ? "max-h-[100svh] " : "min-h-[100svh]"
      } md:min-h-[100svh] flex flex-col max-w-screen bg-slate-200 overflow-hidden`}>
      <AdminHeader
        user={user}
        setUser={setUser}
        getUser={getUser}
        activePage={activePage}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
      />
      <FiMenu
        className="block md:hidden text-2xl cursor-pointer mx-3 mt-3"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex w-full h-full">
        <div
          className={`${
            isSidebarOpen
              ? "block absolute top-0 left-0 z-50 w-full overflow-hidden"
              : "hidden"
          } md:flex`}>
          <Sidebar
            user={user}
            handleActivePage={handleActivePage}
            activePage={activePage}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
        <div className="w-full h-full">
          {!accessToken ? (
            <p className="mx-3 md:container md:mx-auto bg-red-200 shadow-md p-2 my-2 rounded-lg text-center text-slate-500 font-bold">
              Please login to access this page.
            </p>
          ) : (
            <div
              className={`${
                isSidebarOpen ? "overflow-hidden" : ""
              } flex w-full h-full p-3`}>
              {activePage === "Overview" ? (
                <ReportTracker
                  showTooltip={showTooltip}
                  setTooltip={setTooltip}
                  caseStatus={caseStatus}
                  totalCasesPerBrgy={totalCasesPerBrgy}
                  crimes={crimes}
                  accessToken={accessToken}
                />
              ) : activePage === "officer" ? (
                <Officer accessToken={accessToken} user={user} />
              ) : activePage === "person of concern" ? (
                <PersonOfConcern accessToken={accessToken} />
              ) : activePage === "upload" ? (
                <Upload user={user} />
              ) : activePage === "crimes" ? (
                <Crimes accessToken={accessToken} />
              ) : activePage === "crime index" ? (
                <CrimeIndex accessToken={accessToken} />
              ) : activePage === "Crime List" ? (
                <CrimeList
                  reportedCrime={reportedCrime}
                  handleValidated={handleValidated}
                  handleActivePage={handleActivePage}
                  setQ={setQ}
                />
              ) : (
                <FirstPage
                  showTooltip={showTooltip}
                  setTooltip={setTooltip}
                  casePerYear={casePerYear}
                  caseStatus={caseStatus}
                  totalCasesPerBrgy={totalCasesPerBrgy}
                  totalCasesPerYear={totalCasesPerYear}
                  crimes={crimes}
                  accessToken={accessToken}
                  activePage={activePage}
                  reportedCrime={reportedCrime}
                  handleActivePage={handleActivePage}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
