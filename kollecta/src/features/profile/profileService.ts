import axios from 'axios';
import { ProfileData, ProfileUpdateData } from '../../types/profile.types';

const API_URL = 'http://localhost:5000/api';

export const profileService = {
  getProfile: async (userId: string): Promise<ProfileData> => {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_URL}/profile/${userId}/profile`,
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
    const mappedData: any = {};
    
    // Champs de base
    if (data.firstName !== undefined) mappedData.firstName = data.firstName;
    if (data.lastName !== undefined) mappedData.lastName = data.lastName;
    if (data.visibility !== undefined) mappedData.profileVisibility = data.visibility;
    if (data.description !== undefined) mappedData.profileDescription = data.description;
    if (data.profileUrl !== undefined) mappedData.profileUrl = data.profileUrl;
    
    // Nouveaux champs supportés par le backend
    if (data.phone !== undefined) mappedData.phone = data.phone;
    if (data.birthday !== undefined) mappedData.birthday = data.birthday;
    if (data.language !== undefined) mappedData.language = data.language;

    console.log('📤 Données envoyées au backend:', mappedData);

    const response = await axios.put(
      `${API_URL}/profile/${userId}/profile`,
      mappedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('📥 Réponse du backend:', response.data);
    return response.data.data; // Retourner data.data car le backend wrap dans un objet
  },

  uploadProfilePicture: async (userId: string, file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.post(
      `${API_URL}/profile/${userId}/profile-picture`,
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
      `${API_URL}/profile/${userId}/profile-picture`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getProfileStats: async (userId: string): Promise<{
    cagnottesCreated: number;
    cagnottesSupported: number;
    totalGiven: number;
  }> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/profile/${userId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  },

  updateNotificationPreferences: async (preferences: {
    emailNotifications: boolean;
    donationUpdates: boolean;
  }): Promise<{ notificationPreferences: any }> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/profile/notification-preferences`,
      preferences,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  },
};