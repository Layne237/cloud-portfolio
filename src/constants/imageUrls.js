// All portfolio images are served from S3 via the shared bucket URL.
// This file centralizes S3 image URLs for the app.
const S3_BASE = 'https://portfolio-media-ariel-song.s3.amazonaws.com'

export const IMAGES = {
  // Profile images
  PROFILE: `${S3_BASE}/profile/layne.jpg`,
  
  // Your uploaded images (exact filenames and capitalization)
  AGT_TODO: `${S3_BASE}/projects/agt-todo.PNG`,
  FIN_BANK: `${S3_BASE}/projects/finbank.PNG`,
  SNAKE_BEAT: `${S3_BASE}/projects/neon_snake.PNG`,
  SCHOOL_EVENT: `${S3_BASE}/projects/CampusPulse.jpg`,
  
  // Missing projects - use placeholders for now
  HOME_SERVICE: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
  STUDENT_MANAGER: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
  
  // Tech icons (optional)
  REACT_ICON: `${S3_BASE}/tech-icons/react.svg`,
  AWS_ICON: `${S3_BASE}/tech-icons/aws.svg`,
  NODE_ICON: `${S3_BASE}/tech-icons/nodejs.svg`,
}

export default IMAGES
