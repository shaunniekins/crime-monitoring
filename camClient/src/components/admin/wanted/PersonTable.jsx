import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Button,
} from "@nextui-org/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { clientUrl, serverUrl } from "../../../urlConfig";

const socket = io.connect(serverUrl);

export default function PersonTable({
  personList,
  filter,
  handleModal,
  setSelected,
}) {
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
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await axios
        .delete(`/person?id=${id}`)
        .then((res) => {
          showSuccessMessage(res.data.message);
          socket.emit("send_update", { message: "Hello" });
          handleModal(false);
          setSelected({});
        })
        .catch((error) => {
          showErrorMessage(error);
        });
    }
  };

  const columns = [
    { key: "id", label: "I.D" },
    { key: "first_name", label: "First Name" },
    { key: "middle_name", label: "Middle Name" },
    { key: "last_name", label: "Last Name" },
    { key: "url", label: "Picture" },
    { key: "alias", label: "Alias" },
    { key: "gender", label: "Gender" },
    { key: "last_known_address", label: "Address" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "remarks", label: "Remarks" },
    { key: "created_at", label: "Date Reported" },
    { key: "action", label: "Action" },
  ];

  return (
    <>
      <ToastContainer />

      <Table aria-label="Person-Concern-Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className="text-center">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={personList.length > 0 ? personList[0] : []}
          emptyContent={"No rows to display."}
          loadingContent={<Spinner />}>
          {(item) => (
            <TableRow key={item.id} className="text-center">
              {(columnKey) => {
                if (columnKey === "url") {
                  return (
                    <TableCell className="flex justify-center items-center">
                      <img
                        src={
                          item.url
                            ? `data:image/jpeg;base64,${item.url}`
                            : `${clientUrl}/default.jpg`
                        }
                        alt={item.first_name}
                        className="w-32 rounded-md border-2 border-slate-100"
                      />
                    </TableCell>
                  );
                }

                if (columnKey === "created_at") {
                  return (
                    <TableCell className="text-xs">
                      {getSpecificDate(item[columnKey])}
                    </TableCell>
                  );
                }

                if (columnKey === "action") {
                  return (
                    <TableCell className="h-full">
                      <div className="flex justify-center items-center gap-1">
                        <Button
                          isIconOnly
                          aria-label="Edit"
                          variant="light"
                          onClick={(e) => [
                            handleModal(true),
                            setSelected(item),
                            // console.log(item),
                          ]}>
                          <MdEdit className="text-xl  text-green-700" />
                        </Button>
                        <Button
                          isIconOnly
                          aria-label="Delete"
                          variant="light"
                          onClick={(e) => handleDelete(item.id)}>
                          <MdDelete className="text-xl  text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  );
                }

                return (
                  <TableCell className="text-xs">{item[columnKey]}</TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
