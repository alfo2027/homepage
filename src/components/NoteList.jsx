import { Link } from "react-router-dom";

export default function NoteList({ posts, headingTag: Heading = "h3" }) {
  return <div className="h-note-list">{posts.map(post => <Link className="h-note-card" key={post.slug} to={`/blog/${post.slug}`}>
    <div className="h-note-copy"><Heading>{post.title}</Heading><p>{post.excerpt}</p></div>
  </Link>)}</div>;
}
