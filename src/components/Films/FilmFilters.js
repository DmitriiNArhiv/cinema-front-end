import React, { useState, useEffect } from "react";
import axios from "axios";
import FilmCard from "./FilmCard";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Grid from '@material-ui/core/Grid';
import { AppProvider } from "contexts/AppContext"
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// react plugin for creating date-time-picker
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
// core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Paginations from "components/Pagination/Pagination.js";

import styles from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";
import styles2 from "assets/jss/material-kit-react/views/components.js";

const useStyles = makeStyles(styles);
const useStyles2 = makeStyles(styles2);
export default function FilmFilters() {
    const classes = useStyles();
    const classes2 = useStyles2();
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    function getdate(date) {
        axios
            .get("http://localhost:8000/api/filmsbygenre/" + date)
            .then(
                (response) => {
                    setgenre(response.data);
                    const ps = [];
                    const p = [];
                    response.data.map(g => {
                        ps.push(Math.ceil(g.genrefilms.length / onpage))
                        p.push(1)
                    });
                    setpages(ps);
                    setpage(p);
                },
            );
    }

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var formatter = new Intl.DateTimeFormat('en', options);
    const [selecteddate, setselecteddate] = useState(formatter.format(new Date()));
    const [allgenre, setgenre] = useState([]);
    const [pages, setpages] = useState([]);
    const [page, setpage] = useState([]);
    const [onpage, setonpage] = useState(4);
    useEffect(() => {
        var date = formatDate(new Date());
        getdate(date);
    }, []);

    return (
        <div>
            <AppProvider>
                <Grid container>
                    <Grid item xs={12} className={classes2.textCenter}>
                        <h6>Movies Filter</h6>
                        <FormControl >
                            <Datetime
                            timeFormat={false}
                                inputProps={{
                                    placeholder: "Select Date ...", value: selecteddate
                                }}
                                onChange={(date) => {
                                    var d = new Date(date);
                                    var d = formatDate(d);
                                    setselecteddate(formatter.format(date));
                                     getdate(d);
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <div id="nav-tabs">
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomTabs
                                headerColor="primary"
                                tabs={
                                    allgenre.map((genre, i) => ({
                                        tabName: genre.name,
                                        tabContent: <div>
                                            <GridContainer style={{ padding: "25px" }}>
                                                {genre.genrefilms.slice((page[i] * onpage) - onpage,
                                                    page[i] * onpage > genre.genrefilms.lenght ? genre.genrefilms.lenght : page[i] * onpage)
                                                    .map(genrefilm => {
                                                        return (
                                                            /* When using list you need to specify a key
                                                            * attribute that is unique for each list item
                                                            */
                                                            <GridItem item xs={12} sm={6} md={4} lg={3} key={genrefilm.film.id}>
                                                                <FilmCard film={genrefilm.film} />
                                                            </GridItem>
                                                        );
                                                    })}
                                            </GridContainer>
                                            <div style={{ textAlign: "center" }}>
                                                <Paginations
                                                    pages=
                                                    {
                                                        Array.from(Array(pages[i]), (e, j) => ({
                                                            text: (j + 1),
                                                            active: (page[i] === j + 1),
                                                            onClick: () => {
                                                                let newArr = [...page];
                                                                newArr[i] = j + 1;
                                                                setpage(newArr);
                                                            }
                                                        })
                                                        )
                                                    }
                                                    color="info"
                                                />
                                            </div>
                                        </div>
                                    }))
                                }
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </AppProvider>
        </div>
    );

};