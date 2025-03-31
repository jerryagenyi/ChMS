import { useState } from 'react';
import Image from 'next/image';
import { PROFILE_IMAGE_SIZE } from '@/services/image/image';
import { FormLabel, VisuallyHidden } from '@chakra-ui/react';

export function ProfileImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const inputId = 'profile-image-upload';

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);

      const response = await fetch('/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      setImageUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div role="group" aria-labelledby="profile-image-group" className="profile-image-container">
      <VisuallyHidden id="profile-image-group">Profile Image Upload</VisuallyHidden>

      {imageUrl && (
        <div className="profile-image-preview">
          <Image
            src={imageUrl}
            alt="Profile picture preview"
            width={PROFILE_IMAGE_SIZE}
            height={PROFILE_IMAGE_SIZE}
            className="profile-image"
          />
        </div>
      )}

      <div className="profile-image-upload-group">
        <FormLabel htmlFor={inputId}>
          {imageUrl ? 'Change profile picture' : 'Upload profile picture'}
        </FormLabel>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          aria-label="Choose profile picture"
          aria-describedby="file-upload-desc"
          className="profile-image-input"
        />

        <div id="file-upload-desc" className="profile-image-help-text">
          Accepted formats: JPG, PNG, GIF (max 5MB)
        </div>

        {isUploading && (
          <div role="status" aria-live="polite" className="profile-image-upload-status">
            <span>Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
