import * as React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { UserContext } from "../state/context-user";

export const Info = () => {
  const location = useLocation();
  const [info, setInfo] = useState([]);
  const [drugInteractions, setDrugInteractions] = useState([]);
  const [currMed, setCurrMed] = useState("");
  const [importantInfo, setImportantInfo] = useState([]);
  const [otherNames, setOtherNames] = useState([]);

  useEffect(() => {
    //fetch info
    fetch(
      `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${location.state}`
    )
      .then((response) => response.json())
      .then((data) => {
        setInfo(getData(data.interactionTypeGroup[0].interactionType[0]));
        setDrugInteractions(
          getDrugInteractions(data.interactionTypeGroup[0].interactionType[0])
        );
        console.log("fetch 1");
      });
    //set curr med name
    fetch(
      `https://rxnav.nlm.nih.gov/REST/Prescribe/rxcui/${location.state}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrMed(data.idGroup.name);
        console.log("fetch 2");
      });

     fetch(
      `https://rxnav.nlm.nih.gov/REST/Prescribe/rxcui/${location.state}/allrelated.json`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("problem data: " + data);
        console.log(
          "length: " +
            data.allRelatedGroup.conceptGroup[0].conceptProperties.length
        );
        setOtherNames(
          getOtherNames(data.allRelatedGroup.conceptGroup[0].conceptProperties)
        );
        console.log("fetch 3");
        setImportantInfo(getImportantInfo(data.allRelatedGroup.conceptGroup));
        console.log("fetch 4");
      });

  }, []);

  const getData = (params) => {
    var myInfo = [];
    console.log("info" + params);

    for (var i = 0; i < 50; i++) {
      myInfo.push(params.interactionPair[i].description + " ");
    }

    return myInfo;
  };

  const getDrugInteractions = (params) => {
    var myDrugInteractions = [];
    var drug;
    for (var i = 0; i < 50; i++) {
      drug =
        params.interactionPair[i].interactionConcept[1].minConceptItem.name;
      //if in meds taking, made bold
      myDrugInteractions.push(drug + ", ");
    }

    return myDrugInteractions;
  };

  const getOtherNames = (params) => {
    const names = [];
    console.log("parmas.length" + params.length);
    console.log("params info: " + params);
    for (var i = 0; i < params.length; i++) {
      console.log("name: " + params[0].name);
      names.push(params[0].name);
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

  return (
    <div sx={{ padding: "10px" }}>
      <h1>DRUG-DRUG INTERACTIONS: {currMed.toLocaleUpperCase()}</h1>
      <h2>ALSO KNOWN AS: {otherNames.toString()}</h2>
      <h3>TAKING METHODS</h3>
      <h4>{importantInfo}</h4>
      <h3>DO NOT TAKE WITH THE FOLLOWING MEDICATIONS</h3>
      <h4>{drugInteractions}</h4>
      <h3>INTERACTION DESCRIPTIONS</h3>
      <p>{info}</p>
    </div>
  );
};
