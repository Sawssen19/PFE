export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  profileVisibility: 'anonymous' | 'public';
  profileDescription?: string;
  profileUrl?: string;
  phone?: string;
  birthday?: string;
  language?: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  visibility?: 'anonymous' | 'public';
  description?: string;
  profileUrl?: string;
  phone?: string;
  birthday?: string;
  language?: string;
}