import logo from "../../../src/logo.svg";
import "./home.css";
import React, { useState } from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useContext } from "react";
import Checkbox from "@mui/material/Checkbox";
import {UserContext} from "../state/context-user";

//<Icon icon="medical-icon:i-pharmacy" />
//<Icon icon="mdi:pill" />

export const Home = () => {
  const {myMeds, myUser} = useContext(UserContext);
  const [user, setUser] = myUser;
  const [signedIn, setSignedIn] = useState(false);


  const signIn = (params) => {
    setUser(params);
    console.log(user.name)
    setSignedIn(true);
  }



  return (
    <div className="App">
      <h1>WELCOME TO YOUR PATIENT PORTAL</h1>
      <MedicalServicesIcon sx={{ fontSize: 80 }}></MedicalServicesIcon>
      { Object.keys(user).length === 0 ? <LogIn signIn={signIn}/>
     : <div><h2>Welcome, {user.name}!</h2><h4>You can access your patient portal by going to PORTAL in the menu.</h4></div> }
    </div>
  );
};

const LogIn = (props) => {

  useEffect(() => {
    fetch(`https://rxnav.nlm.nih.gov/REST/Prescribe/displaynames.json`)
      .then((response) => response.json())
      .then((data) => {
        setMedications(data.displayTermsList.term);
      });
  });

  const [showResults, setShowResults] = useState(false);
  
  const [medications, setMedications] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState();
  const [currMedications, setCurrMedications] = useState([]);

  const configureUser = () => {
    let user = {};
    if(currMedications !== null){
      user = {
        name: firstName + " " + lastName,
        dob: dob,
        currMedications: currMedications
      }
    }
    else{
      user = {
        name: firstName + " " + lastName,
        dob: dob,
      }
    }
    

    props.signIn(user);
  }

  return (
    <div>
      
      <h3>SIGN IN TO YOUR PORTAL</h3>
      <Card variant="outlined" sx={{ width: "75%", margin: "auto" }}>
        <Grid container spacing={2} sx={{ width: "75%", margin: "auto" }}>
          <Grid item xs={3}>
            <h3>First Name:</h3>
          </Grid>
          <Grid item xs={3}>
            <TextField id="standard-basic" label="John" variant="standard" onChange={(event) => setFirstName(event.target.value)}/>
          </Grid>
          <Grid item xs={3}>
            <h3>Last Name:</h3>
          </Grid>
          <Grid item xs={3}>
            <TextField id="standard-basic" label="Doe" variant="standard" onChange={(event) => setLastName(event.target.value)}/>
          </Grid>
          <Grid item xs={3}>
            <h3>Date of Birth:</h3>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={dob}
                onChange={(newDate) => {
                  setDOB(newDate);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          {/* <Grid item xs={3}>
            <h3>Allergies:</h3>
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              multiple
              disablePortal
              id="allergies-select"
              options={medications}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Allergies" />
              )}
            />
          </Grid> */}
          <Grid item xs={3}>
            <h3>Are you on any medication?</h3>
          </Grid>
          <Grid item xs={3}>
            <Checkbox onChange={() => setShowResults(!showResults)}></Checkbox>
          </Grid>
          { showResults ? <div>
    <Grid item xs={3}>
      <h3>Select medications:</h3>
    </Grid>
    <Grid item xs={3}>
      <Autocomplete
        multiple
        disablePortal
        id="medications-select"
        options={medications}
        sx={{ width: 200 }}
        renderInput={(params) => (
          <TextField {...params} label="Select medication" />
        )}
        onChange={(event, value) => setCurrMedications(value)}
      />
    </Grid></div> : null }
        </Grid>

        <Button
          variant="outlined"
          onClick={() => {configureUser()}}
          sx={{ color: "black", border: "1px solid black" }}
        >
          Sign in
        </Button>
        
      </Card>
    </div>
  )
}

