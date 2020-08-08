import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../App.css";

interface Props {
  header: string;
  randomCb?: Function;
  clearCb?: Function;
  startCb?: Function;
}

export default ({ header, startCb, randomCb, clearCb }: Props) => {
  let [algorithm, changeAlgorithm] = useState<string>("");
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand className="navHeader">{header}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            className="navLink"
            onClick={() => {
              if (startCb) {
                startCb(algorithm);
              }
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
        <NavDropdown
          title={algorithm.length !== 0 ? algorithm : "Algoritm"}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item
            onSelect={() => {
              changeAlgorithm("A*");
            }}
          >
            A*
          </NavDropdown.Item>
          <NavDropdown.Item
            onSelect={() => {
              changeAlgorithm("Dijstra");
            }}
          >
            Dijstra
          </NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};
