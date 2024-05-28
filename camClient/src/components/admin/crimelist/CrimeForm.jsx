import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
    regions,
    provinces,
    cities,
    barangays,
    regionByCode,
    provincesByCode,
    provinceByName,
} from "select-philippines-address";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");


export default function CrimeForm({ selected, handleModal, handleFilter }) {
    const [details, setDetails] = useState(selected);
    const [loading, setLoading] = useState(false);

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

    // SELECT OPTIONS
    const validated = [
        {label: "True", value: 1},
        {label: "False", value: 0}
    ]
    const crimeTypeOpt = [
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
            label:
                "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
            value:
                "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
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
            label:
                "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
            value:
                "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
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

    const placeOpt = [
        { label: "Residential (house/condo)", value: "Residential (house/condo)" },
        {
            label: "Construction/Industrial Barracks",
            value: "Construction/Industrial Barracks",
        },
        {
            label: "Onboard a vehicle (riding in/on)",
            value: "Onboard a vehicle (riding in/on)",
        },
        { label: "Along the street", value: "Along the street" },
        { label: "Farm/Ricefield", value: "Farm/Ricefield" },
        {
            label: "Commercial/Business Establishment",
            value: "Commercial/Business Establishment",
        },
        { label: "River/Lake", value: "River/Lake" },
        {
            label: "Vacant Lot (unused/unoccupied open area)",
            value: "Vacant Lot (unused/unoccupied open area)",
        },
        {
            label: "Recreational Place (resorts/parks)",
            value: "Recreational Place (resorts/parks)",
        },
        {
            label: "Government Office/Establishment",
            value: "Government Office/Establishment",
        },
        {
            label: "School (Grade/High School/College/University)",
            value: "School (Grade/High School/College/University)",
        },
        { label: "Hospital (Gov't/Private)", value: "Hospital (Gov't/Private)" },
        {
            label: "Religious Place (church/mosque)",
            value: "Religious Place (church/mosque)",
        },
        {
            label: "Abandoned Structure (house, bldg, apartment/cond)",
            value: "Abandoned Structure (house, bldg, apartment/cond)",
        },
        {
            label: "Parking Area (vacant lot, in bldg/structure, open parking)",
            value: "Parking Area (vacant lot, in bldg/structure, open parking)",
        },
        { label: "Forest (Gubat)", value: "Forest (Gubat)" },
    ];

    const felonyOpt = [
        { label: "CONSUMMATED", value: "CONSUMMATED" },
        { label: "ATTEMPTED", value: "ATTEMPTED" },
        { label: "FRUSTRATED", value: "FRUSTRATED" },
    ];

    const statusOpt = [
        { label: "Solved", value: "Solved" },
        { label: "Cleared", value: "Cleared" },
        { label: "Under Investigation", value: "Under Investigation" },
    ];
    const regionOpt = [];
    let provinceOpt = [];
    let cityOpt = [];
    let barangayOpt = [
        {
            label: "Consuelo",
            value: "Consuelo"
        }, {
            label: "San Teodoro",
            value: "San Teodoro"
        }, {
            label: "Bunawan Brook",
            value: "Bunawan Brook"
        }, {
            label: "Libertad",
            value: "Libertad"
        }, {
            label: "San Andres",
            value: "San Andres"
        }, {
            label: "Imelda",
            value: "Imelda"
        }, {
            label: "Poblacion",
            value: "Poblacion"
        }, {
            label: "Mambalili",
            value: "Mambalili"
        }, {
            label: "Nueva Era",
            value: "Nueva Era"
        }, {
            label: "San Marcos",
            value: "San Marcos"
        }
    ];

    // HANDLE SUBMIT

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!details.offense) return showErrorMessage("Please select offense.")
        if (!details.barangay) return showErrorMessage("Please select barangay.")
        if (details.validated === "") return showErrorMessage("Please select validated.")
        console.log(details)
        await axios
          .put(`/crime/?id=${details.id}`, details)
          .then(async (res) => {
            setLoading(false);
            showSuccessMessage("Crime Successfully Updated.")
            socket.emit('send_report', { message: "Hello" })
            handleModal(false);
          })
          .catch((error) => {
            console.log(error);
            showErrorMessage(
              error.response.data.error + ". " + error.response.data.message
            );
            setLoading(false);
          });
    };

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setDetails({
                            ...details,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error('Error getting location:', error.message);
                    }
                );
            } else {
                console.error('Geolocation is not supported by your browser');
            }
        };

        getLocation();
    }, []); // Empty dependency array to ensure useEffect runs only once on mount


    return (
        <>
            <div className="w-full absolute top-20 left-0 justify-center items-start flex gap-2 z-50">
                <ToastContainer />
                <form className="w-full sm:w-5/6 my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 rounded-lg flex flex-col w-full bg-white">
                        {/*header*/}
                        <p className="px-5 pt-5 font-serif font-bold text-2xl">
                            UPDATE CRIME
                        </p>
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"></button>
                        </div>
                        {/*body*/}

                        <div className="relative w-full flex flex-col gap-2 p-6 flex-auto">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="">Offense</label>
                                <Select
                                    options={crimeTypeOpt}
                                    defaultValue={{label: details.offense, value: details.offense}}
                                    onChange={(e) => setDetails({ ...details, offense: e.value })} />
                            </div>
                            <div>Address:</div>
                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                {/* First Row */}
                                <div className="flex sm:w-3/6 gap-2">
                                    <div className="flex w-3/6 flex-col">
                                        <label className="ps-2">Region</label>
                                        <Select
                                            defaultValue={{ label: details.region, value: details.region }}
                                        />
                                    </div>
                                    <div className="flex w-3/6 flex-col">
                                        <label className="ps-2">Provinces</label>
                                        <Select
                                            defaultValue={{ label: details.province, value: details.province }}
                                        />
                                    </div>
                                </div>
                                {/* Second Row */}
                                <div className="flex gap-2 sm:w-3/6">
                                    <div className="flex w-3/6 flex-col">
                                        <label className="ps-2">City</label>
                                        <Select
                                            defaultValue={{ label: details.city, value: details.city }}
                                        />
                                    </div>
                                    <div className="flex w-3/6 flex-col">
                                        <label className="ps-2">Barangay</label>
                                        <Select
                                            options={barangayOpt}
                                            defaultValue={{label: details.barangay, value: details.barangay}}
                                            onChange={(e) =>
                                                setDetails({ ...details, barangay: e.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="">Place Type</label>
                                <Select
                                    options={placeOpt}
                                    defaultValue={{label: details.type_place, value: details.type_place}}
                                    onChange={(e) =>
                                        setDetails({ ...details, type_place: e.value })
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-full">
                                    <label htmlFor="">Stages Felony</label>
                                    <Select
                                        options={felonyOpt}
                                        defaultValue={{label: details.stages_felony, value: details.stages_felony}}
                                        onChange={(e) =>
                                            setDetails({ ...details, stages_felony: e.value })
                                        }
                                    />
                                </div>

                            </div>
                            <div className="flex gap-2">
                                <div className="flex justify-between gap-2 items-center w-3/6">
                                    <label htmlFor="">Date Reported</label>
                                    <input
                                        type="date"
                                        className="w-4/6 border-2 border-neutral-300 p-2 rounded-md"
                                        value={details.date_reported}
                                        onChange={(e) =>
                                            setDetails({ ...details, date_reported: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex justify-between gap-2 items-center w-3/6">
                                    <label htmlFor="">Time Reported</label>
                                    <input
                                        type="time"
                                        className="w-4/6 border-2 border-neutral-300 p-2 rounded-md"
                                        value={details.time_reported}
                                        onChange={(e) =>
                                            setDetails({ ...details, time_reported: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex justify-between gap-2 items-center w-3/6">
                                    <label htmlFor="">Date Committed</label>
                                    <input
                                        type="date"
                                        className="w-4/6 border-2 border-neutral-300 p-2 rounded-md"
                                        value={details.date_committed}
                                        onChange={(e) =>
                                            setDetails({ ...details, date_committed: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex justify-between gap-2 items-center w-3/6">
                                    <label htmlFor="">Time Committed</label>
                                    <input
                                        type="time"
                                        className="w-4/6 border-2 border-neutral-300 p-2 rounded-md"
                                        value={details.time_committed}
                                        onChange={(e) =>
                                            setDetails({ ...details, time_committed: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="">Validated</label>
                                <Select
                                    options={validated}
                                    onChange={(e) => setDetails({ ...details, validated: e.value })} />
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => handleModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-emerald-500 w-2/6 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleSubmit}
                            >
                                UPDATE
                            </button>

                        </div>
                    </div>
                </form>

            </div>
            <div className="absolute w-screen h-full bg-black opacity-20 z-40 top-20 left-0"></div>
        </>

    );
}
