import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        if (location && location.coords) {
          const { latitude, longitude } = location.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } else {
          throw new Error('Failed to retrieve location data');
        }
      } catch (error) {
        console.log('Error getting location: ', error);
        Alert.alert('Error retrieving location');
      }
    })();
  }, []);

  const handleLongPress = (e) => {
    const newMarker = {
      coordinate: e.nativeEvent.coordinate,
      key: markers.length,
    };
    setMarkers([...markers, newMarker]);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          onLongPress={handleLongPress}
        >
          {markers.map((marker) => (
            <Marker key={marker.key} coordinate={marker.coordinate} />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          {}
          <Text>Loading map...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
