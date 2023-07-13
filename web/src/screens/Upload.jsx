import React, { useState } from 'react';
import './Upload.css';
import model from '../../src/assets/modelFemale.png';
import cover2 from '../../src/assets/image2.jpg';
import Sidebar from '../components/Sidebar.jsx';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_APP, FIREBASE_STORAGE } from '../firebase.ts';

export default function Upload() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const storage = getStorage(FIREBASE_APP);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCoverChange = (event) => {
    const selectedCover = event.target.files[0];
    setCover(selectedCover);
    if (selectedCover) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(selectedCover);
    } else {
      setCoverPreview(null);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Upload cover image
      if (cover) {
        const coverRef = ref(storage, `${FIREBASE_STORAGE}/${cover.name}`);
        await uploadBytes(coverRef, cover);
      }

      // Upload file (audio/video)
      if (file) {
        if(file.type.includes('video')){
            const videoRef = ref(storage, `${FIREBASE_STORAGE}/videos`);
      await uploadBytes(videoRef, file);
        }
        if (file.type.includes('audio')) {
            const audioRef = ref(storage, `${FIREBASE_STORAGE}/audios/${file.name}`);
            await uploadBytes(audioRef, file);
          }
      }

      // Reset form fields
      setName('');
      setDescription('');
      setCover(null);
      setFile(null);
      setCoverPreview(null);
      setFilePreview(null);

      // Show success message or redirect to another page
      alert('Upload successful!');
    } catch (error) {
      console.log('Error uploading file:', error);
      // Show error message
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="profile-bar">
        <img src={cover2} className="profile-picture" alt="Owner's Photo" />
      </div>

      <div className="content-container">
        <div className="upload-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="cover">Cover Image:</label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleCoverChange}
              required
            />
            {coverPreview && (
              <div className="preview-container">
                <img src={coverPreview} className="cover-preview" alt="Cover Preview" />
              </div>
            )}

            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} required />

            <label htmlFor="description">Description:</label>
            <textarea id="description" value={description} onChange={handleDescriptionChange} required></textarea>

            <label htmlFor="file">File (Audio/Video):</label>
            <input
              type="file"
              id="file"
              accept="audio/*, video/*"
              onChange={handleFileChange}
              required
            />
            {filePreview && (
              <div className="preview-container">
                <video controls className="file-preview">
                  <source src={filePreview} type={file.type} />
                </video>
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
