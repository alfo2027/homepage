import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  useEffect(() => { document.title = "윤미래 Product Designer"; }, []);
  return (
    <main className="not-found">
      <h1>프로젝트를 찾을 수 없습니다.</h1>
      <Link to="/" state={{ section: "projects" }}>프로젝트 목록으로</Link>
    </main>
  );
}
