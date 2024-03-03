import { Button } from '@mui/material'
import React from 'react'
import KfinLogoNew from "../Assets/images/logo.png";
import KfinLogoWhite from "../Assets/images/logo.png";
export const GreetPage = () => {
  return (
    <>
      <span className="logo" style={{ position: "relative", top: "2rem" }}>
        <img src={KfinLogoNew} height="40px" width="auto"></img>
      </span>
      <div style={{
        height: "90vh", overflow: "hidden", display: "flex", justifyContent: "center",
        alignItems: "center", flexDirection: "column"
      }}>
        <h1 style={{ position: "relative", color: "blue", top: "2rem" }}>Thank You!</h1>
        <div>
          <h1>Your response has been recorded</h1>
        </div>
        {/* <div style={{ display: "flex" }}>
          <Button style={{ width: "200px" }} variant='contained'>Upload More</Button>
          <Button style={{ width: "200px" }} variant='contained'>Finish</Button>
        </div> */}
      </div>
      <Button>UploadMore</Button>
      <footer>
        <span>Powered By</span> <img src={KfinLogoWhite}></img>
      </footer>
    </>
  )
}