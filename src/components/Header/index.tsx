import HeaderLogo from "../../assets/header-logo.svg"
import "./style.scss";

const Header = () => {
  return (
    <header className="header">
      <a href="/">
        <img src={HeaderLogo} alt="HeaderLogo" width={60} />
      </a>
    </header>
  );
};

export default Header;
