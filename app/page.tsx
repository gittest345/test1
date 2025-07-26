import Link from 'next/link'
import { getAllPosts } from '../lib/blog'

/**
 * 博客主页组件 - 展示所有博客文章列表
 * @returns JSX元素
 */
export default function Home() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            我的博客
          </h1>
          <p className="text-gray-600 text-center mt-2">
            分享技术心得与生活感悟
          </p>
        </div>
      </header>

      {/* 文章列表 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>作者: {post.author}</span>
                    <span>•</span>
                    <span>{post.publishDate}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    阅读更多 →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2024 我的博客. 使用 Next.js 构建</p>
        </div>
      </footer>
    </main>
  )
}