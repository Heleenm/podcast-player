import React from 'react';
import logo from './logo-max.png';

export default function Header() {
  return  (
  <header className="App-header" role="banner">
    <a
      href="/"
      className="site-logo"
      title="Home"
      rel="home noopener noreferrer"
    >
      <img src={ logo } alt="Home" />
    </a>
  </header> );
}
