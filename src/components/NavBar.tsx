import React, { FC, useState } from "react";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../App.css";

interface Props {
  header: string;
  randomCb?: Function;
  clearCb?: Function;
  startCb?: Function;
  cleanCb?: Function;
  speedCb?: Function;
  defaultSpeed: number;
}

let NavBar: FC<Props> = ({
  header,
  startCb,
  randomCb,
  clearCb,
  cleanCb,
  speedCb,
  defaultSpeed,
}) => {
  let [algorithm, changeAlgorithm] = useState<string>("");
  let [changedSpeed, updateChangedSpeed] = useState<string>("");
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand
        className="navHeader"
        onClick={() => window.location.assign("/")}
      >
        {header}
      </Navbar.Brand>
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
            Generate Walls
          </Nav.Link>
          <Nav.Link
            className="navLink"
            onClick={() => {
              if (clearCb) clearCb();
            }}
          >
            Clear Board
          </Nav.Link>
          <Nav.Link
            className="navLink"
            onClick={() => {
              if (cleanCb) cleanCb();
            }}
          >
            Clean
          </Nav.Link>
          <Nav.Link className="Label">Speed : </Nav.Link>
          <Form.Control
            type="number"
            value={changedSpeed.length === 0 ? defaultSpeed : changedSpeed}
            className="numberInput"
            id="speedInput"
            onChange={(event: any) => {
              updateChangedSpeed(event.target.value);
              if (speedCb) speedCb(event.target.value);
            }}
          />
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

export default NavBar;
