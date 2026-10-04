import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories, formatPostDate, postAsset, posts } from "../data/posts";
import "../concepts/blog.css";
import EntryPagination from "./EntryPagination";

function Cover({ post }) {
  return (
    <div className={`blog-cover blog-cover--${post.coverStyle || "type"}`}>
      {post.cover ? <img draggable={false} src={postAsset(post.cover)} alt={post.coverAlt || ""} loading="lazy" /> : (
        <div className="blog-cover-type" aria-hidden="true">
          <span className="blog-cover-label">YOON — JOURNAL</span>
          <strong>{post.coverLabel || post.title}</strong>
          <span className="blog-cover-bottom">{post.category}<span>↗</span></span>
        </div>
      )}
    </div>
  );
}

function Meta({ post }) {
  return <div className="blog-meta"><span>{post.category}</span><time dateTime={post.date}>{formatPostDate(post.date)}</time>{post.isExample && <span>예시 글</span>}</div>;
}

function Block({ block }) {
  switch (block.type) {
    case "heading": return <h2>{block.text}</h2>;
    case "caption": return <p className="blog-caption"><em>{block.text}</em></p>;
    case "link": return <p><a href={block.href} target="_blank" rel="noopener noreferrer">{block.text}</a></p>;
    case "quote": return <blockquote>{block.text}</blockquote>;
    case "list": return <ul>{block.items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
    case "image": return <figure><img draggable={false} src={postAsset(block.src)} alt={block.alt || ""} width={block.width} height={block.height} decoding="async" loading="lazy" />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
    default: return <p className={block.variant === "closing" ? "blog-closing" : undefined}>{block.text}{block.link && <> <a href={block.link.href} target="_blank" rel="noopener noreferrer">{block.link.text}</a></>}</p>;
  }
}

const BackLink = () => <Link className="blog-back" to="/blog"><span aria-hidden="true">←</span> List</Link>;

export default function BlogPanel({ slug }) {
  const [category, setCategory] = useState("All");
  const post = slug ? posts.find((item) => item.slug === slug) : null;
  const postIndex = posts.findIndex(item => item.slug === slug);
  const previousPost = posts[(postIndex - 1 + posts.length) % posts.length];
  const nextPost = posts[(postIndex + 1) % posts.length];
  const visible = category === "All" ? posts : posts.filter((item) => item.category === category);

  useEffect(() => {
    document.title = `${slug ? post?.title || "글을 찾을 수 없습니다" : "Blog"} — 윤미래`;
  }, [slug, post]);

  if (slug && !post) return (
    <div className="blog-panel blog-missing">
      <BackLink />
      <h1 data-blog-heading tabIndex={-1}>글을 찾을 수 없습니다.</h1>
      <p>주소가 변경되었거나 아직 공개되지 않은 글입니다.</p>
    </div>
  );

  if (post) return (
    <article className="blog-panel blog-article">
      <div className="blog-return-top"><BackLink /></div>
      <header className="blog-article-header">
        <h1 data-blog-heading tabIndex={-1}>{post.title}</h1>
        <p>{post.excerpt}</p>
        <time className="blog-article-date" dateTime={post.date}>{formatPostDate(post.date)}</time>
      </header>
      <div className="blog-prose">
        {post.blocks.map((block, index) => <Block key={index} block={block} />)}
      </div>
      {posts.length > 1 && <EntryPagination previous={previousPost} next={nextPost} basePath="/blog" label="이전 및 다음 글" className="blog-pagination" />}
      <div className="blog-return"><BackLink /></div>
    </article>
  );

  return (
    <div className="blog-panel">
      <header className="blog-header">
        <p className="blog-eyebrow">THOUGHTS & RECORDS</p>
        <h1 data-blog-heading tabIndex={-1}>Blog<span aria-hidden="true">{String(posts.length).padStart(2, "0")}</span></h1>
        <p>디자인하며 생각한 것들, 일상에서 발견한 장면들.</p>
      </header>
      <div className="blog-filters" role="group" aria-label="글 카테고리">
        {["All", ...categories].map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        <span className="blog-count" role="status">{visible.length}개의 글</span>
      </div>
      {visible.length ? <div className="blog-grid">
        {visible.map((item) => <Link className="blog-card" key={item.slug} to={`/blog/${item.slug}`} aria-label={`글 읽기: ${item.title}`}>
          <Cover post={item} />
          <div className="blog-card-copy"><Meta post={item} /><h2>{item.title}<span aria-hidden="true">↗</span></h2><p>{item.excerpt}</p></div>
        </Link>)}
      </div> : <div className="blog-empty"><h2>첫 번째 기록을 준비하고 있습니다.</h2><p>곧 이곳에서 새로운 이야기를 만나보세요.</p></div>}
      <footer className="blog-footer">조금씩, 꾸준히 쌓아가는 기록.</footer>
    </div>
  );
}
