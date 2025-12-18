import { Metadata } from "next";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: SEOProps): Metadata {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "DevDed Blog";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const defaultDescription =
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "A modern blog platform";
  const defaultImage = `${siteUrl}/og-image.png`;

  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : defaultImage;

  const metadata: Metadata = {
    title: `${title} | ${siteName}`,
    description: description || defaultDescription,
    keywords: keywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type: type,
      title: title,
      description: description || defaultDescription,
      url: fullUrl,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description || defaultDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  return metadata;
}

export function generateBlogPostMetadata(post: {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  author: {
    name: string | null;
  };
  category?: {
    name: string;
  } | null;
  tags?: {
    name: string;
  }[];
}): Metadata {
  return generateMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    keywords: post.metaKeywords || undefined,
    image: post.ogImage || post.coverImage || undefined,
    url: `/post/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name || undefined,
    section: post.category?.name,
    tags: post.tags?.map((tag) => tag.name),
  });
}
