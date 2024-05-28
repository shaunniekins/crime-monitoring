import { useGoogleMap } from "@ubilabs/google-maps-react-hooks";
import React, { useEffect, useRef } from "react";

export default function Marker({ selectedCrime, currentLocation, crimes }) {
  const map = useGoogleMap();
  const markerRef = useRef();
  const currentMarkRef = useRef();
  let lat = "";
  let lng = "";
  if (selectedCrime[0]) {
    // lat = selectedCrime[0].latitude;
    // lng = selectedCrime[0].longitude;
    lat = 8.2165
    lng = 126.0458
  }
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

  useEffect(() => {
    if (!map) return console.log("no map");
    currentMarkRef.current = new window.google.maps.Marker({
      map,
      title: "Your current location",
      icon: "http://localhost:3000/currentIcon.svg",
    });
    markerRef.current = new window.google.maps.Marker({
      map,
      icon: "http://localhost:3000/markIcon.svg",
    });
  }, [map]);

  useEffect(() => {
    if (!crimes) return console.log("no crimes");
    if (!markerRef.current) return console.log("no marker");
    // if (isNaN(selectedCrime[0].latitude) || isNaN(selectedCrime[0].longitude))
    //   return;

    // markerRef.current.setPosition({
    //   lat,
    //   lng,
    // });
    crimes.map(crime => {
      let lat = parseFloat(crime.latitude);
      let lng = parseFloat(crime.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        return
      }
      markerRef.current.setPosition({
        lat,
        lng,
      });
      markerRef.current.setIcon({ url: "http://localhost:3000/markIcon.svg" });
      // markerRef.current.setTitle(
      //   selectedCrime
      //     ? `Report No. : ${selectedCrime[0]?.report_number} \n crime : ${selectedCrime[0]?.type_of_crime
      //     } \n Date: ${getSpecificDate(selectedCrime[0]?.created_at)}`
      //     : ""
      // );
    })
    currentMarkRef.current.setPosition({
      lat: 8.5168619,
      lng: 125.9807228,
    });



  }, [lat, lng, selectedCrime, map]);

  return <></>;
}
