import { formatDate } from '@/tools/FormatDate';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { Clock, ChevronLeft } from 'lucide-react';

interface HeaderProps {
    title: string;
    createdAt: Date;
    readTime: string;
    tags: string[];
    image: { src: string; alt: string; caption?: string };
    author: { id: string; name: string; image: string; role: string };
}

const Header: FC<HeaderProps> = ({ title, createdAt, readTime, image, author }) => {
    return (
        <header className="w-full bg-[#FAFAFA] pt-20">
            <div className="max-w-[860px] mx-auto px-4 md:px-6">

                {/* Top bar: Back to Blog + Date */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/blog" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                    <time className="text-sm text-gray-400">
                        {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                </div>

                {/* Title */}
                <h1 className="font-serif text-[clamp(2rem,5vw,3.2rem)] font-bold text-[rgb(9,9,11)] leading-[1.1] tracking-tight mb-8">
                    {title}
                </h1>

                {/* Author row */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden relative shrink-0 bg-gray-200">
                            <Image src={author.image} alt={author.name} fill className="object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[rgb(9,9,11)] leading-tight">{author.name}</p>
                            <p className="text-xs text-gray-400">{author.role || 'Author'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{readTime}</span>
                    </div>
                </div>

                {/* Hero image */}
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                        src={image.src}
                        alt={image.alt || title}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {image?.caption && (
                    <p className="text-[11px] text-gray-400 mt-2 text-right">{image.caption}</p>
                )}
            </div>
        </header>
    );
};

export default Header;
