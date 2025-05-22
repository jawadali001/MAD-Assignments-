//Snack expo link : https://snack.expo.dev/@jawadaliraza/assignment3-theory
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [locationData, setLocationData] = useState({
    coords: null,
    city: null,
    error: null
  });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Location permission denied');

        const position = await Location.getCurrentPositionAsync({});
        const [geocode] = await Location.reverseGeocodeAsync(position.coords);
        
        setLocationData({
          coords: position.coords,
          city: geocode.city || 'Unknown city',
          error: null
        });
      } catch (error) {
        setLocationData({
          coords: null,
          city: null,
          error: error.message
        });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {locationData.error ? (
        <Text style={styles.error}>{locationData.error}</Text>
      ) : locationData.coords ? (
        <View style={styles.locationContainer}>
          <Text style={styles.title}>Location Details</Text>
          <Text style={styles.text}>
            Latitude: {locationData.coords.latitude.toFixed(4)}
          </Text>
          <Text style={styles.text}>
            Longitude: {locationData.coords.longitude.toFixed(4)}
          </Text>
          <Text style={styles.text}>City: {locationData.city}</Text>
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: name || 'Profile' });
  }, [name, navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCorrect={false}
        maxLength={30}
      />
    </View>
  );
};

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>App Settings</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: 'below-icon',
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  locationContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});