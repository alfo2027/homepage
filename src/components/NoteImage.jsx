import { useEffect, useRef, useState } from "react";
import { postAsset } from "../data/posts";

export default function NoteImage({ block }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return <>
    <figure>
      <button ref={trigger} type="button" className="note-image-trigger" aria-label={`${block.alt || "사진"} 크게 보기`} onClick={() => setOpen(true)}>
        <img draggable={false} src={postAsset(block.src)} alt={block.alt || ""} width={block.width} height={block.height} decoding="async" loading="lazy" />
      </button>
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
    <dialog ref={dialog} className="note-image-dialog" aria-label="사진 크게 보기" onCancel={(event) => { event.preventDefault(); setOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      {open && <>
        <button type="button" className="note-image-close" aria-label="사진 닫기" onClick={() => setOpen(false)} autoFocus>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 5 14 14M5 19 19 5" /></svg>
        </button>
        <img draggable={false} src={postAsset(block.src)} alt={block.alt || ""} />
      </>}
    </dialog>
  </>;
}
