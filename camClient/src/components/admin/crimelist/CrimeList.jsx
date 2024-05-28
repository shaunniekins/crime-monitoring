import React, { useState, useEffect } from 'react';
import CrimeForm from './CrimeForm';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

export default function CrimeList({ reportedCrime, handleValidated, setQ }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const handleFilter = () => {
        setIsChecked(!isChecked);
    }

    const handleModal = (action) => {
        setModalOpen(action);
    };
    const showSuccessMessage = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 2000,
        });
    };
    const showErrorMessage = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 2000,
        });
    };
    const handleDelete = async (id) => {
        await axios
            .delete(`/crime/?id=${id}`)
            .then(async (res) => {
                setLoading(false);
                showSuccessMessage("Crime Successfully Deleted.")
                socket.emit('send_report', { message: "Hello" })
            })
            .catch((error) => {
                console.log(error);
                showErrorMessage(
                    error.response.data.error + ". " + error.response.data.message
                );
                setLoading(false);
            });
    }
    useEffect(() => {
        if (isChecked) {
            handleValidated(1)
        } else {
            handleValidated(0)
        }
    }, [])
    return (
        <div className=' bg-white w-full h-full p-5 overflow-x-scroll text-xs'>
            {
                isModalOpen ? <CrimeForm handleModal={handleModal} selected={selected} handleFilter={handleFilter} /> : ""
            }
            <ToastContainer />
            <div className='py-5'>
                <p className='text-xl font-semibold text-slate-600'>Crime List (Not Validated)</p>
            </div>
            {/* <div className='p-2'>
                <p>Filter By:</p>
                <div className='flex gap-4 ps-20'>
                    <p className=''>Validated <input type='checkbox' className='cursor-pointer' onClick={handleFilter} /></p>
                    <input type='search' placeholder='Search (Barangay or Offense)' onChange={(e) => setSearch(e.target.value)} className='w-3/6 p-2 border-2 border-slate-500' />
                    <button className='bg-blue-400 w-40 text-white cursor-pointer rounded-md hover:bg-blue-500' onClick={(e) => setQ(search)}>Search</button>
                </div>
            </div> */}
            <table className='table-auto w-screen overflow-x-scroll'>
                <thead className='bg-blue-50 border-2 border-slate-200 p-2'>
                    <tr className=''>
                        <th className='p-2'>Crime ID</th>
                        <th>Barangay</th>
                        <th>Reported By</th>
                        <th>Type Place</th>
                        <th>Date Reported</th>
                        <th>Time Reported</th>
                        <th>Date Committed</th>
                        <th>Time Committed</th>
                        <th>Stages Felony</th>
                        <th>Offense</th>
                        <th>Case Status</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Validated</th>
                        <th className='p-2'>action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {
                        !reportedCrime ? <>Loading...</> :
                            reportedCrime.map((crime) => (
                                <tr className='border-2 text-center border-slate-100'>
                                    <td className='p-1'>{crime.id}</td>
                                    <td className='p-1'>{crime.barangay}</td>
                                    <td className='p-1'>{crime.last_name + ", " + crime.first_name}</td>
                                    <td className='p-1'>{crime.type_place}</td>
                                    <td className='p-1'>{crime.date_reported}</td>
                                    <td className='p-1'>{crime.time_reported}</td>
                                    <td className='p-1'>{crime.date_committed}</td>
                                    <td className='p-1'>{crime.time_committed}</td>
                                    <td className='p-1'>{crime.stages_felony}</td>
                                    <td className='p-1'>{crime.offense}</td>
                                    <td className='p-1'>{crime.case_status}</td>
                                    <td className='p-1'>{crime.latitude}</td>
                                    <td className='p-1'>{crime.longitude}</td>
                                    <td className='p-1'><span className={`p-1 ${crime.validated ? 'bg-green-200' : 'bg-red-200'}`}>{crime.validated ? 'True': 'False'}</span></td>
                                    <td className='flex flex-col p-1 justify-center items-center'>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-pencil-fill text-emerald-500 cursor-pointer"
                                            viewBox="0 0 16 16"
                                            onClick={(e) => [handleModal(true), setSelected(crime)]}
                                        >
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-trash2-fill text-red-500 cursor-pointer"
                                            viewBox="0 0 16 16"
                                            onClick={(e) => handleDelete(crime.id)}
                                        >
                                            <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z" />
                                        </svg>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>

            </table>
        </div>
    )
}
