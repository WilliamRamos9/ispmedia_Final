import { FIREBASE_DB } from '../../src/firebase.ts'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import './VideoListScreen.css'; 


export default function VideoList(){
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const videosCollection = collection(FIREBASE_DB, 'videos');
    const videosQuery = query(videosCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(videosQuery, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    });

    return () => {
      // Clean up the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (

    <div style={{ flex: 1 }}>
      <ul className="horizontalList">
        {videos.map((item) => (
          <li key={item.id} className="horizontalItem">
            <video
              src={item.url}
              className="videoItem"
              style={{ width: '300px', height: '200px', borderRadius: '10px', margin: '10px' }}
              controls
            />
            <p className="horizontalTitle">{item.title}</p>
            <p className="horizontalArtist">{item.artistName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

