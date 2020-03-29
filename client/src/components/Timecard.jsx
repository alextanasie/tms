import React from "react";
import { TextField, Button, Icon, Grid } from "@material-ui/core";
import MaterialTable from "material-table";
import { format, getTime, subDays } from "date-fns";
import { Wrapper } from "./common/Wrapper";
import ApiService from "../services/api.service";
import { handleUiError, formatDateFromMsForAllTimecards, formatDateForOneTimecard } from "../utils/helpers";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const styles = {
  fullwidth: {
    width: "100%",
  },
  margins: {
    marginBottom: "10px",
  },
};

const COLUMNS = [
  { title: "Task", field: "task" },
  {
    title: "Date",
    field: "date",
    defaultSort: "desc",
    type: "date",
    customSort: (a, b) => {
      return a.rawDate - b.rawDate;
    },
  },
  { title: "Duration (h)", field: "duration", type: "numeric" },
  { title: "Notes", field: "notes" },
];

export const Timecard = () => {
  const [timecards, setTimecards] = React.useState([]);
  const [preferredDuration, setPreferredDuration] = React.useState(8);
  const [startDate, setStartDate] = React.useState(getTime(subDays(Date.now(), 7)));
  const [endDate, setEndDate] = React.useState(getTime(new Date()));

  React.useEffect(() => {
    function fetchTimecards() {
      ApiService.getTimecards().then(timecards => {
        formatDateFromMsForAllTimecards(timecards);
        setTimecards(filteredTimecards(timecards, startDate, endDate));
      });
    }
    fetchTimecards();
  }, []);

  const dailyDurationChange = e => {
    setPreferredDuration(+e.target.value);
  };

  const sendTimecardToServer = (task, duration, date, notes) => {
    return ApiService.createTimecard({ task, duration, date, notes });
  };

  const updateTimecardOnServer = (task, duration, date, notes, id) => {
    return ApiService.updateTimecard({ task, duration, date, notes }, id);
  };

  const deleteTimecardOnServer = id => {
    return ApiService.deleteTimecard(id);
  };

  const onRowAdd = newData => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { task, duration, date, notes } = newData;
        // quick solution to overcome date formatting which can't be done through the 3rd party lib. basically we have 3 date formats
        newData.rawDate = getTime(new Date(date)).toString();
        newData.date = formatDateForOneTimecard(newData.rawDate);
        sendTimecardToServer(task, duration, newData.rawDate, notes)
          .then(res => {
            resolve();
            setTimecards(prevState => {
              const data = [...prevState];
              newData._id = res.data.id;
              data.push(newData);

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
        const { task, duration, date, notes, _id } = newData;
        // quick solution to overcome date formatting which can't be done through the 3rd party lib. basically we have 3 date formats
        newData.rawDate = getTime(new Date(date)).toString();
        newData.date = formatDateForOneTimecard(newData.rawDate);
        updateTimecardOnServer(task, duration, newData.rawDate, notes, _id)
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
        console.log("wtff", oldData);
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

  const filteredTimecards = (timecards, start, end) => {
    return timecards.filter(timecard => {
      return timecard.rawDate > start && timecard.rawDate < end;
    });
  };

  const filterTimecardsByDate = (start, end) => {
    const allTimecards = ApiService.getStoredTimecards();

    setTimecards(prevState => filteredTimecards(allTimecards, start, end));
  };

  const handleStartDateChange = e => {
    const startDateInMs = e.getTime();
    setStartDate(startDateInMs);
    filterTimecardsByDate(startDateInMs, endDate);
  };

  const handleEndDateChange = e => {
    const endDateInMs = e.getTime();
    setEndDate(endDateInMs);
    filterTimecardsByDate(startDate, endDateInMs);
  };

  const getTopFilters = () => {
    return (
      <Grid container item xs={12} spacing={3} style={styles.margins} alignItems="flex-end">
        <Grid item xs={4}>
          <DatePicker fullWidth value={startDate} onChange={handleStartDateChange} disableFuture={true} label="From" />
        </Grid>
        <Grid item xs={4}>
          <DatePicker fullWidth value={endDate} onChange={handleEndDateChange} disableFuture={true} label="To" />
        </Grid>
        <Grid item xs={4}>
          <TextField
            size="small"
            id="outlined-basic"
            label="Preferred daily working hrs"
            value={preferredDuration}
            type="string"
            onChange={dailyDurationChange}
            fullWidth
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Wrapper
      title="Timecards"
      description="From here, you may view, create, edit and delete all of your timecards. Use the controls from below to filter
    your data."
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {getTopFilters()}
        <MaterialTable
          columns={COLUMNS}
          data={timecards}
          title="Entries"
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
      </MuiPickersUtilsProvider>
    </Wrapper>
  );
};
