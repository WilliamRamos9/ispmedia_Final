import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';


const MiniPlayer = ({ audio }) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [playerHeight, setPlayerHeight] = useState(70);
  const [imageSize, setImageSize] = useState(new Animated.Value(50));
  const [panY] = useState(new Animated.Value(-60));
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: true }
  );

  useEffect(() => {
    if (audio) {
      loadAudio();
    }
  }, [audio]);



  const loadAudio = async () => {
    try {

      if (!loading) {
        setLoading(true);

        // Stop the previous audio if it is playing
        stopAudio();

        const { sound: audioSound } = await Audio.Sound.createAsync(
          { uri: audio.url },
          { shouldPlay: true },
          updatePlaybackStatus
        );

        setLoading(false);
        setSound(audioSound);
        setIsPlaying(true);
      }
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

  const [isFilled, setIsFilled] = useState(false);

  const handleHeartPress = () => {
    if (!isFilled) {
      setIsFilled(true);
    }
  };

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY } = event.nativeEvent;
      const windowHeight = Dimensions.get('window').height;
      if (translationY < -50) {
        setIsExpanded(true);
        Animated.spring(panY, {
          toValue: 0,
          velocity: 10,
          tension: 2,
          friction: 8,
          useNativeDriver: true
        }).start();
        Animated.spring(imageSize, {
          toValue: 200,
          velocity: 10,
          tension: 2,
          friction: 8,
          useNativeDriver: false
        }).start();
        setPlayerHeight(windowHeight);
      } else {
        setIsExpanded(false);
        Animated.spring(panY, {
          toValue: -60,
          velocity: 7,
          tension: 2,
          friction: 8,
          useNativeDriver: true
        }).start();
        Animated.spring(imageSize, {
          toValue: 60,
          velocity: 7,
          tension: 2,
          friction: 8,
          useNativeDriver: false
        }).start();
        setPlayerHeight(70);
      }
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.playerContainer,
            { height: playerHeight, transform: [{ translateY: panY }] }
          ]}
        >

          <View style={styles.contentContainer}>
            <Animated.Image
              style={[styles.albumCover, { width: imageSize, height: imageSize }]}
              source={audio.thumbnailURL ? { uri: audio.thumbnailURL } : require('../assets/loading.jpg')}
            />
            <View style={styles.songInfoContainer}>
              {audio.title && <Text style={styles.songTitle}>{audio.title}</Text>}
              {audio.artistName && <Text style={styles.artistName}>{audio.artistName}</Text>}
            </View>

            <TouchableOpacity onPress={handlePlayAudio} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="large" color="pink" />
              ) : isPlaying ? (
                <Ionicons name="pause-circle" size={40} color="pink" />
              ) : (
                <Ionicons name="play-circle" size={40} color="pink" />
              )}
            </TouchableOpacity>


          </View>

          {isExpanded && (
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
          )}

        </Animated.View>
      </PanGestureHandler>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '15%',


  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 150,
  },
  songInfoContainer: {
    flex: 1,
    marginLeft: 12
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'pink',
  },
  artistName: {
    fontSize: 14,
    color: '#888888',
    color: 'pink',

  },
  slider: {
    width: 300,
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

export default MiniPlayer;