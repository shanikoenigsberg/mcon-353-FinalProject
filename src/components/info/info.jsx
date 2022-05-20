import * as React from "react";
import { useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../state/context-user";
import TextField from "@mui/material/TextField";
import { Button, Autocomplete, collapseClasses } from "@mui/material";

export const Info = () => {
  const {myMeds, myUser} = useContext(UserContext);
  const [medsTaking, setMedsTaking] = myMeds;
  const [user, setUser] = myUser;

  const location = useLocation();
  const [meds, setMeds] = useState([]);
  const [info, setInfo] = useState([]);
  const [drugInteractions, setDrugInteractions] = useState([]);
  const [currMed, setCurrMed] = useState("");
  const [importantInfo, setImportantInfo] = useState([]);
  const [otherNames, setOtherNames] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [selectedCode, setSelectedCode] = useState();
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    //fetch meds
    fetch(`https://rxnav.nlm.nih.gov/REST/Prescribe/displaynames.json`)
      .then((response) => response.json())
      .then((data) => {
        setMeds(data.displayTermsList.term);
      });

      console.log("location.state !== null" + location.state === null);
      console.log(location.state);
      console.log("selectedMed !== null" + selectedMed === null);
      console.log(selectedMed);


    if(selectedMed !== null){
      fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${selectedMed}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCode(data.idGroup.rxnormId[0]);
      });

      console.log("location.state !== null" + location.state !== null);
      console.log("selectedMed !== null" + selectedMed !== null);
      console.log(location.state);
      
    fetch(
      `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${selectedCode}`
    )
      .then((response) => response.json())
      .then((data) => {
        setInfo(getData(data.interactionTypeGroup[0].interactionType[0]));
        setDrugInteractions(
          getDrugInteractions(data.interactionTypeGroup[0].interactionType[0])
        );
        console.log("fetch 1");
      });

     fetch(
      `https://rxnav.nlm.nih.gov/REST/Prescribe/rxcui/${selectedCode}/allrelated.json`
    )
      .then((response) => response.json())
      .then((data) => {
        
        setOtherNames(
          getOtherNames(data.allRelatedGroup.conceptGroup[0].conceptProperties)
        );
        setImportantInfo(getImportantInfo(data.allRelatedGroup.conceptGroup));
      });
    }
    else if(location.state !== null){
      setSelectedMed(location.state);
    }    

  }, [selectedMed, selectedCode]);

  const getData = (params) => {
    var myInfo = [];
    console.log("info" + params);

    for (var i = 0; i < 25; i++) {
      myInfo.push(params.interactionPair[i].description + " ");
    }

    return myInfo;
  };

  const getDrugInteractions = (params) => {
    var myDrugInteractions = [];
    let found = false;
    let drug;
    for (var i = 0; i < 25; i++) {
      drug = params.interactionPair[i].interactionConcept[1].minConceptItem.name;
        if(Object.keys(user).length > 0){
          if(user.allergies !== null){
            if(user.allergies.indexOf(drug) > -1){
              console.log("adding to allergies");
              myDrugInteractions.push(<><u style={{color: 'red'}}>{drug}</u>, </>);
              found = true;
              console.log(drug);
            }
            else{
              myDrugInteractions.push(<>{drug}, </>);
              found = true;
            }
          }
          if(user.currMedications !== null && found === false){
            if(user.currMedications.includes(drug)){
              console.log("adding to meds");
              myDrugInteractions.push(<><u style={{color: 'red'}}>{drug}</u>, </>);
              found = true;
              console.log(drug);
            }
            else{
              myDrugInteractions.push(<>{drug}, </>);
              found = true;
            }
          }
        }
        else if(found === false){
          myDrugInteractions.push(<>{drug}, </>);
          found = false;
        }
        
      
    }

    return myDrugInteractions;
  };

  const getOtherNames = (params) => {
    const names = [];
    console.log("parmas.length" + params.length);
    console.log("params info: " + params);
    for (var i = 0; i < params.length; i++) {
      names.push(params[i].name);
    }
    return names;
  };

  const getImportantInfo = (params) => {
    const forms = [];
    //data.allRelatedGroup.conceptGroup
    for (var i = 0; i < params.length; i++) {
      if (params[i].tty === "DF") {
        console.log("here!");
        const group = params[i].conceptProperties;
        console.log("1: " + params[i].conceptProperties[0].name);
        console.log("2: " + group[1]);
        console.log("group.length" + group.length);
        for (var j = 0; j < group.length; j++) {
          forms.push(group[j].name + ", ");
        }
      }
    }
    return forms;
  };


  if(location.state !== null || selectedMed !== null){
    return (
      <div sx={{ padding: "10px" }}>
        <h1>DRUG-DRUG INTERACTIONS: {selectedMed.toLocaleUpperCase()}</h1>
        
        <h5>WANT TO SEE DETAILS OF ANOTHER MEDICATION? <Button onClick={() => setShowInput(!showInput)} sx={{color: 'black'}}>CLICK HERE!</Button></h5>
        
        {showInput ? 
        <>
        <h5>ENTER MEDICATION BELOW</h5>
      <Autocomplete
              disablePortal
              id="medicine-select"
              options={meds}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Medicine..." />
              )}
              onChange={(event, value) => setSelectedMed(value)}
            /></>
            : null}
        <h2>ALSO KNOWN AS: {otherNames === null? "None listed" : otherNames.toString()}</h2>
        <h3>TAKING METHODS</h3>
        <h4>{importantInfo === null ? "None listed" : importantInfo}</h4>
        <h3>DO NOT TAKE WITH THE FOLLOWING MEDICATIONS</h3>
        <h4>{drugInteractions === null ? "None listed" : drugInteractions}</h4>
        <h3>INTERACTION DESCRIPTIONS</h3>
        <p>{info === null ? "None listed" : info}</p>
        <h5>More questions? Email us at questions@myportal.com</h5> 
        
      </div>
    );
  }
  else{
    return <>
    <h1>DRUG-DRUG INTERACTIONS: NO MEDICATION SELECTED</h1>
    <h3>PLEASE SELECT A MEDICATION</h3>
    <Autocomplete
              disablePortal
              id="medicine-select"
              options={meds}
              sx={{ width: 260 }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Medicine..." />
              )}
              onChange={(event, value) => setSelectedMed(value)}
            /></>
    
  }
  
};
