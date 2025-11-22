import { Metadata } from 'next';

type MetadataParams = {
  title: string;
  description: string;
};

export const generateMetadata = ({ title, description }: MetadataParams): Metadata => {
  return {
    title: `Template | ${title}`,
    description,
    generator: 'Next.js',
    keywords: ['Template', 'Dashboard', 'Template'],
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Template',
      title: 'Template',
      description: 'Template',
      creator: '@Template',
    },
  };
};
