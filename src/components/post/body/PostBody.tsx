'use client';
import React, { FC, useEffect, useState } from 'react';

interface BodyProps {
    content: string;
    image: { src: string; alt: string; caption?: string };
}

const PostBody: FC<BodyProps> = ({ content }) => {
    const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Parse headings from content HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const els = doc.querySelectorAll('h2, h3');
        const items = Array.from(els).map((el, i) => {
            const id = `heading-${i}`;
            el.id = id;
            return { id, text: el.textContent || '', level: parseInt(el.tagName[1]) };
        });
        setHeadings(items);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); });
            },
            { rootMargin: '-20% 0% -70% 0%' }
        );
        document.querySelectorAll('h2[id], h3[id]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [headings]);

    return (
        <div className="w-full bg-[#FAFAFA] py-10 md:py-14">
            <div className="max-w-[1100px] mx-auto px-4 md:px-6 flex gap-12 items-start">

                {/* ── Left sticky sidebar ── */}
                {headings.length > 0 && (
                    <aside className="hidden lg:block w-[220px] shrink-0 sticky top-24 self-start">
                        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">In This Article</p>
                        <nav className="flex flex-col gap-2">
                            {headings.map((h) => (
                                <a
                                    key={h.id}
                                    href={`#${h.id}`}
                                    className={`text-sm leading-snug transition-colors ${h.level === 3 ? 'pl-3' : ''} ${activeId === h.id ? 'text-[rgb(9,9,11)] font-semibold' : 'text-gray-400 hover:text-gray-700'}`}
                                >
                                    {h.text}
                                </a>
                            ))}
                        </nav>
                    </aside>
                )}

                {/* ── Main content ── */}
                <article
                    className="flex-1 min-w-0 tiptap !border-none
                        prose prose-zinc prose-lg max-w-none
                        prose-headings:font-serif prose-headings:font-bold prose-headings:text-[rgb(9,9,11)] prose-headings:tracking-tight
                        prose-p:text-[rgb(63,63,70)] prose-p:leading-relaxed prose-p:mb-5
                        prose-a:text-bb-accent prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[rgb(9,9,11)] prose-strong:font-semibold
                        prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:bg-gray-50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-500
                        prose-img:rounded-2xl prose-img:w-full
                        prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:rounded prose-code:px-1
                        prose-pre:bg-[rgb(24,24,27)] prose-pre:text-gray-100 prose-pre:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};

export default PostBody;
