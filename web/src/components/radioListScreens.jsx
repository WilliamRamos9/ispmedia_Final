import { getDocs,getFirestore, collection } from 'firebase/firestore';
import React, { useEffect, useState ,useRef} from 'react';
import AudioPlayer from 'react-audio-player';
import './AudioListScreen.css'; 

export default function AudioList(){
    const [radios, setRadios] = useState([]);
    const [currentRadio, setCurrentRadio] = useState(null);
    const audioRef = useRef(null);
  useEffect(() => {
    fetchRadios();
  }, []);

  const fetchRadios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'radios');
      const querySnapshot = await getDocs(audiosCollection);
      const RadiosData = querySnapshot.docs.map((doc) => doc.data());
      setRadios(RadiosData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  const handleRadioClick = (radio) => {
    if (currentRadio === radio) {
      audioRef.current.audioEl.paused ? audioRef.current.audioEl.play() : audioRef.current.audioEl.pause();
    } else {
      setCurrentRadio(radio);
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <ul className="horizontalList">
        {radios.map((radio) => (
                        <div className="chart" key={radio.frequency} onClick={() => handleRadioClick(radio)}>
                            <img src={radio.thumbnailURL} alt="Music Cover" style={{ width: '150px', height: '150px', borderRadius: '10px', margin: '20px' }}/>
                            <p className="title">{radio.title}</p>
                            <p className="artist-name">{radio.name}</p>
                        </div>
                        
                    ))}

      </ul>
      {currentRadio && (
        <AudioPlayer
          src={currentRadio.frequency}
          ref={audioRef}
          onEnded={() => setCurrentRadio(null)}
          autoPlay
        />
      )}
    </div>
  );
};
