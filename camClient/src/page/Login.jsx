import { useState } from "react";
import axios from "axios";
import LoadingButton from "../components/LoadingButton";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies({ path: "/" });
  const navigate = useNavigate();

  // TOAST FUNCTION
  const showErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };

  // handle change functions

  const handleEmail = (e) => {
    setCredential({ ...credential, email: e.target.value });
  };
  const handlePassword = (e) => {
    setCredential({ ...credential, password: e.target.value });
  };

  // Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credential.email) return showErrorMessage("Email is required");
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(credential.email))
      return showErrorMessage("Invalid email format.");

    setLoading(true);
    
    await axios
      .post("/api/auth", credential)
      .then((res) => {
        cookies.set("user", res.data);
        console.log(res);
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        showErrorMessage(
          error.response.data.error + ". " + error.response.data.message
        );
        setLoading(false);
        // navigate("/");
      });
  };

  return (
    <section className="h-screen">
      <ToastContainer />
      <div className="h-full px-5">
        {/* <!-- Left column container with background--> */}
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Writing on notepad with pen and cup of coffee"
            />
          </div>

          {/* <!-- Right column container --> */}
          <div className="mb-12 w-full md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form>
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold dark:text-white">
                  SIGN IN
                </p>
              </div>

              {/* <!-- Email input --> */}
              <div className="relative mb-6" data-te-input-wrapper-init>
                <input
                  type="email"
                  className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200"
                  onChange={handleEmail}
                />
                <label
                  className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 
                  transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem]
                  peer-focus:scale-[0.8] peer-focus:bg-white peer-focus:px-2 peer-focus:text-gray-500 motion-reduce:transition-none
                  ${
                    credential.email === ""
                      ? ""
                      : "-translate-y-[1.15rem] scale-[0.8] bg-white px-2"
                  }`}
                >
                  Email address
                </label>
              </div>

              {/* <!-- Password input --> */}
              <div className="relative mb-6" data-te-input-wrapper-init>
                <input
                  type="password"
                  className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 motion-reduce:transition-none"
                  onChange={handlePassword}
                />
                <label
                  className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] 
                  truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 
                  ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8]  peer-focus:bg-white peer-focus:px-2
                  peer-focus:text-gray-500 motion-reduce:transition-none
                  ${
                    credential.password === ""
                      ? ""
                      : "-translate-y-[1.15rem] scale-[0.8] bg-white px-2"
                  }`}
                >
                  Password
                </label>
              </div>

              {/* <!-- Login button --> */}
              <div className="text-center lg:text-left">
                {/* <!-- Register link --> */}
                <LoadingButton
                  isLoading={loading}
                  text="LOGIN"
                  onClick={handleSubmit}
                  size="w-full"
                />
                <p className="mb-0 mt-2 pt-1 text-sm">
                  {"Don't"} have account yet?
                  <a
                    href="/signUp"
                    className="text-danger ps-2 font-semibold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 hover:underline"
                  >
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
