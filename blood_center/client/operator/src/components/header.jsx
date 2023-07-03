import React from 'react';
import '../styles/header.css';
import Logo from '../assets/cross_logo.png';

const Header = () => {
  return (
    <div className="header">
      <h1 className="header__text">Мониторинг Запросов</h1>
      <img src={Logo} alt="logo"/>
    </div>
  );
};

export default Header;