import React from "react";
import { Table } from "react-bootstrap";
import { shortDate } from "../utils/date-time";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "../store/store";
import { fetchUserList, reset } from "../reducers/user-list-slice";

const mapState = (state: RootState) => ({
  users: state.userList.users,
  isLoading: state.userList.isLoading,
});

const mapDispatch = {
  getUsers: () => fetchUserList(),
  reset: () => reset(),
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface UserListProps extends PropsFromRedux {}

interface UserListState {}

class UserListPage extends React.Component<UserListProps, UserListState> {

  componentDidMount(): void {
    this.props.getUsers();
  }

  componentWillUnmount(): void {
      this.props.reset();
  }

  render() {
    const list = this.props.users.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>{item.firstName}</td>
        <td>{item.lastName}</td>
        <td>{shortDate(item.birthDate)}</td>
        <td>{item.username}</td>
        <td>{item.email}</td>
      </tr>
    ));

    const loading = (
      <tr>
        <td colSpan={6} align="center">
          Loading...
        </td>
      </tr>
    );

    return (
      <div>
        <h2>User List</h2>
        <div>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Birth Date</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>{this.props.isLoading ? loading : list}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default connector(UserListPage);
