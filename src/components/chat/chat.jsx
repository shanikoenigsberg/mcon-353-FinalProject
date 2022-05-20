import React from "react";
import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useInterval } from "../../hooks/use-interval";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";

export const Chat = () => {
  const [inputText, setInputText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [userText, setUserText] = useState("");

  const [chats, setChats] = useState([{ id: "", name: "" }]);
  const [messages, setMessages] = useState([{}]);
  const [user, setUser] = useState("");

  const [currChat, setCurrChat] = useState({ id: "", name: "" });

  //input text, messages, chats, new chat name, is chat, is chat popover open
  //context- not necessary username , chatid, dispatch: chatDispatch
  //on click/expand for dropdown call api
  //call api one time- take array that came out of it and use it as value to build ui

  //useInterval for chats
  useInterval(
    (params) => {
      const chatId = params[0];
      fetch(`https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/chats`)
        .then((response) => response.json())
        .then((data) => {
          setChats(data.Items);
        });
    },
    1000 // fast polling
    //   60000, // slow polling
    //   chatId
  );

  useInterval(
    (params) => {
      const chatId = params[0];
      fetch(
        `https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/chats/${currChat.id}/messages`
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data.Items);
        });
    },
    1000 // fast polling
    //   60000, // slow polling
  );

  function addChat(inputText) {
    const chat = {
      name: inputText,
    };

    fetch("https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/chats", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // tells REST that we will send the body data in JSON format
      },
      body: JSON.stringify(chat),
    });
  }

  function addMessage(messageText) {
    const data = {
      chatId: currChat.id, // required, must be an existing chat id
      username: user, // required
      text: messageText, // required
    };
    fetch(`https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/messages`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // tells REST that we will send the body data in JSON format
      },
      body: JSON.stringify(data),
    });
  }

  return (
    <div>
      <br></br>
      <h1>My Chats</h1>
      <Grid container spacing={1} sx={{ width: "75%", margin: "auto" }}>
        <Grid item xs={3}>
          <FormControl sx={{ width: 200, [`& fieldset`]: {borderRadius: 10}, }}>
            <InputLabel id="demo-simple-select-label">Pick Chat</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={(event) => setCurrChat({ id: event.target.value })}
            >
              {chats.map((chat) => (
                <MenuItem value={chat.id}>{chat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="standard-basic"
            label="Add Chat"
            variant="standard"
            onChange={(event) => setInputText(event.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => addChat(inputText)} sx={{color:'#b83248'}}>+</Button>
        </Grid>
        <Grid item xs={3} sx={{ marginLeft: "auto", [`& fieldset`]: {borderRadius: 10}, }}>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            onChange={(event) => setUserText(event.target.value)}
          />
        </Grid>
        <Grid item>
          <Button onClick={() => setUser(userText)} sx={{ color: "#b83248" }}>
            SET USER
          </Button>
        </Grid>
      </Grid>

      <Card
        sx={{
          minWidth: 275,
          width: "75%",
          margin: "auto",
          maxHeight: 275,
          overflow: "auto",
          minHeight: 275,
        }}
        style={{ backgroundColor: "#ffb6c1" }}
      >
        <CardContent>
          {messages.map((message) => (
            <div>
              <Message
                text={message.text}
                username={message.username}
                user={user}
              />
              <br></br>
            </div>
          ))}
        </CardContent>
      </Card>

      <TextField
        id="outlined-basic"
        label="Type Message"
        variant="outlined"
        onChange={(event) => setMessageText(event.target.value)}
        sx={{ width: "75%", margin: "auto", [`& fieldset`]: {borderRadius: 10} }}
        InputProps={{
          endAdornment: (
            <Button
              variant="outline-secondary"
              onClick={() => addMessage(messageText)}
            >
              <SendIcon sx={{ color: "#b83248", margin: "auto" }} />
            </Button>
          ),
        }}
      ></TextField>
    </div>
  );
};

const Message = (props) => {
  var messageUser = props.username;
  if(messageUser == "" || messageUser == null){
    messageUser = 'No Username';
  }
  if (props.user === props.username) {
    return (
      <Card
        raised
        sx={{
          width: "30%",
          minHeight: 50,
          bgcolor: "#b83248",
          color: "white",
          marginLeft: "auto",
          borderRadius: 10
        }}
      >
        <CardContent sx={{textAlign: 'left'}}>{messageUser}: {props.text}</CardContent>
      </Card>
    );
  } else {
    return (
      <Card
        raised
        sx={{
          width: "30%",
          minHeight: 50,
          bgcolor: "#8f898f",
          color: "white",
          marginRight: "auto",
          borderRadius: 10
        }}
      >
        <CardContent sx={{textAlign: 'left'}}>{messageUser}: {props.text}</CardContent>
      </Card>
    );
  }
};
