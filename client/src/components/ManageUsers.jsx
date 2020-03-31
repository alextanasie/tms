import React from "react";
import MaterialTable from "material-table";
import ApiService from "../services/api.service";
import { handleUiError, isUserAdmin, formatDateForOneEntity } from "../utils/helpers";
import { getTime } from "date-fns";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Wrapper } from "./common/Wrapper";

const styles = {
  manager: {
    backgroundColor: "black",
  },
  admin: {
    backgroundColor: "rgba(255, 0, 0, 0.65)",
  },
  roleSelect: {
    fontSize: "13px",
  },
};

const columns = [
  { title: "Name", field: "name", defaultSort: "asc" },
  { title: "Email", field: "email" },
  { title: "Join date", field: "date", type: "date", editable: "never" },
  {
    title: "Role",
    field: "role",
    render: rowData => roleColumnRender(rowData),
    editComponent: props => editComponent(props),
  },
];

const roleColumnRender = rowData => {
  if (rowData.role === 1) {
    return (
      <Avatar variant="square" title="Regular user">
        U
      </Avatar>
    );
  }
  if (rowData.role === 2) {
    return (
      <Avatar variant="rounded" style={styles.manager} title="User Manager">
        M
      </Avatar>
    );
  }
  if (rowData.role === 3) {
    return (
      <Avatar variant="circle" style={styles.admin} title="Admin">
        A
      </Avatar>
    );
  }
};

const editComponent = props => {
  return (
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.value || 1}
        onChange={e => props.onChange(e.target.value)}
        size="small"
        style={styles.roleSelect}
      >
        <MenuItem value={1}>User</MenuItem>
        <MenuItem value={2}>Manager</MenuItem>
        {isUserAdmin() ? <MenuItem value={3}>Admin</MenuItem> : false}
      </Select>
    </FormControl>
  );
};

export const ManageUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const getUsers = () => {
      return ApiService.getUsers().then(res => {
        setUsers(res);
      });
    };

    getUsers();
  }, []);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClickClose = () => {
    setDialogOpen(false);
  };

  const sendUserToServer = (name, email) => {
    // The default password the user has to change
    // Send confirmation emails when registering users from this page
    return ApiService.createUser({ name, email, password: "password1" });
  };

  const updateUserOnServer = (updatedUser, id) => {
    return ApiService.updateUser(updatedUser, id);
  };

  const deleteUserOnServer = id => {
    return ApiService.deleteUser(id);
  };

  const onRowAdd = newData => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, email } = newData;
        newData.role = newData.role || 1;
        newData.date = formatDateForOneEntity(getTime(new Date()).toString());
        sendUserToServer(name, email)
          .then(res => {
            resolve();
            setUsers(prevState => {
              const data = [...prevState];
              data.push(newData);
              return data;
            });
            handleClickOpen();
          })
          .catch(e => handleUiError(e, reject));
      }, 600);
    });
  };

  const onRowUpdate = (newData, oldData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, email, _id, role } = newData;
        updateUserOnServer({ name, email, role }, _id)
          .then(res => {
            resolve();
            if (oldData) {
              setUsers(prevState => {
                const data = [...prevState];
                data[data.indexOf(oldData)] = newData;
                return data;
              });
            }
          })
          .catch(e => handleUiError(e, reject));
      }, 600);
    });
  };

  const onRowDelete = oldData => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        deleteUserOnServer(oldData._id)
          .then(res => {
            resolve();
            setUsers(prevState => {
              const data = [...prevState];
              data.splice(data.indexOf(oldData), 1);
              return data;
            });
          })
          .catch(e => handleUiError(e, reject));
      }, 600);
    });
  };

  const getDialog = () => {
    return (
      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Default password"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please note that the default password for new users created in this screen is{" "}
            <em>
              <strong>password1</strong>
            </em>
            .
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Wrapper
      title="Manage users"
      description="Create, edit and delete users. When creating a new user, the default password assigned will be: password1"
    >
      <MaterialTable
        columns={columns}
        data={users}
        title="Users list"
        options={{
          exportButton: true,
        }}
        localization={{
          body: { editRow: { deleteText: "Are you sure you want to remove this user?" } },
        }}
        editable={{
          isEditable: rowData => isUserAdmin() || rowData.role === 1, // only regular users are editable, unless user is admin
          isDeletable: rowData => isUserAdmin() || rowData.role === 1, // only regular users are deletable, unless user is admin
          onRowAdd: newData => onRowAdd(newData),
          onRowUpdate: (newData, oldData) => onRowUpdate(newData, oldData),
          onRowDelete: oldData => onRowDelete(oldData),
        }}
      />
      {getDialog()}
    </Wrapper>
  );
};
