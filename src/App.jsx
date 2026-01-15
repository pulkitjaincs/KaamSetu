import { useState } from "react"; 
import Navbar from "./components/Navbar"
import Card from "./components/Card";
import "./components/Card.css";

function App() {
  
  return (
    <>
    <Navbar name="KaamSetu"/>
    <div className ="myContainer">
    {Array.from({ length: 10 }).map((_, i) => (  
      <Card idx={i} title="Chef at Radisson Blu" description="A wonderfull opportunity for chef at Radisson Hotels"/>
    ))}    
    </div>
    </>
  );
}

export default App;
