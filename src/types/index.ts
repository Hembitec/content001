export interface User {
  name: string;
  avatar: string;
  coins: number;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface CompanyLogo {
  id: string;
  name: string;
  logo: string;
}