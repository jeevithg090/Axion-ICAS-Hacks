import { useEffect } from "react";

interface Props {
  title?: string;
  description?: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

/** Sets the document title, description and matching social-preview tags. */
export default function SEO({ title, description }: Props) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
  }, [title, description]);
  return null;
}
