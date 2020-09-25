import React from "react";
import { Button } from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import "firebase/auth";
import "./LogOut.scss";

export default function LogOut({ setShowModal }) {
  const logOut = () => {
    firebase.auth().signOut();
  };

  const cancelLogOut = () => {
    setShowModal(false);
  };

  return (
    <div className="log-out">
      <p>¿Estas seguro que deseas cerrar sesión?</p>
      <Button className="accept" onClick={logOut}>Si</Button>
      <Button className="cancel" onClick={cancelLogOut}>No</Button>
    </div>
  );
}
