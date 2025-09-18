import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./main.css";
import icon from "../../assets/foldericon.png";


export default function FeatureFolder() {
  const navi = useNavigate()


  return (
    <div className="main-ff">
      <button className="ff-button 1">
        <img src={icon} alt="Click me" />
        <div className="ff-button-text">Mix & Match</div>
      </button>

      <button className="ff-button 2" onClick={() => navi("/commu")}>
        <img src={icon} alt="Click me" />
        <div className="ff-button-text">Community</div>
      </button>

      
      <button className="ff-button 3">
        <img src={icon} alt="Click me" />
        <div className="ff-button-text">Fav Jersey</div>
      </button>
    </div>
  );
}