
import React from 'react';
import { StyleSheet, Text, View, Animated, ScrollView, RefreshControl, Button, Image } from 'react-native';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';

import { API_KEY } from './utils/WeatherAPIKey';

import Weather from './components/Weather';

class MyHomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./assets/tab-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('WEATHER')}
        title="Go to Weather"
      />
    );
  }
}

class MyWeatherScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Weather',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./assets/tab-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    error: null
  };

  componentDidMount() {
    this.reloadWeather();
  }
  
  reloadWeather () {
    this.setState({
      isLoading: true
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Gettig Weather Condtions'
        });
      }
    );
  }

  fetchWeather(lat = 25, lon = 25) {

    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    return (
      <View style={styles.container}>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollInsideContainer}

          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.reloadWeather.bind(this)}
            />
          }
        >
  
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching The Weather</Text>
          </View>
        ) : (
          <Weather weather={weatherCondition} temperature={temperature} />
        )}

        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back home"
        />
        </ScrollView>
      </View>
    );
  }
}

/*
export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    error: null
  };
 
  componentDidMount() {
    this.reloadWeather();
  }
  
  reloadWeather () {
    this.setState({
      isLoading: true
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Gettig Weather Condtions'
        });
      }
    );
  }

  fetchWeather(lat = 25, lon = 25) {

    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    return (
      <View style={styles.container}>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollInsideContainer}

          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.reloadWeather.bind(this)}
            />
          }
        >
  
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching The Weather</Text>
          </View>
        ) : (
          <Weather weather={weatherCondition} temperature={temperature} />
        )}

        </ScrollView>
      </View>
    );
  }
}
*/


const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f0f'
  },
  scrollInsideContainer: {
    flex: 1,
    backgroundColor: '#ff0'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDE4'
  },
  loadingText: {
    fontSize: 30
  }
});


const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  WEATHER: {
    screen: MyWeatherScreen,
  },
});

const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp;