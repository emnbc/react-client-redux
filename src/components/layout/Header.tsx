import { Button, Modal } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { style } from "typestyle";
import { useState } from "react";
import { reset, selectUser } from "../../reducers/current-user-slice";
import { LocalStore } from "../../utils/local-store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const Header = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const userState = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleYes = () => {
    setShowConfirmation(false);
    logOut();
  };

  const logOut = () => {
    LocalStore.setToken("");
    dispatch(reset());
  };

  const toMain = () => navigate("/");

  const getFullName = () => {
    return `${userState.user?.firstName}!`;
  };

  const listMenu = menuItems.map((item, index) => (
    <li className="nav-item" key={index}>
      <NavLink
        to={item.path}
        aria-current="page"
        className={({ isActive }) =>
          `nav-link ${isActive ? "active" : ""} ${
            item.disabled ? "disabled" : ""
          }`
        }
      >
        {item.name}
      </NavLink>
    </li>
  ));

  const form = (
    <div className={userBlockStyles}>
      <div className="text-white-50">Hello, {getFullName()}</div>
      <Button
        onClick={() => {
          setShowConfirmation(true);
        }}
        variant="secondary"
        size="sm"
        type="button"
      >
        Log Out
      </Button>
    </div>
  );

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <span className={`navbar-brand ${logoStyles}`} onClick={toMain}>
            React Client
          </span>
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto mb-0">{listMenu}</ul>
            {form}
          </div>
        </div>
      </nav>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleYes}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const menuItems = [
  {
    name: "Home",
    path: "/",
    disabled: false,
  },
  {
    name: "User List",
    path: "/user-list",
    disabled: false,
  },
  {
    name: "Disabled",
    path: "/disabled",
    disabled: true,
  },
];

const logoStyles = style({
  cursor: "pointer",
});

const userBlockStyles = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
});
