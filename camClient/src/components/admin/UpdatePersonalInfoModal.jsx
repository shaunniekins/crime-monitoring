import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { serverUrl } from "../../urlConfig";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@nextui-org/react";

const socket = io.connect(serverUrl);

export default function UpdatePersonalInfoModal({
  selectedOfficer,
  accessToken,
  getUser,
  isOpen,
  onOpen,
  onClose,
}) {
  // CREDENTIAL'S STATE
  const [credentials, setCredentials] = useState({
    id: selectedOfficer.id || "",
    first_name: selectedOfficer.first_name || "",
    last_name: selectedOfficer.last_name || "",
    email: selectedOfficer.email || "",
    phone_number: selectedOfficer.phone_number || "",
    birth_date: selectedOfficer.birth_date || "",
    address: selectedOfficer.address || "",
    activate: selectedOfficer.activate || "",
    role: selectedOfficer.role || "",
    password: "",
  });

  useEffect(() => {
    setCredentials({
      id: selectedOfficer.id,
      first_name: selectedOfficer.first_name,
      last_name: selectedOfficer.last_name,
      email: selectedOfficer.email,
      phone_number: selectedOfficer.phone_number || "",
      birth_date: selectedOfficer.birth_date || "",
      address: selectedOfficer.address || "",
      activate: selectedOfficer.activate,
      role: selectedOfficer.role,
      password: "",
    });
  }, [selectedOfficer]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOfficer.email === "") {
      alert("add");
    } else {
      await axios
        .put(`/user?id=${credentials.id}`, credentials, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log("res", res.data);
          getUser();
          showSuccessMessage(res.data.message);
          socket.emit("send_update", { message: "Hello" });
          setTimeout(() => {
            onClose();
          }, 2000);
        })
        .catch((error) => {
          showErrorMessage(error);
        });
    }
  };

  const [size, setSize] = useState("");

  useEffect(() => {
    const checkSize = () => {
      setSize(window.innerWidth >= 768 ? "" : "full");
    };

    window.addEventListener("resize", checkSize);
    checkSize();

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                UPDATE PERSONAL INFO
              </ModalHeader>
              <Divider />

              <ModalBody className="h-full flex flex-col gap-3 overflow-y-auto">
                <div className="flex flex-col">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Taylorswift@gmail.com"
                    className="border border-neutral-300 p-2 rounded-md"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="Taylor"
                      className="border border-neutral-300 p-2 rounded-md"
                      value={credentials.first_name}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Swift"
                      className="border border-neutral-300 p-2 rounded-md"
                      value={credentials.last_name}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    className="border border-neutral-300 p-2 rounded-md"
                    value={credentials.birth_date}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        birth_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label>Address</label>
                    <input
                      type="text"
                      placeholder="Agusan del Sur"
                      className="border border-neutral-300 p-2 rounded-md"
                      value={credentials.address}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Contact</label>
                    <input
                      type="text"
                      placeholder="+63"
                      className="border border-neutral-300 p-2 rounded-md"
                      value={credentials.phone_number}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label>Password</label>
                    <input
                      type="text"
                      placeholder="Password"
                      className="border border-neutral-300 p-2 rounded-md"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  className="text-white"
                  onClick={handleSubmit}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
