import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

export default function MusicPage({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  

  useEffect(() => {
    if (isFocused) {
      loadAudio();
    }

    return () => {
      // Remove stopAudio() from here
    };
  }, [isFocused]);

  const loadAudio = async () => {
    try {

      setLoading(true);

      // Stop the previous audio if it is playing
      stopAudio(); 

      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: item.url },
        { shouldPlay: true },
        updatePlaybackStatus
      );

      setLoading(false);
      setSound(audioSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const handlePlayAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSliderChange = async (value) => {
    try {
      if (sound) {
        await sound.setPositionAsync(value);
        setPosition(value);
      }
    } catch (error) {
      console.error('Error changing slider position:', error);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleDownloadAudio = async () => {
    try {
      setLoadingAudio(true);
      const folderName = 'ISPMEDIA';
      const folderInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + folderName);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + folderName);
      }
      const fileExtension = item.url.substring(item.url.lastIndexOf('.') + 1);
      const fileName = `ispmedia_${Date.now()}.${fileExtension}`;
      const filePath = FileSystem.documentDirectory + folderName + '/' + fileName;
      const downloadResumable = FileSystem.createDownloadResumable(item.url, filePath);
      const { uri } = await downloadResumable.downloadAsync();
      setLoadingAudio(false);
      console.log('Audio downloaded:', uri);
      Alert.alert('Success', 'Áudio baixado com sucesso.');
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.label}>Playing Now</Text>
        <TouchableOpacity onPress={toggleLike}>
          {isLiked ? (
            <Ionicons style={styles.iconHeart} name="heart" size={30} color="red" />
          ) : (
            <Ionicons style={styles.iconHeart} name="heart-outline" size={30} color="red" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.song}>
        <View style={styles.coverBack}>
          <Image source={{ uri: item.thumbnailURL }} style={styles.cover} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artistName}</Text>
        <View style={styles.shareView}>
          <TouchableOpacity onPress={handleDownloadAudio}>
            <Ionicons name="download-outline" size={30} color="pink" style={styles.share} />
          </TouchableOpacity>
          <Ionicons name="share-social-outline" size={30} color="pink" style={styles.download} />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="pink"
          maximumTrackTintColor="grey"
          onSlidingComplete={handleSliderChange}
          thumbTintColor="pink"
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
        />
        <View style={styles.controls}>
          <TouchableOpacity>
            <Ionicons name="play-back-outline" size={60} color="pink" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayAudio} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="large" color="pink" />
            ) : isPlaying ? (
              <Ionicons name="pause-circle" size={100} color="pink" />
            ) : (
              <Ionicons name="play-circle" size={100} color="pink" />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="play-forward-outline" size={60} color="pink" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: '15%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'grey',
    paddingRight: 100,
    paddingLeft: 100,
    opacity: 0.5,
  },
  song: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  shareView: {
    flexDirection: 'row',
    marginBottom: '10%',
  },
  share: {
    marginRight: 230,
  },
  coverBack: {
    width: 175,
    height: 175,
    marginBottom: 50,
    borderRadius: 200,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    fontSize: 20,
    marginBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 30,
    width: 250,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    width: 300,
    marginBottom: 20,
  },
  sliderThumb: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: 'pink',
  },
  sliderTrack: {
    height: 5,
    borderRadius: 1,
    backgroundColor: 'grey',
  },
});
