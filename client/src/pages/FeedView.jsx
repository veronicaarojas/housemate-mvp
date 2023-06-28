import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import Select from "react-select";




function FeedView() {
  const [roomies, setRoomies] = useState([]);
  const [locationSearch, setLocationSearch ] = useState(null);
  const [searchInput, setSearchInput] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);


  
  
  
  useEffect(() => {
    getRoomies();
    onChangeGooglePlaces(locationSearch);
  }, [locationSearch]);

  const getRoomies = async () => {
    try {
      const response = await fetch("/api/roomies", { 
        method: "GET"
      });
      const data = await response.json();
      setRoomies(data);

      
    } catch(error) {
      console.log(error);
    }
   
  };

  const handleDelete = async (id) => {
    deleteRoomie(id);
  };

  const deleteRoomie = async id => {
    try {
       await fetch(`api/roomies/${id}`, {
        method: "DELETE"
      });
      getRoomies();
    } catch(err) {
      console.log(err)
    }
  };

  async function onChangeGooglePlaces(e) {
    // console.log(e);
    if(e) {
    const result = await geocodeByAddress(e.label);
    const locationname = result[0].formatted_address
    const latLng = await getLatLng(result[0]);

    const locationLat = latLng.lat;
    const locationLng = latLng.lng;

    setSearchInput((state) => ({
      ...state,
      latitude: +locationLat,
      longitude: +locationLng,
      locationname: locationname
    }))

      }  }

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRoomies(searchInput);
    setSearchClicked(true);
    // console.log(searchInput);
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
    setSelectedOption(selected)
    const selectedBudget = selected.value;
    setSearchInput((state) => ({
      ...state, 
      maxbudget: selectedBudget
    }))
  }
  
  const searchRoomies = async (searchInput) => {
    // console.log(searchInput)
    try {
      const queryParams = new URLSearchParams(searchInput)
      const response = await fetch(`http://localhost:4001/api/roomies/search?${queryParams}`)
      const data = await response.json();
      setRoomies(data);

    } catch (error) {
      console.log(error)

  }

  };

  const handleClearClick = (e) => {
    e.preventDefault();
    setSearchClicked(false);
    getRoomies();
    setSelectedOption(null);
    setLocationSearch("");

    
    
    setSearchInput({});
    
   
  };
  



  return (
<div>
    
  <div className="container my-2">
  <form onSubmit={handleSubmit}>
    <div className="row">
    <div className="col-2 px-0">
      <Select
      options={options}
      value={selectedOption}
      onChange={handleSelectChange}
      placeholder="Minimum $"/>
    </div>
    
    <div className="col-4 mx-0">
    <PlacesAutocomplete 
    selectProps={{
      value: locationSearch,
      onChange: setLocationSearch,
      placeholder: "Find HouseMates in..."
    }}
    />
    </div>
    <div className="col-1 px-1">
      <button className="btn btn-dark">
        search
      </button>
    </div>
    <div className="col-1 px-0">
      <button onClick={handleClearClick} className="btn btn-dark">clear</button>
    </div>
    </div>
    </form>
  </div>

      
      
    <div className="container">
      {!searchClicked && 
      <h3>Featured HouseMates</h3>
      }


      



      {(roomies.length === 0) && 
      <div>Sorry! No roomies found</div>
      }
      { searchClicked && (roomies.length !== 0) && 
      <div>{roomies.length} roomies found</div>}



      <div className="row">
        {roomies.map(roomie => (
          <div key={roomie.id} className="col-4 gy-3">
          <div className="card gx-0" > 
          <img src="https://picsum.photos/300/190" className="card-img-top " alt="..."></img>
          <div className="card-body">
            <div className="row">
              <div className="col-8">
          <h5 className="card-title"> {roomie.firstname} {roomie.lastname}</h5>
          {/* <div className="row"> */}
          </div>
        
            <h6 className="text-muted"><i className="fa-solid fa-location-dot"></i> {roomie.locationname}</h6>
          {/* </div> */}
  
          </div>
          <div className="row">
            <div className="col">
        

          <p className="card-text">{roomie.age} | <i className="fa-solid fa-briefcase"></i> {roomie.ocupation} {roomie.has_pets === 1 && <i className="fa-solid fa-paw"></i>}  {roomie.smoke  === 1 && 
            <i className="fa-solid fa-smoking"></i>}</p>
          </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
          <div className="text-muted"><i className="fa-solid fa-dollar-sign"></i>{roomie.maxbudget}PM</div>
          </div>
          </div>
          
        
          
          <div className="row">
            <div className="col-8">
            <Link to={`/${roomie.id}`}>
          <button className="btn btn-info">View Profile</button>
            </Link>
          </div>
          <div className="col">
          <button className="btn btn-danger" onClick={() => handleDelete(roomie.id)}><i className="fa-solid fa-trash-can"></i></button>
          </div>
          </div>
          </div>
          </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default FeedView;