import React, { useState } from "react";

export const TodoContext = React.createContext();

export const TodoProvider = (props) => {
    const[myTodos, setTodos] = useState([]); 
  
    return (
      <TodoContext.Provider value= {{ myTodos, setTodos }}>
        {props.children}
      </TodoContext.Provider>
    )
  }
