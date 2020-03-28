import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { convertMsToDate } from "../helpers/date";
import { TextField, Button, Icon } from "@material-ui/core";
import MaterialTable, { Column } from "material-table";
import { format, getTime, subDays } from "date-fns";
import { Container } from "@material-ui/core";
import { AppHeader } from "./common/AppHeader";
import ApiService from "../services/api.service";
import { handleUiError } from "../helpers/helpers";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

// interface Row {
//   id: string;
//   username: string;
//   firstName: string;
//   lastName: string;
// }

// interface TableState {
//   columns: Array<Column<Row>>;
//   data: Row[];
// }

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const columns = [
  { title: "Name", field: "name", defaultSort: "asc" },
  { title: "Email", field: "email" },
  { title: "Join date", field: "date" },
];

export const ManageUsers = () => {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);
  const [displayWarning, setDisplayWarning] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const getUsers = () => {
      return ApiService.getUsers().then(res => {
        console.log("users", res);
        // TODO: add envelope functionality to the API
        setUsers(res.data);
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
        console.log(newData);
        const { name, email } = newData;
        sendUserToServer(name, email)
          .then(res => {
            resolve();
            setUsers(prevState => {
              const data = [...prevState];
              data.push(newData);
              return data;
            });
          })
          .catch(e => handleUiError(e, reject));
        handleClickOpen();
      }, 600);
    });
  };

  const onRowUpdate = (newData, oldData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, email, _id } = newData;
        // console
        updateUserOnServer({ name, email }, _id)
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
    <Container maxWidth="lg">
      <AppHeader />
      <MaterialTable
        columns={columns}
        data={users}
        title="Manage Users"
        options={{
          exportButton: true,
        }}
        localization={{
          body: { editRow: { deleteText: "Are you sure you want to remove this user?" } },
        }}
        editable={{
          onRowAdd: newData => onRowAdd(newData),
          onRowUpdate: (newData, oldData) => onRowUpdate(newData, oldData),
          onRowDelete: oldData => onRowDelete(oldData),
        }}
      />
      {getDialog()}
    </Container>
  );
};
