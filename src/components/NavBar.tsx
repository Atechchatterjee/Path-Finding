import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../App.css";

interface Props {
  header: string;
  startCb?: Function;
  randomCb?: Function;
  clearCb?: Function;
}

export default ({ header, startCb, randomCb, clearCb }: Props) => {
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand className="navHeader">{header}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            className="navLink"
            onClick={() => {
              if (startCb) startCb();
            }}
          >
            Start
          </Nav.Link>
          <Nav.Link
            className="navLink"
            onClick={() => {
              if (randomCb) randomCb();
            }}
          >
            Random
          </Nav.Link>
          <Nav.Link
            className="navLink"
            onClick={() => {
              if (clearCb) clearCb();
            }}
          >
            Clear Board
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
