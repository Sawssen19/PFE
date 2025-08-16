import axios from 'axios';
import { ProfileData, ProfileUpdateData } from '../../types/profile.types';

const API_URL = 'http://localhost:5000/api';

export const profileService = {
  getProfile: async (userId: string): Promise<ProfileData> => {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_URL}/users/${userId}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  },

  updateProfile: async (userId: string, data: ProfileUpdateData): Promise<ProfileData> => {
    const token = localStorage.getItem('token');
    
    // Mapper les données pour correspondre au backend
    const mappedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      visibility: data.visibility, // Le backend attend 'visibility'
      description: data.description,
      profileUrl: data.profileUrl,
    };

    const response = await axios.put(
      `${API_URL}/users/${userId}/profile`,
      mappedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data; // Retourner data.data car le backend wrap dans un objet
  },

  uploadProfilePicture: async (userId: string, file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.post(
      `${API_URL}/users/${userId}/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data; // Retourner data.data
  },

  deleteProfilePicture: async (userId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(
      `${API_URL}/users/${userId}/profile-picture`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};