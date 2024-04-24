import React from "react";
import countriesData from "../countriesdata.json";

function MapLabel(props) {
  const countryName = props.data; 

  
  const country = countriesData.data.find((c) => c.name === countryName);

  if (country) {
    return (
        <div className="flex flex-col items-start bg-blue-50/90 rounded-xl  w-full md:w-96 p-4 ">
        <div className="flex items-center gap-2 ">
          <div className="w-8 rounded-xl items-center flex">
            <img src={country.href.flag} alt={`Flag of ${country.name}`} />
          </div>
          
          <h1 className="md:text-3xl text-xl font-bold text-left">{props.data}</h1>
        </div>

       <div className="md:text-base text-xs text-left "> {country.full_name}</div>
        
        <div className="md:text-xl text-md font-bold py-2 ">
        <p className="md:text-base text-sm text-left font-normal text-gray-700">Capital </p>
        {country.capital}
        </div>
        <div className="md:text-xl text-md font-bold py-2 ">
        <p className="md:text-base text-sm font-normal text-gray-700">Population </p>
        {country.population}
        </div>
        <div className="md:text-xl text-md font-bold py-2 ">
        <p className="md:text-base text-sm  font-normal text-gray-700">Size </p>
        {country.size}
        </div>
        <div className="flex justify-between w-full ">
         <p className="md:text-sm text-xs text-left  font-normal text-gray-500">data src restfulcountries.com  </p>
         <p className="md:text-sm text-xs  font-normal text-gray-400"> | </p>
         <p className="md:text-sm text-xs  font-normal text-gray-500">date 24 Apr 2024</p>
         </div>
        
      
      </div>
    );
  } else {
    return   <div className="flex flex-col items-start bg-blue-50/90 rounded-xl  w-full md:w-96 p-4 ">
         <h1 className="text-3xl font-bold text-left pb-8 ">Explore the globe! </h1>
         <p className="text-xl text-left  font-medium text-blue-950">Spin and tap any spot that catches your eye! </p>
        
    </div>;
  }
}

export default MapLabel;
