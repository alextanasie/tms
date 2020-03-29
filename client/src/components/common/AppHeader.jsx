import React from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Menu, Toolbar, Container, AppBar, IconButton, Typography, MenuItem } from "@material-ui/core";
import { TableChart, PeopleAlt, ExitToApp } from "@material-ui/icons";
import MoreIcon from "@material-ui/icons/MoreVert";
import apiService from "../../services/api.service";
import { isUserAllowed } from "../../utils/helpers";

const useStyles = makeStyles(theme =>
  createStyles({
    grow: {
      flexGrow: 1,
      marginBottom: theme.spacing(5),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },

    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
  })
);

const headerLinkStyle = {
  color: "white",
  textDecoration: "none",
};

export const AppHeader = () => {
  const classes = useStyles();
  const history = useHistory();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const handleLogoutClick = () => {
    apiService.logOut();
    history.push("/login");
  };
  const handleTimecardClick = () => history.push("/timecard");
  const handleUsersClick = () => history.push("/manage-users");
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleTimecardClick}>
        <IconButton title="See timecards" aria-label="See timecards" color="inherit">
          <TableChart />
        </IconButton>
        <p>Timecards</p>
      </MenuItem>
      {isUserAllowed("/manage-users") ? (
        <MenuItem onClick={handleUsersClick}>
          <IconButton title="Manage users" aria-label="Manage users" color="inherit">
            <PeopleAlt />
          </IconButton>
          <p>Manage Users</p>
        </MenuItem>
      ) : (
        false
      )}
      <MenuItem onClick={handleLogoutClick}>
        <IconButton title="Logout" aria-label="Logout" color="inherit">
          <ExitToApp />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              <Link to="/timecard" style={headerLinkStyle}>
                TMS
              </Link>
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                title="See timecards"
                aria-label="See timecards"
                color="inherit"
                onClick={handleTimecardClick}
              >
                <TableChart />
              </IconButton>
              {isUserAllowed("/manage-users") ? (
                <IconButton title="Manage users" aria-label="Manage users" color="inherit" onClick={handleUsersClick}>
                  <PeopleAlt />
                </IconButton>
              ) : (
                false
              )}
              <IconButton title="Logout" aria-label="Logout" color="inherit" onClick={handleLogoutClick}>
                <ExitToApp />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
};
