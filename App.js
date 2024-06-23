//all imports 
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationList from './components/locationList';
import MapComponent from './components/mapComponent';
import SettingScreen from './components/settings';
import { useIsFocused } from '@react-navigation/native';


const Stack = createStackNavigator();

//component for the home screen
const HomeScreen = ({ navigation }) => {

  //is focussed is so the page re renders properly after changing screens
  const isFocused = useIsFocused();

  //this state is to store and manage the current colour mode of the application
  const [style, setStyle] = useState({})

    //this useEffect contains an async function which checks the localstorage/asyncstorage
    //what the current colour mode is, the if statement then says which styling to use
    useEffect(() => {
    
        const getModeFromStorage = async () => {
          const currentMode = await AsyncStorage.getItem('mode')
          if(currentMode === 'dark'){
            setStyle(stylesDark)
          } else {
            setStyle(stylesLight)
          }
        }

        //this is to immediately run the function to check what colour mode to use
        getModeFromStorage();
        
        
      }) 

    //the contents of the home page, the html so to say

    //the pressable makes a view, as the name already implies, pressable and uses an onPress to navigate to the different screens
    return (
        <View style={style.container}>
    
          <Text style={style.mainText}>This is SightsOfLondon! </Text>
          <Text style={style.regularText}> Find all the popular sights of London </Text>

        <Pressable onPress={() => navigation.navigate('list')}>
          <View style={style.button}>
            <Text style={style.buttonText}> See locations </Text>
          </View>
        </Pressable>
    
        <Pressable onPress={() => navigation.navigate('settings')}>
          <View style={style.button}>
            <Text style={style.buttonText}> Settings </Text>
          </View>
        </Pressable>
          <StatusBar style="auto" />
        </View>
      );
}


//this is for the navigation of the app, each screen has its own name so you can easily navigate to them from each screen
const App = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="settings" component={SettingScreen} />
        <Stack.Screen name="list" component={LocationList} />
        <Stack.Screen name="map" component={MapComponent} />

      </Stack.Navigator>
    </NavigationContainer>

  );
};

//the styling for lightmode
const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FA5F55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 30,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#faf9f7',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  }
});

//the styling for darkmode
const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c35149',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 30,
    marginBottom: 10,
    color: '#faf9f7'
  },
  regularText: {
    color: '#faf9f7'
  },
  button: {
    backgroundColor: '#2b2b2b',
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

export default App;
