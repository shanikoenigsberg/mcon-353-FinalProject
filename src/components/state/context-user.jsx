import React, { useState } from "react";

export const UserContext = React.createContext();

export const UserProvider = (props) => {
    const[user, setUser] = useState({}); 
    const [medsTaking, setMedsTaking] = useState([]);
  
    return (
      <UserContext.Provider value= {{ value: [medsTaking, setMedsTaking], value2: [user, setUser] }}>
        {props.children}
      </ UserContext.Provider>
    )
  }