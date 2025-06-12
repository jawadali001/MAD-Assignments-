Snack Expo link: https://snack.expo.dev/@jawadaliraza/assign4-mad

import React, { createContext, useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { Accelerometer } from 'expo-sensors';

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState(null);
  const [updatedPost, setUpdatedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://jsonplaceholder.typicode.com';

  const getPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/posts?_limit=3`);
      setPosts(response.data);
    } catch (error) {
      console.error('GET Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/posts`, {
        title: 'New Post',
        body: 'This is a test post',
        userId: 1,
      });
      setNewPost(response.data);
    } catch (error) {
      console.error('POST Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/posts/1`, {
        id: 1,
        title: 'Updated Post',
        body: 'This post has been updated',
        userId: 1,
      });
      setUpdatedPost(response.data);
    } catch (error) {
      console.error('PUT Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        posts,
        newPost,
        updatedPost,
        loading,
        getPosts,
        createPost,
        updatePost,
      }}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => useContext(ApiContext);

const ApiScreen = () => {
  const {
    posts,
    newPost,
    updatedPost,
    loading,
    getPosts,
    createPost,
    updatePost,
  } = useApi();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Button title="Get Posts (GET)" onPress={getPosts} />
        {loading && <Text>Loading...</Text>}
        {posts.map((post) => (
          <View key={post.id} style={styles.item}>
            <Text style={styles.title}>{post.title}</Text>
            <Text>{post.body}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Button title="Create Post (POST)" onPress={createPost} />
        {newPost && (
          <View style={styles.item}>
            <Text style={styles.title}>New Post Created:</Text>
            <Text>{newPost.title}</Text>
            <Text>ID: {newPost.id}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Button title="Update Post (PUT)" onPress={updatePost} />
        {updatedPost && (
          <View style={styles.item}>
            <Text style={styles.title}>Updated Post:</Text>
            <Text>{updatedPost.title}</Text>
            <Text>{updatedPost.body}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const SensorScreen = () => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000);
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accelerometer Data</Text>
      <View style={styles.dataRow}>
        <Text>X:</Text>
        <Text style={styles.value}>{data.x.toFixed(2)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text>Y:</Text>
        <Text style={styles.value}>{data.y.toFixed(2)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text>Z:</Text>
        <Text style={styles.value}>{data.z.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ApiProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="API" component={ApiScreen} />
          <Tab.Screen name="Sensor" component={SensorScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  value: {
    fontWeight: 'bold',
  },
});
