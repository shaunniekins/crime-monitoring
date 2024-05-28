import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';


export default function Gmap({ crimes, currentLocation }) {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const currentPosition = {
        lat: 8.222376,
        lng: 125.990180,
    };

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

    return (
        <APIProvider apiKey={apiKey}>
            <p className='p-4 text-xl font-bold text-slate-500'>Crimes Visualization</p>
            <div className='w-full h-screen bg-red-500'>
                <Map center={currentPosition} zoom={15} mapId={"73ea4a8d7bc51562"}>
                    <Marker position={currentPosition} title={"YOUR CURRENT LOCATION"} />
                    {crimes.map((crime) => (
                        crime.latitude === null || crime.longitude === null ? <div key={crime.id}></div> :
                            <Marker
                                key={crime.id}
                                position={{ lat: crime.latitude, lng: crime.longitude }}
                                title={`Offense: ${crime.offense}`} />
                    ))

                    }
                </Map>
            </div>
        </APIProvider>
    )
}
