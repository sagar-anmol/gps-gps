import serial
import json
import time

def get_gps_data():
    # Set up the serial port
    gps = serial.Serial('/dev/serial0', baudrate=9600, timeout=1)

    while True:
        line = gps.readline().decode('ascii', errors='replace')
        if line.startswith('$GPGGA'):  # GPGGA contains the main GPS data
            data = line.split(',')
            if data[2] and data[4]:  # Ensure there's latitude and longitude
                lat = float(data[2])
                lon = float(data[4])

                # Convert latitude and longitude to degrees
                lat_deg = int(lat / 100)
                lat_min = lat - lat_deg * 100
                lon_deg = int(lon / 100)
                lon_min = lon - lon_deg * 100

                # Final coordinates
                latitude = lat_deg + lat_min / 60
                longitude = lon_deg + lon_min / 60

                # Check for south/west coordinates
                if data[3] == 'S':
                    latitude = -latitude
                if data[5] == 'W':
                    longitude = -longitude

                # Send the data as a JSON object
                gps_data = {
                    "latitude": latitude,
                    "longitude": longitude
                }

                # Print JSON data to stdout (Express server will listen to this)
                print(json.dumps(gps_data), flush=True)
                
        time.sleep(0.5)  # Adjust sleep time for faster or slower updates

if __name__ == "__main__":
    get_gps_data()
