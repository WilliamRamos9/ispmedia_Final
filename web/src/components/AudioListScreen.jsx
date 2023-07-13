import { FIREBASE_DB } from '../../src/firebase.ts'; 
import {  doc,getDoc, getDocs,getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState ,useRef} from 'react';
import AudioPlayer from 'react-audio-player';
import './AudioListScreen.css'; 

export default function AudioList({childToParent}){
  const [audios, setAudios] = useState([]);
  const [currentSong, setCurrentSong] = useState(null); // State for current song
  const audioRef=useRef(null)
  useEffect(() => {
    fetchAudios();
  }, []);


  const fetchAudios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const querySnapshot = await getDocs(audiosCollection);
      const musicasData = querySnapshot.docs.map((doc) => doc.data());
      setAudios(musicasData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  const handleSongClick = (musica) => {
    if (currentSong === musica) {
      audioRef.current.audioEl.paused ? audioRef.current.audioEl.play() : audioRef.current.audioEl.pause();
    } else {
      setCurrentSong(musica);
      childToParent(true);

    }
  };

  return (
    <div style={{ flex: 1 }}>
      <ul className="horizontalList">
        {audios.map((musica) => (
                        <div className="chart" key={musica.id} onClick={() => handleSongClick(musica)}>
                            <img src={musica.thumbnailURL} alt="Music Cover" style={{ width: '150px', height: '150px', borderRadius: '10px', margin: '20px' }}/>
                            <p className="title">{musica.title}</p>
                            <p className="artist-name">{musica.artistName}</p>
                        </div>
                        
                    ))}

      </ul>
      {currentSong && (
        <AudioPlayer
          src={currentSong.url}
          ref={audioRef}
          onEnded={() => setCurrentSong(null)}
          autoPlay
        />
      )}
    </div>
  );
};
