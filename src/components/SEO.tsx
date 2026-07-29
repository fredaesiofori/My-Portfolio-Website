import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Freda Esi Ofori | AWS Certified Cloud Architect & DevOps Engineer',
  description = 'Official portfolio of Freda Esi Ofori — AWS & Kubernetes Certified Cloud Architect, DevOps Engineer & Full-Stack Developer specializing in resilient cloud infrastructure, CI/CD, microservices, and AI-driven applications in Accra, Ghana.',
  keywords = 'Freda Esi Ofori, Cloud Architect, DevOps Engineer, AWS, Azure, AWS Certified, Kubernetes, Docker, Terraform, Full-Stack Developer, Accra Ghana, AlertGH, FoodBridge, SmartSpend, Cloud Engineer Portfolio',
  image = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  url = 'https://freda-portfolio.web.app',
  type = 'website',
  author = 'Freda Esi Ofori'
}) => {
  const fullTitle = title.includes('Freda Esi Ofori') ? title : `${title} | Freda Esi Ofori`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Freda Esi Ofori',
    url: url,
    image: image,
    jobTitle: 'AWS Certified Cloud Architect & DevOps Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freda Creations'
    },
    sameAs: [
      'https://github.com/fredaesiofori',
      'https://linkedin.com/in/freda-esi-ofori'
    ],
    knowsAbout: [
      'Cloud Architecture',
      'Amazon Web Services (AWS)',
      'Microsoft Azure',
      'DevOps & CI/CD Pipelines',
      'Kubernetes & Docker Containerization',
      'Terraform & Infrastructure as Code',
      'Full-Stack TypeScript & React',
      'Generative AI Applications'
    ],
    description: description
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#080808" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Freda Esi Ofori Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@fredaesiofori" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
