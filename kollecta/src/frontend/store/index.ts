import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

// Fonction pour charger le state depuis le localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('kollecta-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Fonction pour sauvegarder le state dans le localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('kollecta-state', serializedState);
  } catch (err) {
    // Ignorer les erreurs de sauvegarde
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  preloadedState: loadState(),
});

// Sauvegarder le state à chaque changement
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;