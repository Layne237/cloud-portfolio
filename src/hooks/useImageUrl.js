/**
 * Hook to generate CloudFront image URLs from relative paths
 *
 * Usage:
 *   const imageUrl = useImageUrl('images/profile/ariel.jpg');
 *   <img src={imageUrl} alt="Profile" />
 *
 * Environment Variable Required:
 *   VITE_CLOUDFRONT_DOMAIN=https://d1234567890.cloudfront.net
 */

export const useImageUrl = (imagePath) => {
  const domain = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

  if (!domain) {
    console.warn(
      'VITE_CLOUDFRONT_DOMAIN not set. Using relative path fallback.',
      imagePath
    );
    // Fallback for development without CloudFront
    return `/${imagePath}`;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${domain}/${cleanPath}`;
};

export default useImageUrl;
