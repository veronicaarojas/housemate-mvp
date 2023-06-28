import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";


function ProfileView() {
  const [profile, setProfile] = useState({});
  const { roomieId } = useParams();
  const [promptIsClicked, setPromptIsClicked] = useState(false);
  const [userPrompts, setUserPrompts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);


  const [newUserPrompt, setNewUserPrompt] = useState({
    roomieID: roomieId,
    question: "",
    answer: ""
  }) 


  const [selectedOption1, setSelectedOption1] = useState("");

  const options = [
    {value: "A weird fact I know is...", label: "A weird fact I know is..."},
    {value: "My perfect Sunday:", label: "My Perfect Sunday"},
    {value: "A personal goal of mine is to...", label: "A personal goal of mine is to..."}
  ]

  useEffect(() => {
    loadProfile();
    getUserPrompts();
    getImages();
    

  }, [roomieId]);

  async function loadProfile() {
    try {
      const response = await fetch(`api/roomies/${roomieId}`);
      const data = await response.json();
      // console.log(data)
      setProfile(data);
    } catch(err) {

    }
  }

  function handlePromptClick() {
    setPromptIsClicked(true);
  }

  
  function handleSelectChange(selected) {
    setSelectedOption1(selected);
    const selectedPrompt = selected.value;
    setNewUserPrompt((state) => ({
      ...state,
      question: selectedPrompt
    }))

  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    // const name = event.target.name;

    setNewUserPrompt((state) => ({
      ...state,
      answer: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPrompt(newUserPrompt);
    setPromptIsClicked(false);
    setSelectedOption1("");
    setNewUserPrompt({
      roomieID: roomieId,
      question: "",
      answer: ""
    })
  }

  const submitPrompt = async (newUserPrompt) => {
    try {
      await fetch(`/api/answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserPrompt)
      });
      getUserPrompts();
    } catch (error) {

  }

  }

  const getUserPrompts = async () => {
    try {
      const response = await fetch(`/api/answers/${roomieId}`, {
        method: "GET"
      });
      const data = await response.json();
      setUserPrompts(data);
    } catch(err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    deleteAnswer(id);
  }

  const deleteAnswer = async (id) => {
    try {
      await fetch(`api/answers/${id}`, {
        method: "DELETE"
      });
      getUserPrompts();
    } catch {

    }
  }

  function handleCancel(e) {
    e.preventDefault();
    setPromptIsClicked(false);

  }

  async function getImages() {
    try {
      const res = await axios.get("/api/userimages");
      setImages(res.data);
      // console.log(images);
    } catch (err) {
      console.log(err);
    }
  }

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

   // On file upload (click the upload button)
   const onFileUpload = async () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("imagefile", selectedFile, selectedFile.name);

    
    try {
      // Request made to the backend api
      // Send formData object
      const res = await axios.post("/api/userimages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
 

  return (
    <div>
      <div className="container border rounded">


      {/* <h3>Select file to upload:</h3>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button> */}

      {/* <div> */}
        {/* {images.map((image) => (
          <img className="" src={`/images/${image.path}`} />
        ))}
      </div> */}


        <div className="row">
      <h2>{profile.firstname} {profile.lastname}</h2>
      </div>
      <div className="row">
        <h6><i className="fa-solid fa-location-dot"></i> {profile.locationname}</h6>
        <div className="row">
        <p>{profile.age}, {profile.ocupation}</p>
        <div className="row">
          <p>{profile.bio}</p></div>
      </div>

    <div className="container">
      {userPrompts.length !== 0 && 
      <h5>Get to know {profile.firstname}</h5>}
    </div>
    <div className="container mb-2">
      <div className="row">
      {userPrompts.length !== 0 && 
      userPrompts.map(userPrompt => (
      
        <div className="col-4" key={userPrompt.answerID}>
          <div className="card border-info mb-3">
          <div className="card-header">
            
            <div>{userPrompt.question}</div>
            </div>
           
          <div className="card-body">
            <p>{userPrompt.answer}</p>
            <div className="row">
              <div className="col-9">                
              </div>
              <div className="col">
              <button className="btn" onClick={() => handleDelete(userPrompt.answerID)}><i className="fa-solid fa-x"></i></button>
              </div>
            </div>


          </div>
          </div>
      
        </div>
    
      ))
      }
      </div>
      </div>
     




      <div className="row mb-2">
        <div className="col">
          {!promptIsClicked && 
           <button onClick={handlePromptClick} className="btn btn-primary">Add Prompt</button>}
        </div>
        <div className="row">
          {promptIsClicked && 
          <form onSubmit={handleSubmit}>
          <div className="container border rounded mb-2">
            <div className="col">
            <p>Hey there roomie! Select some prompt questions below and answer them so other potential roomies can get to know you better!</p>
            </div>
            
            <div className="row mb-3">
              
              <div className="col-4">
                <Select
                options={options}
                value={selectedOption1}
                onChange={handleSelectChange}
                />

          
      
              </div>
              <div className="col-5">
              <input 
              placeholder="Type your reponse here..."
              className="form-control"
              name="answer1"
              value={newUserPrompt.answer}
              onChange={(e) => handleInputChange(e)}/>
              </div>
              <div className="col-1">
                <button className="btn btn-dark">Save</button>
              </div>
              <div className="col-1">
                <button
                onClick={handleCancel}
                className="btn btn-dark">Cancel</button>
              </div>
            </div>
            </div>
            </form>}
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}

export default ProfileView;