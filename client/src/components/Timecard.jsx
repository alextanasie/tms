import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { convertMsToDate } from "../helpers/date";
import { TextField, Button, Icon, Grid, Typography } from "@material-ui/core";
import MaterialTable, { Column } from "material-table";
import { format, getTime, subDays } from "date-fns";
import { Wrapper } from "./common/Wrapper";
import ApiService from "../services/api.service";
import { handleUiError } from "../helpers/helpers";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  grid: {
    marginTop: "50px",
  },
}));

const COLUMNS = [
  { title: "Task", field: "task" },
  { title: "Date", field: "date", defaultSort: "desc" },
  { title: "Duration", field: "duration" },
  { title: "Notes", field: "notes" },
];

export const Timecard = () => {
  let allTimecards = [];
  const DEFAULT_WORK_DAY = 8;
  const classes = useStyles();
  const [timecards, setTimecards] = React.useState([]);
  const [preferredDuration, setPreferredDuration] = React.useState(DEFAULT_WORK_DAY);
  const [startDate, setStartDate] = React.useState(format(subDays(Date.now(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = React.useState(format(Date.now(), "yyyy-MM-dd"));
  // const useMountEffect = fn => React.useEffect(fn, []);
  // useMountEffect(getTimecards);

  React.useEffect(() => {
    function fetchTimecards() {
      ApiService.getTimecards().then(res => {
        allTimecards = res.data;
        setTimecards(allTimecards);
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

  const filterByDate = e => {
    e.preventDefault();
    console.log("filtering by date", startDate, endDate);

    const filteredRows = allTimecards.filter(e => {
      return +e.date > +startDate && +e.date < +endDate;
    });
    setTimecards(prevState => {
      return filteredRows;
    });
  };

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

  const submitFilters = e => {
    e.preventDefault();
    filterByDate();
    submitMinDailyWork();
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

  const styles = {
    fullwidth: {
      width: "100%",
    },
    margins: {
      marginBottom: "10px",
    },
  };

  const getTopFilters = () => {
    return (
      <Grid container item xs={12} spacing={3} style={styles.margins} alignItems="flex-end">
        <Grid item xs={3}>
          <TextField
            size="small"
            id="startDate"
            label="Start Date"
            type="date"
            defaultValue={startDate}
            name="startDate"
            onChange={onStartDateChange}
            style={styles.fullwidth}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            size="small"
            id="endDate"
            label="End Date"
            type="date"
            defaultValue={endDate}
            name="endDate"
            onChange={onEndDateChange}
            style={styles.fullwidth}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            size="small"
            id="outlined-basic"
            label="Preferred daily working hrs"
            value={preferredDuration}
            type="string"
            onChange={dailyDurationChange}
            style={styles.fullwidth}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            type="submit"
            endIcon={<Icon>search</Icon>}
            style={styles.fullwidth}
          >
            Filter
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    // https://reacttraining.com/react-router/web/api/Route/path-string-string
    <Wrapper
      title="Timecards"
      description="From here, you may view, create, edit and delete all of your timecards. Use the controls from below to filter
    your data."
    >
      {getTopFilters()}
      <MaterialTable
        columns={COLUMNS}
        data={timecards}
        title="Demo Title"
        options={{
          rowStyle: rowData => ({
            backgroundColor:
              rowData.duration < preferredDuration ? "rgba(181, 60, 55, 0.30)" : "rgba(151, 180, 154, 0.58)",
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
    </Wrapper>
  );
};
