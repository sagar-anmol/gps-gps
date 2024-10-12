'use client';  // Mark this component as a Client Component

import { useEffect, useState } from 'react';

const GpsCoordinates = () => {
  const [gpsData, setGpsData] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    const eventSource = new EventSource('https://gps-api.modhub.eu.org/gps');  // Ensure this is the correct URL https://192.168.66.198:3001/gps

    eventSource.onmessage = (event) => {
      console.log('Received GPS data:', event.data);  // Debugging line
      try {
        const data = JSON.parse(event.data);
        setGpsData(data);  // Update state with new GPS data
      } catch (err) {
        console.error('Failed to parse GPS data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();  // Clean up the connection when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Live GPS Coordinates</h1>
      {gpsData.latitude && gpsData.longitude ? (
        <p>
          Latitude: {gpsData.latitude}, Longitude: {gpsData.longitude}
        </p>
      ) : (
        <p>Loading GPS data...</p>
      )}
    </div>
  );
};

export default GpsCoordinates;
