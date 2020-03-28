import React from "react";
import { AppHeader } from "./AppHeader";
import { Container, Grid, Typography } from "@material-ui/core";

export class Wrapper extends React.Component {
  styles = {
    marginBottom: {
      marginBottom: "10px",
    },
  };
  render() {
    return (
      <>
        <AppHeader />
        <Container maxWidth="lg">
          <Grid container item xs={12} spacing={3} alignItems="flex-end" style={this.styles.marginBottom}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h2" gutterBottom>
                {this.props.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {this.props.description}
              </Typography>
            </Grid>
          </Grid>
          {this.props.children}
        </Container>
      </>
    );
  }
}
