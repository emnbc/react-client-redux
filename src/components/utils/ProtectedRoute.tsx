import { Navigate, useLocation } from "react-router-dom";
import { selectUser } from "../../reducers/current-user-slice";
import { useAppSelector } from "../../store/hooks";

export const Protected = ({ element }: { element: JSX.Element }) => {
  const location = useLocation();
  const userState = useAppSelector(selectUser);

  return userState.isLoggedIn ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
