//all imports
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


const LocationList = ({ navigation }) => {

  //is focussed is so the page re renders properly after changing screens
  const isFocused = useIsFocused();
  
  //places stores the places which come out of the fetch of the JSON file which contains all the information of the locations
  //this JSON file is uploaded onto the student server as can be seen later in the file
  const [places, setPlaces] = useState([])

  //this useState stores locations which have been saved in asyncStorage
  const [savedLocation, setSavedLocation] = useState([])

  //this state is to store and manage the current colour mode of the application
  const [style, setStyle] = useState({})

  //this useEffect contains the fetch
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        "Accept": "application/json",
      }
    }

    //fetches the data from the "webservice" (json file online on student server)
    //and then puts the data into a useState 
    fetch('https://stud.hosted.hr.nl/1049380/londonSightsData.json', options)
      .then(response => response.json())
      .then(data => {

        setPlaces(data);
        console.log("data", data)

      })

      .catch(error => console.error(error));

  }, []);

  useEffect(() => {

    //async function which gets the places a user has visited from the asyncStorage
    //and then stores that location in a useState
    const getPlaceFromStorage = async () => {
      const visitedPlace = await  AsyncStorage.getItem('places')
      setSavedLocation(visitedPlace)
      console.log("storage", savedLocation)
    }

    //async function which checks the localstorage/asyncstorage
    //what the current colour mode is, the if statement then says which styling to use
    const getModeFromStorage = async () => {
      const currentMode = await AsyncStorage.getItem('mode')
      if(currentMode === 'dark'){
        setStyle(stylesDark)
      } else {
        setStyle(stylesLight)
      }
    }

    //this is to immediately run the functions to check what colour mode to use
    //or to get the visited locations from asyncStoragea
    getPlaceFromStorage();
    getModeFromStorage();
  }) 

    //contents of the screen
    //in the scrollview the code maps through all the locations which are all pressables which navigate to the map
    //with the selected place as centerpoint. the place is passed to the map screen as a parameter.

    //to see if a place has been listed as visited, there's an ternary operator which checks whether or not a place has been
    //listed as visited. if it has, it will use a different styling than if it hasn't. when a place has been visited it will
    //also be shown as :visited behind the name of the location
    return (

        <ScrollView contentContainerStyle={style.locationBox}>

          {places.map((place, index) => (
            <Pressable key={index} onPress={() => navigation.navigate('map', {place})}>
              <Text  style={savedLocation.includes(place.title)? style.visitedLocation : style.location}>
                {place.title} {savedLocation.includes(place.title)? ": visited": ""} 
              </Text>
            </Pressable>
          ))}
        
      </ScrollView >

    );
  };

  //lightMode styling
  const stylesLight = StyleSheet.create({
    location: {
      width: 250,
      height: 60,
      backgroundColor: '#FA5F55',
      borderRadius: 20,
      marginBottom: 7,
      marginTop: 7,
      textAlign: 'center',
      paddingVertical: 20,
      fontWeight: 'bold'
    },

    visitedLocation: {
      width: 250,
      height: 60,
      backgroundColor: '#7cd3c3',
      borderRadius: 20,
      marginBottom: 7,
      marginTop: 7,
      textAlign: 'center',
      paddingVertical: 20,
      fontWeight: 'bold'
    },

    locationBox: {
      alignItems: 'center'
    }
  
  });

  //darkmode styling
  const stylesDark = StyleSheet.create({
    location: {
      width: 250,
      height: 60,
      backgroundColor: '#c35149',
      borderRadius: 20,
      marginBottom: 7,
      marginTop: 7,
      textAlign: 'center',
      paddingVertical: 20,
      fontWeight: 'bold',
      color: '#faf9f7'
    },

    visitedLocation: {
      width: 250,
      height: 60,
      backgroundColor: '#65a69a',
      borderRadius: 20,
      marginBottom: 7,
      marginTop: 7,
      textAlign: 'center',
      paddingVertical: 20,
      fontWeight: 'bold',
      color: '#faf9f7'
    },

    locationBox: {
      alignItems: 'center',
      backgroundColor: '#2b2b2b'
    }
  
  });

  //export so screen can be used
  export default LocationList;