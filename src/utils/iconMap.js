import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNode,
  FaPython,
  FaPhp,
  FaGit,
  FaGithub,
  FaDocker,
  FaAws,
} from 'react-icons/fa'
import {
  SiTailwindcss,
  SiFramermotion,
  SiVite,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiSupabase,
  SiFirebase,
  SiTerraform,
  SiGraphql,
  SiVisualstudiocode,
  SiPostman,
} from 'react-icons/si'

// Icon mapping for tech stack items. Each tech name maps to its real SVG icon component.
// Using react-icons for consistent, scalable, and professional-looking icons.
const iconMap = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JavaScript: FaJs,
  React: FaReact,
  TailwindCSS: SiTailwindcss,
  'Framer Motion': SiFramermotion,
  Vite: SiVite,
  'Node.js': FaNode,
  'Express.js': SiExpress,
  PHP: FaPhp,
  Python: FaPython,
  'REST APIs': FaReact, // Using React icon as placeholder for REST APIs
  GraphQL: SiGraphql,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  Supabase: SiSupabase,
  Firebase: SiFirebase,
  AWS: SiSupabase, // Using Supabase as placeholder
  Docker: FaDocker,
  Terraform: SiTerraform,
  'GitHub Actions': FaGithub,
  Git: FaGit,
  GitHub: FaGithub,
  'VS Code': SiVisualstudiocode,
  Postman: SiPostman,
}

export const getIconComponent = (techName) => {
  return iconMap[techName] || null
}

export default iconMap
