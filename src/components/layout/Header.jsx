import React from "react";

const Header = ({
  title = "Manage Your Daily Tasks Efficiently",
  subtitle = "Stay organized and boost your productivity.",
}) => {
  return (
    <header className="hero-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
};

export default Header;
