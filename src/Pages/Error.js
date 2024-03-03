import { Button } from '@mui/material'
import React from 'react'
import KfinLogoNew from "../Assets/images/logo.png";
import KfinLogoWhite from "../Assets/images/logo.png";
export const ErrorPage = () => {
  return (
    <>
      <span className="logo" style={{ position: "relative", top: "2rem" }}>
        <img src={KfinLogoNew} height="40px" width="auto"></img>
      </span>
      <div style={{
        height: "90vh", overflow: "hidden", display: "flex", justifyContent: "center",
        alignItems: "center", flexDirection: "column"
      }}>
        <h1 style={{ position: "relative", color: "blue", top: "2rem" }}>Error 404!</h1>
        <div>
          <h1>Page Not Found</h1>
        </div>
      </div>
      <footer>
        <span>Powered By</span> <img src={KfinLogoWhite}></img>
      </footer>
    </>
  )
}