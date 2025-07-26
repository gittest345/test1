import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '../../../lib/blog'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

/**
 * 生成静态路径
 * @returns 静态路径配置
 */
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

/**
 * 博客文章详情页面组件
 * @param params - 路由参数
 * @returns JSX元素
 */
export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 返回首页
          </Link>
        </div>
      </nav>

      {/* 文章内容 */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-4">
                <span>作者: {post.author}</span>
                <span>•</span>
                <span>{post.publishDate}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </header>

          {/* 文章正文 */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>
      </article>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← 返回首页
            </Link>
            <p className="text-gray-600">
              © 2024 我的博客. 使用 Next.js 构建
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}