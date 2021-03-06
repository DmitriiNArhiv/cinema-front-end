import React from "react";
import { AppProvider } from "contexts/AppContext"
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
import styles from "assets/jss/material-kit-react/views/components.js";
import SearchedFilms from "components/Films/SearchedFilms"

const useStyles = makeStyles(styles);
export default function FilmsSearched(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <AppProvider>
      <Header
        rightLinks={<HeaderLinks />}
        leftLinks={<List>
           <ListItem className={classes.listItem}>
        <Button
          href="http://localhost:3000"
          color="transparent"
          style={{ fontSize: 40 }}
          className={classes.navLink}
        >
         CinemaX
        </Button>
      </ListItem>
        </List>}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
     <Parallax image={require("assets/img/bg4.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>CinemaX</h1>
                <h3 className={classes.subtitle}>
                  Web-Application for booking and buying tickets in our cinema.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <GridContainer >
         <GridItem>
           <SearchedFilms props={props.location.search}></SearchedFilms>
        </GridItem>
    </GridContainer>
    </div>
      <Footer />
      </AppProvider>
    </div>
  );
}
