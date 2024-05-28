import React from 'react'

export default function MissingTable({ setShowMissingTable, missingHistory }) {

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
        const dif = (currentTimestamp - date) / (1000 * 60 * 60)
        console.log(dif)
        if (dif >= 24) {
            return 'Validated';
        } else {
            return 'Not validated';
        }
    }
    return (
        <>
            <div className='absolute w-full h-5/6 z-40 flex justify-center items-center'>
                <div className='bg-white p-5 w-5/6 h-5/6 overflow-scroll relative'>
                    <p className='absolute top-3 right-8 text-xl cursor-pointer hover:text-slate-400 duration-200'
                    onClick={(e) => setShowMissingTable(false)}>x</p>
                    <p className='font-mono text-2xl font-bold py-3 text-slate-500'>Reported Missing Person (History)</p>
                    <table className='w-full text-xs'>
                        <thead>
                            <tr className='text-sm'>
                                <th className='p-3'>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Image</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Alias</th>
                                <th>Weight</th>
                                <th>Height</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Last Update</th>
                                <th>Reported Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !missingHistory ? "Loading" :
                                    missingHistory.map(data => (
                                        <tr className='text-center hover:bg-slate-50'>
                                            <td>{data.first_name}</td>
                                            <td>{data.last_name}</td>
                                            <td>{data.middle_name}</td>
                                            <td>
                                                <img src={data.url ? `data:image/jpeg;base64,${data.url}` : 'http://localhost:3000/default.jpg'}
                                                    className="w-20 rounded-md border-2 border-slate-100"
                                                />
                                            </td>
                                            <td>{data.gender}</td>
                                            <td>{data.address}</td>
                                            <td>{data.alias}</td>
                                            <td>{data.weight}</td>
                                            <td>{data.height}</td>
                                            <td>
                                                <span className={hoursDifference(new Date(data.created_at).getTime()) === "Validated" ? 'p-1 bg-emerald-200' : 'bg-red-200 p-1'}>
                                                    {hoursDifference(new Date(data.created_at).getTime()) === "Validated" ? data.status : hoursDifference(new Date(data.created_at).getTime())}
                                                </span>
                                            </td>
                                            <td>{data.remarks}</td>
                                            <td>{getSpecificDate(data.updated_at)}</td>
                                            <td>{getSpecificDate(data.created_at)}</td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>

                </div>

            </div>
            <div className='w-full h-full bg-neutral-600 absolute z-30 opacity-30'>

            </div>
        </>
    )
}
