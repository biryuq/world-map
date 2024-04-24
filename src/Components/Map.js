import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { geoOrthographic } from "d3-geo";
import MapLabel from "./MapLabel";

const initialRotation = [-11, -41, 5]; 

const rotatingProjection = (rotation = initialRotation) => {
  const width = 900;
  const height = 450;
  const xOffset = width / 2 - 200; 
  const yOffset = height / 2 - 5; 

  return geoOrthographic()
    .rotate(rotation)
    .translate([xOffset, yOffset])
    .scale(600);
};


const MapChart = () => {
  const [rotation, setRotation] = useState(initialRotation);
 
  const [activeLable, setActiveLable] = useState("");
  const [activeGeo, setActiveGeo] = useState(null);
  
  const resetRotation = () => {
    setRotation(initialRotation);
    setActiveLable("")
  };


  const handleClick = (geo) => {
    console.log("Clicked - Setting tooltip for", geo.properties.name);
    setActiveLable((currentLabel) =>
      currentLabel === geo.properties.name ? "" : geo.properties.name
    );
    setActiveGeo((currentActive) =>
      currentActive === geo.rsmKey ? null : geo.rsmKey
     
    );
    console.log(activeLable);
  };

 

  const handleMouseDown = (event) => {
    event.currentTarget.style.cursor = "grabbing"; 
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.dataset.startX = event.clientX;
    event.currentTarget.dataset.startY = event.clientY;
  };

  const handleMouseMove = (event) => {
    if (event.currentTarget.dataset.dragging === "true") {
      const startX = parseInt(event.currentTarget.dataset.startX, 10);
      const startY = parseInt(event.currentTarget.dataset.startY, 10);
      

    
      setRotation((prevRotation) => {
        const diffX = event.clientX - startX;
        const diffY = event.clientY - startY;

        const newLambda = prevRotation[0] - diffX * -0.1;
        const newPhi = prevRotation[1] + diffY * -0.1;
        const newGamma = prevRotation[2];

        // Log each component of the rotation
        console.log(
          `Rotation - Lambda: ${newLambda}, Phi: ${newPhi}, Gamma: ${newGamma}`
        );

        return [newLambda, newPhi, newGamma];
      });

      event.currentTarget.dataset.startX = event.clientX;
      event.currentTarget.dataset.startY = event.clientY;
    }
  };

  const handleMouseUpOrLeave = (event) => {
    event.currentTarget.style.cursor = "grab"; 
    event.currentTarget.dataset.dragging = "false";
  };

  const handleStart = (event) => {
    const point = event.touches ? event.touches[0] : event;
    event.currentTarget.style.cursor = "grabbing";
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.dataset.startX = point.clientX;
    event.currentTarget.dataset.startY = point.clientY;
  };
  const handleMove = (event) => {
    if (event.currentTarget.dataset.dragging === "true") {
      const point = event.touches ? event.touches[0] : event;
      const startX = parseInt(event.currentTarget.dataset.startX, 10);
      const startY = parseInt(event.currentTarget.dataset.startY, 10);
      const diffX = point.clientX - startX;
      const diffY = point.clientY - startY;

      setRotation((prevRotation) => {
        const newLambda = prevRotation[0] - diffX * -0.1;
        const newPhi = prevRotation[1] + diffY * -0.1;
        const newGamma = prevRotation[2];

        console.log(
          `Rotation - Lambda: ${newLambda}, Phi: ${newPhi}, Gamma: ${newGamma}`
        );

        return [newLambda, newPhi, newGamma];
      });

      event.currentTarget.dataset.startX = point.clientX;
      event.currentTarget.dataset.startY = point.clientY;
    }
  };

  const handleEndOrLeave = (event) => {
    event.currentTarget.style.cursor = "grab"; 
    event.currentTarget.dataset.dragging = "false";
  };

  const colors = {
    lines: "rgba(0, 0, 0, 0.80)", 
    slines: "rgba(2, 132, 199, 0.4)",
    counties: "rgba(210, 216, 232, 0.8)", 
  };

  return (
    <div className="relative">
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEndOrLeave}
        className="h-screen w-full"
      >
        <ComposableMap
          projection={rotatingProjection(rotation)}
          className="w-full h-full bg-[#E5EEFB]"
        >
          <Sphere stroke={colors.lines} strokeWidth={2} />
          <Graticule stroke={colors.slines} strokeWidth={0.5} />
          <Geographies geography="./countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(geo)}
                  onMouseLeave={() => {}}
                  strokeLinejoin="round"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      fill: activeGeo === geo.rsmKey ? "#06b6d4" : colors.counties,
                      outline: "none",
                      stroke: colors.lines,
                    },
                    hover: {
                      fill: "#FACC15",
                      outline: "none",
                      strokeWidth: "2",
                      strokeLinejoin: "round",
                    },
                    pressed: {
                      outline: "none",
                      fill: "#06b6d4",
                    },
                  }}
                />
              ))
            }
          </Geographies>

       
        </ComposableMap>
      </div>
      <div className="absolute bottom-2 left-2 w-full p-2 ">
        <MapLabel data={activeLable} />
      </div>
      <div className="absolute top-2 left-2">
   <button className=" px-2 py-2 rounded-md bg-[#E5EEFB] hover:bg-blue-400  shadow  hover:text-blue-700"
   onClick={resetRotation}><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={24}><title/><path d="M21.91,4.09a1,1,0,0,0-1.07.16L19.48,5.46A9.81,9.81,0,0,0,12,2a10,10,0,1,0,9.42,13.33,1,1,0,0,0-1.89-.66A8,8,0,1,1,12,4a7.86,7.86,0,0,1,6,2.78L16.34,8.25a1,1,0,0,0-.27,1.11A1,1,0,0,0,17,10h4.5a1,1,0,0,0,1-1V5A1,1,0,0,0,21.91,4.09Z" fill="black"/></svg></button>
   </div>
    </div>
  );
};

export default MapChart;
