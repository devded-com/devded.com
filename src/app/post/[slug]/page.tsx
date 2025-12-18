import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { generateBlogPostMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: true,
      tags: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return generateBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      category: true,
      tags: true,
      comments: {
        where: {
          approved: true,
          parentId: null,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

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

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <article>
          {/* Post Header */}
          <header className="mb-8">
            {post.category && (
              <div className="mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {post.category.name}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-foreground">{post.author.name}</div>
                  <div className="text-sm">
                    {post.publishedAt && format(post.publishedAt, "MMMM d, yyyy")}
                  </div>
                </div>
              </div>
              <span>•</span>
              <span>{post.views} views</span>
              <span>•</span>
              <span>{post.comments.length} comments</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-muted text-sm rounded"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {post.coverImage && (
              <div className="relative h-96 w-full overflow-hidden rounded-lg mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          {post.author.bio && (
            <div className="border-t border-b py-8 my-12">
              <div className="flex items-start gap-4">
                {post.author.image && (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2">About {post.author.name}</h3>
                  <p className="text-muted-foreground">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Comments ({post.comments.length})
            </h2>
            {post.comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {comment.author.image && (
                        <Image
                          src={comment.author.image}
                          alt={comment.author.name || "User"}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(comment.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>

                    {comment.replies.length > 0 && (
                      <div className="ml-8 mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border-l-2 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              {reply.author.image && (
                                <Image
                                  src={reply.author.image}
                                  alt={reply.author.name || "User"}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              )}
                              <span className="font-medium text-sm">{reply.author.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(reply.createdAt, "MMM d, yyyy")}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
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
