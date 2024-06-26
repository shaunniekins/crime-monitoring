import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function OfficerTable({
  officerList,
  setSelectedOfficer,
  handleModal,
  accessToken,
  getUser,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [currentId, setCurrentId] = useState(null);

  const columns = [
    { key: "id", label: "I.D" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "phone_number", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "url", label: "I.D Picture" },
    { key: "role", label: "Role" },
    { key: "activate", label: "Activate" },
    { key: "action", label: "Action" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentId(null);
    }
  }, [isOpen]);

  const deleteUser = async (id) => {
    await axios
      .delete(`/user?id=${id}`)
      .then((res) => {
        getUser();
        alert("User deleted successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">ID</ModalHeader>
              <ModalBody>
                <img
                  src={`data:image/jpeg;base64,${currentId}`}
                  alt="Full Size"
                  className="w-full"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table aria-label="User Lists">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className="text-center">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={officerList}
          emptyContent={"No rows to display."}
          loadingContent={<Spinner />}>
          {(item) => (
            <TableRow key={item.id} className="text-center">
              {(columnKey) => {
                if (columnKey === "url") {
                  return (
                    <TableCell className="flex justify-center items-center">
                      <img
                        className="w-20 cursor-pointer"
                        src={`data:image/jpeg;base64,${item[columnKey]}`}
                        alt="ID"
                        onClick={() => {
                          setCurrentId(item[columnKey]);
                          onOpen();
                        }}
                      />
                    </TableCell>
                  );
                }

                if (columnKey === "activate") {
                  return (
                    <TableCell className="text-xs">
                      {item[columnKey] === 0 ? "False" : "True"}
                    </TableCell>
                  );
                }

                if (columnKey === "action") {
                  return (
                    <TableCell className="h-full">
                      <div className="flex justify-center items-center text-xl gap-3">
                        <Button
                          isIconOnly
                          color="success"
                          onClick={() => {
                            setSelectedOfficer(item);
                            handleModal(true);
                          }}>
                          <MdEdit className="text-white" />
                        </Button>
                        <Button
                          isIconOnly
                          color="danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?"
                              )
                            ) {
                              deleteUser(item.id);
                            }
                          }}>
                          <MdDelete />
                        </Button>
                      </div>
                    </TableCell>
                  );
                }

                return (
                  <TableCell className="text-xs text-center">
                    {item[columnKey]}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
