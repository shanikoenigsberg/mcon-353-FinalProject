import "./App.css";
import React from "react";
import {useContext} from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Header } from "../header/header";
import { Portal } from "../portal/portal";
import { Home } from "../home/home";
import { Info } from "../info/info";
import { UserProvider } from "../state/context-user";
import {PortalProvider} from "../state/context-portal";

function App() {
  return (
    <div>
      <PortalProvider>
      <UserProvider>
        <HashRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/portal" index element={<Portal />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </HashRouter>
      </ UserProvider>
      </PortalProvider>
    </div>
  );
}

export default App;

