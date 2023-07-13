import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

export default function ArtistsListScreen() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const artistsCollection = collection(getFirestore(), 'pessoa');
      const querySnapshot = await getDocs(
        query(artistsCollection, where('uploaded', '==', 'yes'))
      );
      const artistsData = querySnapshot.docs.map((doc) => doc.data());
      setArtists(artistsData);
    } catch (error) {
      console.error('Erro ao buscar os artistas:', error);
    }
  };

  function goToArtistPage(artist) {
    console.log('Navegar para a página do artista:', artist);
  }

  return (
    <div style={{ flex: 1 }}>
      <ul className="horizontalList">
        {artists.map((artist) => (
          <div
            className="artist"
            key={artist.name}
            onClick={() => goToArtistPage(artist)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <img src={artist.imageUrl} alt="Artist Picture" />
            <p className="artist-name-singular">{artist.name}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}
