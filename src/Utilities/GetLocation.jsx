import React, { use } from 'react'
import './GetLocation.css'
import { useRef } from 'react';
import { useState } from 'react';
const GetLocation = () => {
    const btn = useRef();
    const [isloading , setloading]=useState(false);
    function  getuserlocation(){
        setloading(true);
        // 1. Chek kro if the browser supports geolocation
    if ("geolocation" in navigator) {
    // 2. Request the current location
    navigator.geolocation.getCurrentPosition(
        
        async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log("Latitude:", lat);
            console.log("Longitude:", lon);
            try{
                // btn.current.textContent="Loading...";
                // btn.current.disabled =true;
                const response = await fetch(`http://127.0.0.1:8000/Location/${lat}/${lon}`);

                const result = await response.json();

                if(result.status=="success"){
                    console.log("The District is : ", result.district);
                    console.log("The State is : ",result.state);
                    alert("Chek Console!!");
                    
                }else{
                    console.log("data Shi se nhi  aaya ");
                }


            }catch(e){
                console.log("Anything is wrong");
            }finally{
                console.log("Request Done!!");
                // btn.current.textContent = "Get Your Location";
                // btn.current.disabled=false;
                setloading(false);
            }

            
        },
       
        function(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.error("The request to get user location timed out.");
                    break;
            }
        }
    );
    } else  console.error("Geolocation is not supported by this browser.");
            }
  return (
    <div id='maps-container1'>

        {/* <button onClick={getuserlocation} ref={btn}>Get Your Location</button> */}
        <button onClick={getuserlocation} disabled={isloading}>
            {isloading ? "Loading...": "Get Your Location "}
        </button>

    </div>
  )
}

export default GetLocation