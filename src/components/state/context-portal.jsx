import React, { useState } from "react";

export const PortalContext = React.createContext();

export const PortalProvider = (props) => {
    const [medsTaking, setMedsTaking] = useState([]);
  
    return (
      <PortalContext.Provider value= {{ medsTaking, setMedsTaking }}>
        {props.children}
      </ PortalContext.Provider>
    )
  }