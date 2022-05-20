import React, { useState } from "react";

export const UserContext = React.createContext();

export const UserProvider = (props) => {
    const [myUser, setMyUser] = useState({}); 
    const [myMeds, setMyMeds] = useState([]);
  
    return (
      <UserContext.Provider value= {{ myMeds: [myMeds, setMyMeds], myUser: [myUser, setMyUser] }}>
        {props.children}
      </ UserContext.Provider>
    )
  }