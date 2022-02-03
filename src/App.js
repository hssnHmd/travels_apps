import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Header from "./components/header/Header";
import List from "./components/list/List";
import Map from "./components/map/Map";
import { getPlacesData, getWeather } from "./api/index";

const App = () => {
  const [places, setPlaces] = useState([]);
   const [weather, setWeather] = useState([]);
  const [filterdPlaces, setFilterdPlaces] = useState([]);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState(0);
  const [childClicked, setChildClicked] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [isLoading, setIsLoading] = useState(false);
 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setCoordinates({lat: latitude, lng: longitude})
    })
  }, []);
  useEffect(() => {
    const filterdPlace = places.filter((place) => place.rating > rating)
    setFilterdPlaces(filterdPlace);
  }, [rating]);
  
  
  useEffect(() => {
    setIsLoading(true)
    getWeather(coordinates.lat, coordinates.lng)
      .then((data) => {
        setWeather(data)
      })
    getPlacesData(type, bounds.sw, bounds.ne)
      .then((data) => {
        setPlaces(data);
        setFilterdPlaces([])
        setIsLoading(false)
       });
       
  }, [type, coordinates, bounds]);
  
  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filterdPlaces.length ? filterdPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filterdPlaces.length ? filterdPlaces : places}
            setChildClicked={setChildClicked}
            weather={weather}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
