"use client";

import { useEffect } from "react";

export default function BrandNameReplacer() {
  useEffect(() => {
    const replaceBrand = (value: string) =>
      value
        .replace(/\bVisioner Virtual Academy\b/g, "Visioners Virtual Academy")
        .replace(/\bVisioner Academy\b/g, "Visioners Academy")
        .replace(/\bVisioner Owner Portal\b/g, "Visioners Owner Portal")
        .replace(/\bVisioner\b/g, "Visioners");

    const updateTextNodes = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) nodes.push(node as Text);
      nodes.forEach((textNode) => {
        const current = textNode.nodeValue || "";
        const next = replaceBrand(current);
        if (next !== current) textNode.nodeValue = next;
      });
    };

    const updateDocumentTitle = () => {
      document.title = replaceBrand(document.title);
    };

    updateTextNodes();
    updateDocumentTitle();

    const observer = new MutationObserver(() => {
      updateTextNodes();
      updateDocumentTitle();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
