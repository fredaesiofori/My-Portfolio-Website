export interface Project {
  id?: string;
  title: string;
  description: string;
  category: 'Cloud & DevOps' | 'Full-Stack & PWA' | 'AI & Civic Tech' | 'Serverless';
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  createdAt?: string;
}

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  imageUrl?: string;
  order?: number;
  createdAt?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  read?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  icon: string;
  skills: {
    name: string;
    level: string;
    highlight?: boolean;
  }[];
}

export interface BlogPost {
  id?: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  authorRole?: string;
  readTime?: string;
  tags: string[];
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  size: '1K' | '2K' | '4K';
  aspectRatio: string;
  createdAt: string;
}
