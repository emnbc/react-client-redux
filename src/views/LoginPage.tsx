import { FormEvent, useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Navigate, useLocation } from "react-router-dom";
import { style } from "typestyle";
import { Auth } from "../services/http";
import { LocalStore } from "../utils/local-store";
import { fetchUser, selectUser } from "../reducers/current-user-slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";


export const LoginPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const from = location.state?.from?.pathname || "/";

  const [isLoginLoading, setLoginLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const userState = useAppSelector(selectUser);

  useEffect(() => {
    const token = LocalStore.getToken();

    if (token && !userState.isLoggedIn) {
      setLoginLoading(true);
      dispatch(fetchUser());
      setLoginLoading(false);
    }
  }, [dispatch, userState]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginLoading(true);
    Auth.login({ username, password })
      .then((res) => {
        if (res.data && res.data.accessToken) {
          LocalStore.setToken(res.data.accessToken);
          dispatch(fetchUser());
          setLoginLoading(false);
        }
      })
      .catch(() => setLoginLoading(false));
  };

  const loading = () => {
    return userState.isLoading || isLoginLoading;
  };

  return userState.isLoggedIn ? (
    <Navigate to={from} />
  ) : (
    <div className={loginStyles}>
      <Form className={`m-auto ${formStyles}`} onSubmit={handleSubmit}>
        {loading() && (
          <div className={spinnerStyles}>
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            disabled={loading()}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            disabled={loading()}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading()}>
          Submit
        </Button>

        {userState.isError && (
          <Alert variant="danger" className="mt-3">Something went wrong.</Alert>
        )}
      </Form>
    </div>
  );
};

const loginStyles = style({
  display: "flex",
  alignItems: "center",
  paddingTop: "40px",
  paddingBottom: "40px",
  backgroundColor: "#f5f5f5",
  height: "100%",
});

const formStyles = style({
  position: "relative",
  width: "100%",
  maxWidth: "360px",
});

const spinnerStyles = style({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
