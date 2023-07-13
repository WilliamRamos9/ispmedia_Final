import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDownloadURL, getFirestore, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../src/firebase.ts';
import { v4 as uuidv4 } from 'uuid';
import { IoMdLogOut } from 'react-icons/io';
import ArtistMedia from './ArtistMedia';
import { useFilePicker } from 'use-file-picker';

export default function Profile({ match }) {
  const navigate = useNavigate();
  const { personId } = match.params;
  const [personName, setPersonName] = useState('');
  const [personSurname, setPersonSurname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [itemUrl, setItemUrl] = useState('');
  const [itemType, setItemType] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [activeButton, setActiveButton] = useState('');

  const pickAudio = async () => {
    try {
      const [openFileSelector, { filesContent, loading }] = useFilePicker({
        accept: '.txt',
      });
    
      if (loading) {
        return <div>Loading...</div>;
      }
    } catch (error) {
      console.error('Erro ao escolher o áudio:', error);
    }
  };

  const pickVideo = async () => {
    try {
      const { files } = await documentPicker.pick({
        accept: ['video/*'],
      });
      setItemType('video');
      setItemUrl(URL.createObjectURL(files[0]));
    } catch (error) {
      console.error('Erro ao escolher o vídeo:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { files } = await documentPicker.pick({
        accept: ['image/*'],
      });
      setThumbnailUrl(URL.createObjectURL(files[0]));
      setSelectedThumbnail(files[0]);
    } catch (error) {
      console.error('Erro ao escolher a thumbnail:', error);
    }
  };

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPersonName(data.name);
          setPersonSurname(data.surname);
          setProfileImageUrl(data.imageUrl || null);
        }
      } catch (error) {
        console.log('Error fetching person data:', error);
      }
    };

    fetchPersonData();
  }, [personId]);

  const handleChangeProfilePicture = async () => {
    try {
      const file = await filePicker.pick({
        accept: ['image/*'],
      });

      const storageRef = ref(FIREBASE_STORAGE, `profilePictures/${file.name}`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      if (profileImageUrl) {
        const previousImageRef = ref(FIREBASE_STORAGE, getFilenameFromURL(profileImageUrl));
        try {
          await deleteObject(previousImageRef);
        } catch (error) {
          console.log('Error deleting previous profile picture:', error);
        }
      }

      setProfileImageUrl(downloadURL);

      const docRef = doc(FIREBASE_DB, 'pessoa', personId);
      await updateDoc(docRef, {
        imageUrl: downloadURL,
      });

      alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.log('Error changing profile picture:', error);
      alert('Error', 'Failed to change profile picture');
    }
  };

  const getFilenameFromURL = (url) => {
    const startIndex = url.lastIndexOf('/') + 1;
    return url.substring(startIndex);
  };

  const handleAudioSelection = async () => {
    try {
      await pickAudio();
    } catch (error) {
      console.error('Error selecting audio:', error);
    }
  };

  const handleVideoSelection = async () => {
    try {
      await pickVideo();
    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  function handleItemSelection() {
    window.alert('Escolha o tipo de mídia');
    window.alert('Escolha o tipo de mídia que quer postar:');
    window.alert('Áudio');
    handleAudioSelection();
    window.alert('Vídeo');
    handleVideoSelection();
  }

  const handleUploadNewItem = async () => {
    if (title && description && itemUrl) {
      if (itemType === 'audio') {
        try {
          const audioStorageRef = ref(FIREBASE_STORAGE, `audios/${selectedAudio.name}`);
          await uploadBytes(audioStorageRef, selectedAudio);

          const url = await getDownloadURL(audioStorageRef);

          const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${selectedThumbnail.name}`);
          await uploadBytes(thumbnailStorageRef, selectedThumbnail);

          const thumbnailUrl = await getDownloadURL(thumbnailStorageRef);

          const audioData = {
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            url,
            thumbnailUrl,
            artist: personId,
            artistName: personName.concat(' ', personSurname),
            type: 'audio',
          };

          const docRef = doc(FIREBASE_DB, 'pessoa', personId);
          await updateDoc(docRef, {
            uploaded: 'yes',
          });

          const audiosCollection = collection(FIREBASE_DB, 'audios');
          await addDoc(audiosCollection, audioData);

          console.log('Áudio enviado com sucesso!');
          alert('Sucesso', 'Áudio enviado com sucesso!');
        } catch (error) {
          console.error('Erro ao enviar o áudio:', error);
        }
      } else if (itemType === 'video') {
        try {
          const videoStorageRef = ref(FIREBASE_STORAGE, `videos/${uuidv4()}`);
          await uploadBytes(videoStorageRef, selectedVideo);

          const url = await getDownloadURL(videoStorageRef);

          const videoData = {
            title: title,
            description: description,
            videoPath: videoStorageRef.fullPath,
            url,
            createdAt: new Date(),
            artist: personId,
            artistName: personName.concat(' ', personSurname),
            type: 'video',
          };

          const videosCollection = collection(FIREBASE_DB, 'videos');
          await addDoc(videosCollection, videoData);

          const docRef = doc(FIREBASE_DB, 'pessoa', personId);
          await updateDoc(docRef, {
            uploaded: 'yes',
          });

          console.log('Video successfully uploaded to the database!');
          alert('Sucesso', 'Vídeo enviado com sucesso!');
        } catch (error) {
          console.log('Error uploading video to the database:', error);
          alert('Erro ao fazer upload de vídeo.');
        }
      }
    } else {
      alert('Formulário incompleto', 'Por favor preencha todos os campos e selecione um arquivo e uma thumbnail.');
    }
  };

  function logout() {
    navigate('/Login')
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <IoMdLogOut onClick={logout} size={30} color="red" />
        </div>
        <div className="profile-image-container">
          <img src={profileImageUrl} className="profile-image" alt="Profile" onClick={handleChangeProfilePicture} />
        </div>
      </div>
      <div className="content">
        <h2>{personName} {personSurname}</h2>
        <div className="options">
          <button
            className={`option-button ${activeButton === 'ver-meus-videos' && 'active'}`}
            onClick={() => {
              setActiveButton('ver-meus-videos');
              setShowForm(false);
              setShowMedia(true);
            }}
          >
            Meus mídias
          </button>
          <button
            className={`option-button ${activeButton === 'criar-album' && 'active'}`}
            onClick={() => {
              setActiveButton('criar-album');
              setShowForm(false);
              setShowMedia(false);
            }}
          >
            Criar álbum
          </button>
          <button
            className={`option-button ${activeButton === 'postar-novo-midia' && 'active'}`}
            onClick={() => {
              setActiveButton('postar-novo-midia');
              setShowForm(true);
              setShowMedia(false);
            }}
          >
            Novo mídia
          </button>
        </div>
      </div>
      {showMedia && (
        <div className="media-container">
          <ArtistMedia artistId={personId} />
        </div>
      )}
      {showForm && (
        <div className="form-container">
          <h3>Forneça as informações do mídia:</h3>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <button onClick={pickImage}>
              {thumbnailUrl ? 'Thumbnail selecionada' : 'Selecionar Thumbnail'}
            </button>
            <button onClick={handleItemSelection}>
              {itemUrl ? (itemType === 'audio' ? 'Áudio selecionado' : 'Vídeo selecionado') : 'Selecionar Item'}
            </button>
          </div>
          <button onClick={handleUploadNewItem}>Upload</button>
        </div>
      )}
    </div>
  );
}
