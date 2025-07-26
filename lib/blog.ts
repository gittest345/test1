import blogData from '../data/blog-posts.json'

// 博客文章类型定义
export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  tags: string[]
}

/**
 * 获取所有博客文章（直接从JSON读取，不做处理）
 * @returns 博客文章数组
 */
export function getAllPosts(): BlogPost[] {
  return blogData.posts
}

/**
 * 根据slug获取特定博客文章
 * @param slug - 文章的slug标识
 * @returns 博客文章或undefined
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogData.posts.find(post => post.slug === slug)
}