import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { collection, getDocs, query, getFirestore } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function AudioListScreen({childToParent}) {

  const [audios, setAudios] = useState([]);
  const navigation = useNavigation();

  const handleClick = (item) => {
    childToParent(item);
  }

  useEffect(() => {
    fetchAudios();

    // Cleanup function to unload the audio when navigating back to the page
    return () => {
      audios.forEach((audio) => {
        if (audio.sound) {
          audio.sound.unloadAsync();
        }
      });
    };
  }, []);


  const fetchAudios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const querySnapshot = await getDocs(audiosCollection);
      const audiosData = querySnapshot.docs.map((doc) => doc.data());

      // Add a sound property to each audio object
      const audiosWithSound = audiosData.map((audio) => {
        return {
          ...audio,
          sound: null,
        };
      });

      setAudios(audiosWithSound);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  return (
    <View>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => handleClick(item)}>
              <Image source={{ uri: item.thumbnailURL }} style={styles.item} />
            </TouchableOpacity>
            <Text style={styles.horizontalTitle}>{item.title}</Text>
            <Text style={styles.horizontalArtist}>{item.artistName}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 150,
    height: 150,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  horizontalTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'pink',
    marginLeft: 10,
  },
  horizontalArtist: {
    fontSize: 14,
    color: 'pink',
    marginLeft: 10,
  },
});
