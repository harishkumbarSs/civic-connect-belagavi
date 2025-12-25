// ============================================
// Storage Service - Image & Audio Uploads
// ============================================

import { storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';

// ============================================
// Image Upload
// ============================================

export const uploadGrievanceImage = async (
    file: File | Blob,
    grievanceId: string,
    type: 'before' | 'after' = 'before'
): Promise<string> => {
    try {
        const timestamp = Date.now();
        const extension = file instanceof File ? file.name.split('.').pop() : 'jpg';
        const path = `grievances/${grievanceId}/${type}_${timestamp}.${extension}`;

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// ============================================
// Audio Upload
// ============================================

export const uploadVoiceNote = async (
    file: File | Blob,
    grievanceId: string
): Promise<string> => {
    try {
        const timestamp = Date.now();
        const extension = file instanceof File ? file.name.split('.').pop() : 'mp3';
        const path = `grievances/${grievanceId}/voice_${timestamp}.${extension}`;

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading voice note:', error);
        throw error;
    }
};

// ============================================
// Base64 to Blob Conversion
// ============================================

export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
};

// ============================================
// User Profile Image
// ============================================

export const uploadUserProfileImage = async (
    file: File | Blob,
    userId: string
): Promise<string> => {
    try {
        const timestamp = Date.now();
        const extension = file instanceof File ? file.name.split('.').pop() : 'jpg';
        const path = `users/${userId}/profile_${timestamp}.${extension}`;

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};
