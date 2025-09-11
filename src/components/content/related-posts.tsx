/**
 * Related Posts - Shows related blog posts
 */

import type { BlogPost } from '@/lib/types/cms'
import { BlogPostCard } from './blog-post-card'

interface RelatedPostsProps {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}