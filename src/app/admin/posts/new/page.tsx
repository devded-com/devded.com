"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage,
          status,
          published: status === "PUBLISHED",
          metaTitle,
          metaDescription,
          metaKeywords,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast({
        title: "Success",
        description: `Post ${status === "PUBLISHED" ? "published" : "saved as draft"} successfully!`,
      });

      router.push("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Create New Post</h1>
            <Button variant="ghost" asChild>
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of the post"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your post..."
                  editable={!loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="Custom title for search engines"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Description for search engines (150-160 characters)"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={loading}
            >
              Publish
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
