import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { convertMsToDate } from "../helpers/date";
import { TextField, Button, Icon } from "@material-ui/core";
import MaterialTable, { Column } from "material-table";
import { format, getTime, subDays } from "date-fns";
import { Container } from "@material-ui/core";
import { Wrapper } from "./common/Wrapper";
import { AppHeader } from "./common/AppHeader";
import ApiService from "../services/api.service";
import { handleUiError } from "../helpers/helpers";
// interface Timecard {
//   id: string;
//   task: string;
//   date: string;
//   duration: string;
//   notes: string;
// }

// interface TableState {
//   columns: Array<Column<Timecard>>;
//   // data: Timecard[];
// }

// interface Props extends RouteComponentProps {}

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const COLUMNS = [
  { title: "Task", field: "task" },
  { title: "Date", field: "date", defaultSort: "desc" },
  { title: "Duration", field: "duration" },
  { title: "Notes", field: "notes" },
];

export const Timecard = () => {
  const DEFAULT_WORK_DAY = 8;
  const classes = useStyles();
  // const [columns, setColumns] = React.useState<TableState>([
  //   { title: "Task", field: "task" },
  //   { title: "Date", field: "date", defaultSort: "desc" },
  //   { title: "Duration", field: "duration" },
  //   { title: "Notes", field: "notes" },
  // ]);
  const [timecards, setTimecards] = React.useState([]);
  const [preferredDuration, setPreferredDuration] = React.useState(DEFAULT_WORK_DAY);
  const [startDate, setStartDate] = React.useState(format(subDays(Date.now(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = React.useState(format(Date.now(), "yyyy-MM-dd"));
  // const useMountEffect = fn => React.useEffect(fn, []);

  // const getTimecards = async () => {
  //   ApiService.getTimecards().then(res => {
  //     console.log("ia", res.data);
  //     setTimecards(res.data);
  //   });
  // };

  // useMountEffect(getTimecards);

  React.useEffect(() => {
    function fetchTimecards() {
      ApiService.getTimecards().then(res => {
        setTimecards(res.data);
      });
    }
    fetchTimecards();
  }, []);

  const submitMinDailyWork = e => {
    e.preventDefault();
    // TODO: send to server

    // const x = new FormData(e.target.value);
    console.log(e.target);
  };

  // const filterByDate = (e) => {
  //   e.preventDefault();
  //   console.log("filtering by date", startDate, endDate);

  //   const filteredRows = ALL_TASKS.filter(e => {
  //     return +e.date > +startDate && +e.date < +endDate;
  //   });
  //   setState(prevState => {
  //     return { ...prevState, data: filteredRows };
  //   });
  // };

  const onStartDateChange = e => {
    console.log("start", e.target.value);
    // let correctFormat = format(new Date(e.target.value), "YYYY-MM-DD");
    let msTime = getTime(new Date(e.target.value)).toString();
    setStartDate(msTime);
    console.log("INCORRECT MS", msTime);
  };

  const onEndDateChange = e => {
    console.log("end", e.target.value);
    // let correctFormat = format(new Date(e.target.value), "YYYY-MM-DD");
    let msTime = getTime(new Date(e.target.value)).toString();
    setEndDate(msTime);
    console.log("INCORRECT MS", msTime);
  };

  const dailyDurationChange = e => {
    setPreferredDuration(e.target.value);
  };

  const sendTimecardToServer = (task, duration, date, notes) => {
    return ApiService.createTimecard({ task, duration, date, notes });
  };

  const updateTimecardOnServer = (updatedTimecard, id) => {
    return ApiService.updateTimecard(updatedTimecard, id);
  };

  const deleteTimecardOnServer = id => {
    return ApiService.deleteTimecard(id);
  };

  const onRowAdd = newData => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { task, duration, date, notes } = newData;
        sendTimecardToServer(task, duration, date, notes)
          .then(res => {
            resolve();
            setTimecards(prevState => {
              const data = [...prevState];
              data.push(newData);
              console.log("iasaved", newData);

              return data;
            });
          })
          .catch(e => handleUiError(e, reject));
      }, 600);
    });
  };

  const onRowUpdate = (newData, oldData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData, "aa");
        const { task, duration, date, notes, _id } = newData;
        updateTimecardOnServer({ task, duration, date, notes }, _id)
          .then(res => {
            if (oldData) {
              resolve();
              setTimecards(prevState => {
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
        deleteTimecardOnServer(oldData._id)
          .then(res => {
            resolve();
            setTimecards(prevState => {
              const data = [...prevState];
              data.splice(data.indexOf(oldData), 1);
              return data;
            });
          })
          .catch(e => handleUiError(e, reject));
      }, 600);
    });
  };

  const dateFiter = () => {
    return (
      <form noValidate onSubmit={() => {}}>
        <TextField
          id="startDate"
          label="Start Date"
          type="date"
          defaultValue={startDate}
          name="startDate"
          onChange={onStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="endDate"
          label="End Date"
          type="date"
          defaultValue={endDate}
          name="endDate"
          onChange={onEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          disableElevation
          type="submit"
          size="medium"
          endIcon={<Icon>send</Icon>}
        >
          Filter
        </Button>
      </form>
    );
  };

  return (
    // https://reacttraining.com/react-router/web/api/Route/path-string-string
    <Container maxWidth="lg">
      <AppHeader />
      {dateFiter()}
      <form className={classes.root} noValidate autoComplete="off" onSubmit={submitMinDailyWork}>
        <TextField
          id="outlined-basic"
          label="Preferred daily working hrs"
          value={preferredDuration}
          type="string"
          variant="outlined"
          size="small"
          onChange={dailyDurationChange}
        />
        <Button
          variant="contained"
          color="primary"
          disableElevation
          type="submit"
          size="medium"
          endIcon={<Icon>send</Icon>}
        >
          Save
        </Button>
      </form>
      <MaterialTable
        columns={COLUMNS}
        data={timecards}
        title="Demo Title"
        options={{
          rowStyle: rowData => ({
            backgroundColor: rowData.duration < preferredDuration ? "red" : "green",
          }),
          exportButton: true,
        }}
        onRowClick={(e, row) => console.log(e, row)}
        editable={{
          onRowAdd: newData => onRowAdd(newData),
          onRowUpdate: (newData, oldData) => onRowUpdate(newData, oldData),
          onRowDelete: oldData => onRowDelete(oldData),
        }}
      />
    </Container>
  );
};
