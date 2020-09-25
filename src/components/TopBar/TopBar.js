import React, { useState } from "react";
import { Icon, Image } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";

import UserImage from "../../assets/png/user.png";
import BasicModal from "../Modal/BasicModal";
import LogOut from "../LogOut";
import "./TopBar.scss";

const TopBar = (props) => {
  const { user, history } = props;
  const [showModal, setShowModal] = useState(false);

  const goBack = () => {
    history.goBack();
  };

  const logOut = () => {
    setShowModal(true);
  };

  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <Icon name="angle left" onClick={goBack} />
      </div>
      <div className="top-bar__right">
        <Link to="/settings">
          <Image src={user.photoURL ? user.photoURL : UserImage} />
          {user.displayName}
        </Link>
        <Icon name="power off" onClick={logOut} />
      </div>
      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={"Cerrar Sesión"}
      >
        <LogOut setShowModal={setShowModal} />
      </BasicModal>
    </div>
  );
};

export default withRouter(TopBar);
