import React, { useEffect } from "react";
import { clientUrl } from "../../urlConfig";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";

export default function MissingTable({
  missingHistory,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const currentTimestamp = Date.now();
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

  const hoursDifference = (date) => {
    const dif = (currentTimestamp - date) / (1000 * 60 * 60);
    if (dif >= 24) {
      return "Validated";
    } else {
      return "Not validated";
    }
  };

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "middle_name", label: "Middle Name" },
    { key: "last_name", label: "Last Name" },
    { key: "url", label: "Image" },
    { key: "gender", label: "Gender" },
    { key: "address", label: "Address" },
    { key: "alias", label: "Alias" },
    { key: "weight", label: "Weight" },
    { key: "height", label: "Height" },
    { key: "status", label: "Status" },
    { key: "remarks", label: "Remarks" },
    { key: "updated_at", label: "Last Update" },
    { key: "created_at", label: "Reported Date" },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reported Missing Person (History)
              </ModalHeader>
              <ModalBody className="h-full">
                <Table aria-label="Missing Table" className="h-full">
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key} className="text-center">
                        {column.label}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={missingHistory}
                    emptyContent={"No rows to display."}
                    loadingContent={<Spinner color="secondary" />}>
                    {(item) => (
                      <TableRow key={`item-${item.id}`} className="text-center">
                        {columns.map((columnKey) => {
                          if (columnKey.key === "url") {
                            return (
                              <TableCell key={columnKey.key}>
                                <img
                                  src={
                                    item.url
                                      ? `data:image/jpeg;base64,${item.url}`
                                      : `${clientUrl}/default.jpg`
                                  }
                                  className="w-20 rounded-md border-2 border-slate-100"
                                />
                              </TableCell>
                            );
                          }

                          if (columnKey.key === "status") {
                            return (
                              <TableCell key={columnKey.key}>
                                <span
                                  className={
                                    hoursDifference(
                                      new Date(item.created_at).getTime()
                                    ) === "Validated"
                                      ? "p-1 bg-emerald-200 rounded-lg"
                                      : "bg-red-200 p-1 rounded-lg"
                                  }>
                                  {hoursDifference(
                                    new Date(item.created_at).getTime()
                                  ) === "Validated"
                                    ? item.status
                                    : hoursDifference(
                                        new Date(item.created_at).getTime()
                                      )}
                                </span>
                              </TableCell>
                            );
                          }

                          if (columnKey.key === "remarks") {
                            return (
                              <TableCell key={columnKey.key}>
                                {item.remarks ? item.remarks : "-"}
                              </TableCell>
                            );
                          }

                          if (columnKey.key === "updated_at") {
                            return (
                              <TableCell key={columnKey.key}>
                                {getSpecificDate(item.updated_at)}
                              </TableCell>
                            );
                          }

                          if (columnKey.key === "created_at") {
                            return (
                              <TableCell key={columnKey.key}>
                                {getSpecificDate(item.created_at)}
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={`${item.id}-${columnKey.key}`}>
                              {item[columnKey.key]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
