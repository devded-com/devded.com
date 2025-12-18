import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Users, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Get statistics
  const [postsCount, commentsCount, usersCount, totalViews] = await Promise.all([
    prisma.post.count({
      where: session.user.role === "ADMIN" ? {} : { authorId: session.user.id },
    }),
    prisma.comment.count(),
    session.user.role === "ADMIN" ? prisma.user.count() : Promise.resolve(0),
    prisma.post.aggregate({
      _sum: {
        views: true,
      },
      where: session.user.role === "ADMIN" ? {} : { authorId: session.user.id },
    }),
  ]);

  const recentPosts = await prisma.post.findMany({
    where: session.user.role === "ADMIN" ? {} : { authorId: session.user.id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  const pendingComments = session.user.role === "ADMIN"
    ? await prisma.comment.count({
        where: { approved: false },
      })
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/admin" className="text-2xl font-bold">
              Admin Dashboard
            </Link>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/blog">View Blog</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/posts/new">New Post</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Welcome back, {session.user.name}!
        </h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews._sum.views || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{commentsCount}</div>
              {pendingComments > 0 && (
                <p className="text-xs text-muted-foreground">
                  {pendingComments} pending approval
                </p>
              )}
            </CardContent>
          </Card>

          {session.user.role === "ADMIN" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersCount}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-muted-foreground">No posts yet. Create your first post!</p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <Link href={`/admin/posts/${post.id}`} className="font-medium hover:underline">
                        {post.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {post.status} • {post.views} views • {post._count.comments} comments
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
