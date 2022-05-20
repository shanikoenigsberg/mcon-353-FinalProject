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
  const {user, setUser} = useContext(UserContext);
  const [signedIn, setSignedIn] = useState(false);


  useEffect(() => {
    

      //<h4 id={show} sx={{display: 'none'}}>Welcome, {userName}!</h4>
      //pass props
  });

  const signIn = () => {
    

  }



  return (
    <div className="App">
      <h1>WELCOME TO YOUR PATIENT PORTAL</h1>
      <MedicalServicesIcon sx={{ fontSize: 80 }}></MedicalServicesIcon>
      { signedIn ? <div><h4>Welcome, {user.name}</h4></div>
     : <LogIn /> }
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

      
      //pass props
  });

  const [open, setOpen] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [currMedications, setCurrMedications] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [value, setValue] = useState();
  const [medications, setMedications] = useState([]);

  return (
    <div>
      
      <h3>SIGN IN TO YOUR PORTAL</h3>
      <Card variant="outlined" sx={{ width: "75%", margin: "auto" }}>
        <Grid container spacing={2} sx={{ width: "75%", margin: "auto" }}>
          <Grid item xs={3}>
            <h3>First Name:</h3>
          </Grid>
          <Grid item xs={3}>
            <TextField id="standard-basic" label="John" variant="standard" />
          </Grid>
          <Grid item xs={3}>
            <h3>Last Name:</h3>
          </Grid>
          <Grid item xs={3}>
            <TextField id="standard-basic" label="Doe" variant="standard" />
          </Grid>
          <Grid item xs={3}>
            <h3>Date of Birth:</h3>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
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
        options={props.medications}
        sx={{ width: 200 }}
        renderInput={(params) => (
          <TextField {...params} label="Select medication" />
        )}
      />
    </Grid></div> : null }
        </Grid>

        <Button
          variant="outlined"
          onClick={() => {props.signIn()}}
          sx={{ color: "black", border: "1px solid black" }}
        >
          Sign in
        </Button>
        
      </Card>
    </div>
  )
}

