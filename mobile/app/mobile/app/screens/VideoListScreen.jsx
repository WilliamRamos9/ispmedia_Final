import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

export default function VideoListScreen() {

  const [videos, setVideos] = useState([]);
  const [artist, setArtist] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);


  useEffect(() => {
    subscribeToVideos();
  }, []);

  const subscribeToVideos = () => {
    const videosCollection = collection(FIREBASE_DB, 'videos');
    const artists = collection(FIREBASE_DB, 'pessoas');

    const videosQuery = query(videosCollection, orderBy('createdAt', 'desc'));

    onSnapshot(videosQuery, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    });
  };

  const handleThumbnailPress = (video) => {
    setSelectedVideo(video);
  };


  return (
    <View style={{ flex: 1 }}>

      <ScrollView horizontal={true} scrollEnabled={true}>

      {videos.map((video) => (
          <View key={video.id} style={styles.horizontalItem}>
            <TouchableOpacity onPress={() => handleThumbnailPress(video)}>
              <View style={styles.thumbnailContainer}>
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                )}
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Ionicons name="play" size={50} color="white" style={styles.playIcon} />
                )}
              </View>
              <Text style={styles.horizontalTitle}>{video.title}</Text>
              <Text style={styles.horizontalArtist}>{video.artistName}</Text>

            </TouchableOpacity>
            {selectedVideo && selectedVideo.id === video.id && (
              <>
                <Video
                  source={{ uri: video.url }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                />
              </>
            )}
          </View>
        ))}

      </ScrollView>


    </View>
  );
};

/*
{videos.map((video) => (
          <View key={video.id} style={styles.horizontalItem}>
            <TouchableOpacity onPress={() => handleThumbnailPress(video)}>
              <View style={styles.thumbnailContainer}>
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                )}
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Ionicons name="play" size={50} color="white" style={styles.playIcon} />
                )}
              </View>
              <Text style={styles.videoTitle}>{video.title}</Text>
            </TouchableOpacity>
            {selectedVideo && selectedVideo.id === video.id && (
              <>
                <Video
                  source={{ uri: video.videoUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                />
              </>
            )}
          </View>
        ))} */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 70,
  },
  iconSearch: {
    marginRight: 5,
    marginTop: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'grey',
    opacity: 0.5,
  },
  scrollContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 30,
  },
  horizontalItem: {
    marginLeft: 10,
  },
  rectangularCover: {
    marginTop: 10,
    width: 150,
    height: 150,
    borderRadius: 0,
  },
  circularCover: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  horizontalTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'pink',

  },
  horizontalArtist: {
    fontSize: 14,
    color: 'pink',
  },
  videoContainer: {
    marginBottom: 20,
    borderRadius: 10,

  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    width: 300,
    borderRadius: 10,

  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  video: {
    width: '100%',
    height: 200,
    width: 350,

  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
    padding: 5,
  },
});

