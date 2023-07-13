import React, { useState, useEffect } from 'react';
import './Home.css';
import { MdPlayCircleFilled, MdPauseCircleFilled, MdSkipNext, MdSkipPrevious, MdShare } from 'react-icons/md';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import Sidebar from '../components/Sidebar.jsx'
import { doc, getDoc, getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase.ts';
import { useLocation } from 'react-router-dom';
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom';
import VideoListScreen from '../components/VideoListScreen'; 
import AudioListScreen from '../components/AudioListScreen';
import ArtistsListScreen from '../components/ArtistsListScreen';
import RadiosList from '../components/radioListScreens';

import TopBar from '../components/TopBar.jsx'; 


function Home({ route }) {


    const [personName, setPersonName] = useState('');
    const [isPlaying, setIsPlaying] = useState(false); // State for play/pause toggle
    const [selectedVideo, setSelectedVideo] = useState(null); // State for selected video
    const [currentSong, setCurrentSong] = useState(null); // State for current song
    const [currentTime, setCurrentTime] = useState(0); // State for current playback time
    const [isLiked, setIsLiked] = useState(false); // State for heart icon
    const [comments, setComments] = useState([]);
    const [duration, setDuration] = useState(0); // State for the duration of the current song
    const [currentRadioStation, setCurrentRadioStation] = useState(null); // State for current radio station
    const [radioStations, setRadioStations] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState('');

    const [audio, setAudio] = useState('');

    const childToParent = (childdata) => {
        setIsPlaying(childdata);
    }

    const location = useLocation();
    const personId = location.state?.personId;

    useEffect(() => {
        const fetchPersonName = async () => {
            try {
                const docRef = doc(FIREBASE_DB, 'pessoa', personId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setPersonName(data.name);
                    setProfileImageUrl(data.imageUrl);
                    console.log(personName)
                    console.log(profileImageUrl)
                }
            } catch (error) {
                console.log('Error fetching person name:', error);
            }
        };

        fetchPersonName();
    }, [personId]);

    

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const commentInput = e.target.elements.comment;
        const newComment = commentInput.value;
        setComments([...comments, newComment]);
        commentInput.value = '';
    };

    return (
        <div className="music-app">

            <Sidebar></Sidebar>

            <div className="main-content scrollable">

                <TopBar name={personName} image={profileImageUrl}></TopBar>
                

                <h2>Videos</h2>
                <div className="playlist-section">
                    <VideoListScreen/>

                </div>

                <h2>Músicas</h2>
                <div className="chart-section">
                    <AudioListScreen childToParent={childToParent}/>
                </div>

                <h2>Artistas Recomendados</h2>
                <div className="artist-section">
                    <ArtistsListScreen />
                </div>

                <h2>Estações de Rádio</h2>
                <div className="radio-section">
                    <RadiosList/>
                </div>
            </div>

            <div className="player-section">
                <div className="player-info">
                    {currentSong && (
                        <img src={currentSong.cover} className="song-cover" alt="Song Cover" />
                    )}
                </div>
                <div className="player-controls">
                    <MdSkipPrevious className="player-icon" />
                    {isPlaying ? (
                        <MdPauseCircleFilled className="player-icon" />
                    ) : (
                        <MdPlayCircleFilled className="player-icon" />
                    )}
                    <MdSkipNext className="player-icon" />
                </div>

                <div className="progress-bar" >
                    <div className="song-text">
                        <p className="song-artist">{currentSong?.artist}</p>
                        <p className="song-name">{currentSong?.title}</p>
                    </div>
                    <div className="song-duration">
                    </div>
                </div>

                <div className="share-like-icons">

                    <MdShare className="icon-home" />
                    {isLiked ? (
                        <MdFavorite className="icon-home" onClick={handleLikeClick} />
                    ) : (
                        <MdFavoriteBorder className="icon-home" onClick={handleLikeClick} />
                    )}

                </div>

                

            </div>


        </div>
    );
}

export default Home;