import React, { useState } from "react";
import AuthOptions from "../../components/Auth/AuthOptions";
import RegisterForm from "../../components/Auth/RegisterForm";
import LoginForm from "../../components/Auth/LoginForm";

import BackgroundAuth from "../../assets/jpg/background-auth.jpg";
import Logo from "../../assets/png/logo-name-white.png";

import "./Auth.scss";

const Auth = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  const handlerForm = () => {
    switch (selectedForm) {
      case "login":
        return <LoginForm setSelectedForm={setSelectedForm}/>;
      case "register":
        return <RegisterForm setSelectedForm={setSelectedForm}/>;
      default:
        return <AuthOptions setSelectedForm={setSelectedForm} />;
    }
  };

  return (
    <div className="auth" style={{ backgroundImage: `url(${BackgroundAuth})` }}>
      <div className="auth__dark" />
      <div className="auth__box">
        <div className="auth__box-logo">
          <img src={Logo} alt="musicfy" />
        </div>
        {handlerForm()}
      </div>
    </div>
  );
};

export default Auth;
