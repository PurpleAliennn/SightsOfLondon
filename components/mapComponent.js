//all imports
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

//function to store a location into the asyncstorage as visited
//activated by a pressable later in this file
//it checks if the place you're trying to store is already stores
//if it is not, the place will be stored in the asyncstorage
const storeData = async (value) => {

  try {

    const visitedPlaces = JSON.parse(await AsyncStorage.getItem('places'))

    if (!visitedPlaces.includes(value.title)) {
      visitedPlaces.push(value.title)
    }

    console.log("value", JSON.stringify(visitedPlaces))
    await AsyncStorage.setItem('places', JSON.stringify(visitedPlaces))

  } catch (e) {
    console.log('could not store item');
  }
};


const MapComponent = ({ route, navigation }) => {

  //this const is used to receive a parameter which was passed from a different file
  //this parameter contains the title and the coordinates of the place the user selected
  //from the location list
  const { place } = route.params;

  //this state is to store and manage the current colour mode of the application
  const [style, setStyle] = useState({})

  //these states are used to store a current location and to store an errormessage
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //this useEffect asks for location permissions, if they've been granted the current location
  //will be stored in the location useState
  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Could not access your location');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  //is focussed is so the page re renders properly after changing screens
  const isFocused = useIsFocused();

  //this useEffect contains an async function which checks the localstorage/asyncstorage
  //what the current colour mode is, the if statement then says which styling to use
  useEffect(() => {

    const getModeFromStorage = async () => {
      const currentMode = await AsyncStorage.getItem('mode')
      if (currentMode === 'dark') {
        setStyle(stylesDark)
      } else {
        setStyle(stylesLight)
      }
    }

    //this is to immediately run the function to check what colour mode to use
    getModeFromStorage();

  })

  //the content of the screen, the region shows the location selected by the user on the location list
  //showsUserLocation is what makes it so the user can see their current position

  //the marker is placed on the exact coordinates the selected location is located

  //the pressable makes sure you can save a place as visited by passing the place to the function as a
  //parameter which is then used to store a place in asyncStorage
  return (

    <View style={style.container}>
      <MapView
        style={style.map}

        region={{
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}

        showsUserLocation={true}
      >

        <Marker coordinate={{
          latitude: place.latitude,
          longitude: place.longitude,
        }} />
      </MapView>

      <Pressable onPress={() => storeData(place)}>
        <View style={style.visitedButton}>
          <Text style={style.buttonText}> I've been here! </Text>
        </View>
      </Pressable>

    </View>
  );

};


//lightmode styling
const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf9f7'
  },
  map: {
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 20
  },
  visitedButton: {
    backgroundColor: '#FA5F55',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  }
});

//darkMode styling
const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2b2b2b'
  },
  map: {
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 20
  },
  visitedButton: {
    backgroundColor: '#c35149',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#faf9f7'
  }
});

//export so screen can be used
export default MapComponent;