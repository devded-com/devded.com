import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          where: { approved: true, parentId: null },
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
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.post.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check authorization
    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      status,
      published,
      categoryId,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
    } = data;

    let slug = post.slug;
    if (title && title !== post.title) {
      slug = await generateUniqueSlug(title, post.slug);
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        status,
        published,
        publishedAt: published && !post.published ? new Date() : post.publishedAt,
        categoryId,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag: string) => ({
                where: { slug: tag.toLowerCase().replace(/\s+/g, "-") },
                create: {
                  name: tag,
                  slug: tag.toLowerCase().replace(/\s+/g, "-"),
                },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check authorization
    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
