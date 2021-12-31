import './App.css';
import { ConnectionGate } from "./components/ConnectionGate";
import { Component } from "react";

function App() {

  return (
    <div>
        <ConnectionGate endpoint="localhost:3001"/>
    </div>
  );
}

export default App;
