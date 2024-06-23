//all imports
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


//a function which is activated by a pressable which exists later in the file
//it checks which mode is currently selected and then based on that, changes it to the other 
//colour mode
const changeMode = async () => {

    try {
        const selectedMode = await AsyncStorage.getItem('mode')
        console.log('selectedMode', selectedMode)

        if (selectedMode !== 'dark') {
            await AsyncStorage.setItem('mode', 'dark')
        } else {
            await AsyncStorage.setItem('mode', 'light')
        }

    } catch (e) {
        console.log('could not change mode');
    }
};

const SettingScreen = ({ navigation }) => {

    //this state is to store and manage the current colour mode of the application
    const [style, setStyle] = useState({})

    //is focussed is so the page re renders properly after changing screens
    const isFocused = useIsFocused();

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
    
    //the content of the screen
    return (
        <View style={style.container}>
            <Pressable onPress={changeMode}>
                <View style={style.button}>
                    <Text style={style.buttonText}> Toggle darkmode </Text>
                </View>
            </Pressable>
        </View>
    )
}

//lightmode styling
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

  //darkmode styling
  const stylesDark = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2b2b2b',
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

//export so screen can be used
export default SettingScreen

