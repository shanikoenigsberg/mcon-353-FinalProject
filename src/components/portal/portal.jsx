import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Stack, Autocomplete } from "@mui/material";
import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import CardContent from "@mui/material/CardContent";
import QuestionMark from "@mui/icons-material/QuestionMark";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { UserContext } from "../state/context-user";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const Portal = () => {
  const {myMeds, myUser} = useContext(UserContext);
  const [medsTaking, setMedsTaking] = myMeds;
  const [user, setUser] = myUser;

  const [meds, setMeds] = useState([]);

  const [rxCode, setRxCode] = useState("");
  const [medName, setMedName] = useState("");
  const [firstTaken, setFirstTaken] = useState(null);
  const [takeAgain, setTakeAgain] = useState(null);
  const [dosageFrequency, setDosageFrequency] = useState();
  const [stopTaking, setStopTaking] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(true);

  let navigate = useNavigate();

  const setMedDetails = (value) => {
    setMedName(value);
    getRxNormCode(value);
  };

  const setTimeToTakeAgain = (params) => {
    setDosageFrequency(params);
    const newDate = new Date(firstTaken);
    const hours = parseInt(newDate.getHours()) + parseInt(params);
    newDate.setHours(hours);
    setTakeAgain(newDate);
  };

  const addToMedsTaking = () => {
    const date = new Date();

    if(takeAgain.getDate() <= date.getDate()){
      
    const newMeds = [
      ...medsTaking,
      {
        medName: medName.toLocaleUpperCase(),
        firstTaken: firstTaken.toLocaleTimeString(),
        dosageFrequency: dosageFrequency,
        takeAgain: takeAgain.toLocaleTimeString(),
        rxNormCode: rxCode,
        stopTaking: stopTaking.toLocaleDateString(),
      },
    ];

    console.log(newMeds);
    setMedsTaking(newMeds);
  }


  };

  const takeMedicine = (nameOfMed) => {

    medsTaking.map((med) => {
      if (nameOfMed === med.medName) {
        const now = new Date();
        med.firstTaken = new Date().toLocaleTimeString();
        const newDate = new Date();
        const hours = parseInt(newDate.getHours()) + parseInt(med.dosageFrequency);
        newDate.setHours(hours);

        if(newDate.getDate() > now.getDate()){
          setMedsTaking(medsTaking.filter((med) => med.medName !== nameOfMed));
        }

        med.takeAgain = newDate.toLocaleTimeString();
        //med.firstTaken = now.toLocaleTimeString();
        handleClick();
      } else {
        return med;
      }


    });

  };

  const getRxNormCode = (currMed) => {
    fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${currMed}`)
      .then((response) => response.json())
      .then((data) => {
        setRxCode(data.idGroup.rxnormId[0]);
      });
  };

  const moreInformation = (currMed) => {
    var code = null;
    medsTaking.map((med) => {
      if (currMed === med.medName) {
        code = med.rxNormCode;
      } else {
        return code;
      }
    });

    console.log("RXCODE " + medName);

    goToInfoPg(code);
  };

  const goToInfoPg = function (code) {
    navigate("/info", {
      state: code,
    });
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    initialize();
  });


  const handleCloseD = () => {
    setOpen(false);
  };

  const signIn = () => {
    navigate("/");
  }

  const initialize = () => {
    if(Object.keys(user).length === 0){
      setOpenD(true);
    }
    else{
      setOpenD(false);
    }
    fetch(`https://rxnav.nlm.nih.gov/REST/Prescribe/displaynames.json`)
      .then((response) => response.json())
      .then((data) => {
        setMeds(data.displayTermsList.term);
      });
  }

  return (
    <div>
      <Dialog
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Did you sign in?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Make sure that you have signed in so that you can properly use your portal.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {signIn()}}>
            SIGN IN
          </Button>
        </DialogActions>
      </Dialog>
      <Grid sx={{ width: "75%", margin: "auto" }}>
        <h1>Your Portal</h1>
        <h2>Patient: {user.name}</h2>
      </Grid>
      <Card
        variant="outlined"
        sx={{ width: "75%", margin: "auto", padding: "5px" }}
      >
        <Stack
          sx={{
            textAlign: "center",
            justifyContent: "center",
            //borderTop: "2px solid black",
            //borderBottom: "2px solid black",
          }}
        >
          <h2 sx={{ textAlign: "center", justifyContent: "center" }}>
            ADD MEDICATION
          </h2>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            paddingTop: "10px",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={2}
            direction="column"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <h3>Medicine</h3>
            <h3>First Taken At</h3>
            <h3>Dosage Frequency</h3>
            <h3>I Stop Taking On</h3>
          </Stack>
          <Stack
            spacing={2}
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Autocomplete
              disablePortal
              id="medicine-select"
              options={meds}
              sx={{ width: 260 }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Medicine..." />
              )}
              onChange={(event, value) => setMedDetails(value)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Enter time..."
                value={firstTaken}
                onChange={(newValue) => {
                  setFirstTaken(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              sx={{ width: 260 }}
              label="Enter hours..."
              onChange={(event) => setTimeToTakeAgain(event.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Enter date..."
                value={stopTaking}
                onChange={(newValue) => {
                  setStopTaking(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
        <Stack
          sx={{
            paddingTop: "25px",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <h6>DISCLAIMER: ALL MEDICATIONS MUST BE APPROVED BY DOCTOR BEFORE USE.</h6>
          <Button
            sx={{ margin: "auto", color: "black", border: "1px solid black" }}
            variant="outlined"
            onClick={() => {
              addToMedsTaking();
            }}
          >
            + ADD TO PORTAL
          </Button>
        </Stack>
      </Card>
      <CardContent>
        <Grid container>
          {medsTaking.map((med) => (
            <Grid item xs={6}>
              <Medicine
                name={med.medName}
                firstTaken={med.firstTaken}
                takeAgain={med.takeAgain}
                timeToNext={med.timeToNext}
                stopTaking={med.stopTaking}
                takeMedicine={takeMedicine}
                moreInformation={moreInformation}
              ></Medicine>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully registered your taken medication.
           
          </Alert>
        </Snackbar>
    </div>
  );
};

const Medicine = (props) => {
  //const { medsTaking, setMedsTaking } = useContext(TodoContext);

  return (
    <div>
      <Card variant="outlined" sx={{ width: "100%", margin: "auto" }}>
        <CardContent>
          <h3>Medicine Name: {props.name}</h3>
          <h4>First Taken: {props.firstTaken}</h4>
          <h4>Take Again: {props.takeAgain}</h4>
          <h4>Stop Taking: {props.stopTaking}</h4>
          <Button
            variant="outline-secondary"
            onClick={() => props.takeMedicine(props.name)}
          >
            <Icon icon="mdi:pill" fontSize={30} sx={{ margin: "auto" }} />
            <h4>TAKE</h4>
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => props.moreInformation(props.name)}
          >
            <QuestionMark />
            <h4>MORE INFORMATION</h4>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

//<Icon icon="medical-icon:i-pharmacy" fontSize={30} sx={{margin: 'auto'}}/><h4>MORE INFORMATION</h4>
