import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { generateMetadata as genMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "Blog",
  description: "Read our latest articles and insights",
  url: "/",
});

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      status: "PUBLISHED",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: true,
      tags: true,
      _count: {
        select: {
          comments: {
            where: {
              approved: true,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 20,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              DevDed Blog
            </Link>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to DevDed Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our community
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {post.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      {post.author.image && (
                        <Image
                          src={post.author.image}
                          alt={post.author.name || "Author"}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{post.publishedAt && format(post.publishedAt, "MMM d, yyyy")}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {post.category && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                          {post.category.name}
                        </span>
                      )}
                      <span>{post._count.comments} comments</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t mt-20">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DevDed Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
