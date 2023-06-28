import React from "react";
import { useState, useEffect } from "react";
// import LocationSearch from "../components/LocationSearch";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import Select from "react-select";

function AdminView() {
  const[userInput, setUserInput] = useState({
    firstname: "",
    lastname: "",
    bio:"",
    age: "",
    ocupation:"",
    locationname: "",
    latitude: "",
    longitude: "",
    maxbudget:"",
    smoke: 0,
    has_pets: 0,
  });
  const [userLocation, setUserLocation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
 
  useEffect(() => {
    onChangeGooglePlaces(userLocation);
  }, [userLocation]);

  async function onChangeGooglePlaces(e) {
    // console.log(e);
    if(e) {
    const result = await geocodeByAddress(e.label);
    const latLng = await getLatLng(result[0]);

    // console.log(result[0].geometry.location.lng)
    // console.log(result[0].geometry.location.lat);
    // console.log(result[0].geometry.location)
    // console.log(result)
    const locationName = result[0].formatted_address;
    const locationLat = latLng.lat;
    const locationLng = latLng.lng;
    // console.log(locationLat,locationLng)


    // console.log(locationName);

   setUserInput((state) => ({
    ...state,
    locationname: locationName,
    latitude: locationLat,
    longitude: locationLng
   }))
  }

  }
  

  
  



  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setUserInput((state) => ({
      ...state, //returns all the properties of the object and one of the properties overidden 
      [name]: value,
    }));
  }

  

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(userInput);
    // console.log(userInput);
    setUserLocation("");
    setSelectedOption("");
    setIsSmoker(false);
    setHasPets(false);


    setUserInput({
      firstname:"",
      lastname:"",
      bio:"",
      age: "",
      ocupation: "",
      locationname: "",
    latitude: "",
    longitude: "",
    maxbudget:"",
    smoke: 0,
    has_pets: 0,
    })

  }

  const addUser = async (userInput) => {
    try {
      await fetch("/api/roomies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput)
      });
    } catch (error) {

  }
  }

  const options = [ 
    {value: 100, label: "$100 PM"},
    {value: 200, label: "$200 PM"},
    {value: 300, label: "$300 PM"},
    {value: 400, label: "$400 PM"},
    {value: 500, label: "$500 PM"},
    {value: 600, label: "$600 PM"},
    {value: 700, label: "$700 PM"},
    {value: 800, label: "$800 PM"},
    {value: 900, label: "$900 PM"},
    {value: 1000, label: "$1000 PM"},
];

  function handleSelectChange(selected) {
    setSelectedOption(selected);
    const selectedBudget = selected.value;
    setUserInput((state) => ({
      ...state, 
      maxbudget: selectedBudget
    }))
  }

  const [ isSmoker, setIsSmoker] = useState(false);
  const [hasPets, setHasPets] = useState(false);

  function handleSmokerChange(e) {
    const checked = e.target.checked;
    setIsSmoker(checked);

    setUserInput((state) => ({
      ...state,
      smoke: checked ? 1 : 0
    }));
  }

  function handlePetsChange(e) {
    const checked = e.target.checked;
    setHasPets(checked);
  

    setUserInput((state) => ({
      ...state,
      has_pets: checked ? 1 : 0
    }));
  }

  

  return(
    <div> 
      <h2></h2>
<div className="container border rounded p-3">
  <h3>Welcome to HouseMate. To create a profile, fill out the form below.</h3>
      <form onSubmit={handleSubmit}>
     <div className="row py-3">
      <div className="col-3">
        <input
        className="form-control"
        placeholder="firstname"
        name="firstname"
        value={userInput.firstname}
        onChange={(e) => handleInputChange(e)}
        />
        </div>
        <div className="col-3">
        <input
        className="form-control"
        placeholder="lastname"
        name="lastname"
        value={userInput.lastname}
        onChange={(e) => handleInputChange(e)}
        />
        </div>
        </div>
        <div className="row pb-3">
          <div className="col-12">
          <textarea
          className="form-control"
          placeholder="add a short bio..."
          name="bio"
          value={userInput.bio}
          onChange={(e) => handleInputChange(e)}
          />
        </div>
        </div>

        <div className="row pb-3">
          <div className="col">
          <input
        className="form-control"
        placeholder="age"
        name="age"
        value={userInput.age}
        onChange={(e) => handleInputChange(e)}
        />
          </div>
          <div className="col">
          <input
        className="form-control"
        placeholder="ocupation"
        name="ocupation"
        value={userInput.ocupation}
        onChange={(e) => handleInputChange(e)}
        />
          </div>
        </div>

        <div className="row pb-3">

        
        <PlacesAutocomplete
        selectProps={{
          value: userLocation,
          onChange: setUserLocation,
          placeholder: "Where would you like to go?"
        }}
        />
        </div>

        <div className="row mb-3">
          <Select
          options={options}
          value={selectedOption}
          onChange={handleSelectChange}
          placeholder="Tell us your maxiumum budget..."/>
        </div>
        
        <div className="row">
          <p>Some extra info...</p>
          <label>
            Are you a smoker?
          <input type="checkbox"
          checked={isSmoker}
          onChange={handleSmokerChange}/>
          </label>
          <label>
            Do you have any pets?
            <input type="checkbox"
            checked={hasPets}
            onChange={handlePetsChange} />
          </label>
        </div>

        <button className="btn btn-primary">Create Profile</button>

  
      </form>
      </div>

    </div>

  )
}

export default AdminView;