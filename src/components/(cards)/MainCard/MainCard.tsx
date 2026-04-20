import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export interface CardsProps {
  title: string;
  image: { src: string; alt: string };
  slug: string;
  id: string;
  author: { id: string; name: string; email: string; image: string; role: string };
  createdAt: Date;
  className?: string;
  bookMarked?: boolean;
  tags?: string[];
}

const MainCard: FC<CardsProps> = ({ image, title, slug, author, createdAt, className = "", tags }) => {
  const date = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <article className={`group ${className}`}>
      <Link href={`/post/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-[#111] mb-4">
          <Image
            src={image.src}
            alt={image.alt || title}
            fill
            className="object-cover brightness-90 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:brightness-100"
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div>
          {/* Category tag */}
          {tags?.[0] && (
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400/70 mb-2">
              {tags[0]}
            </p>
          )}

          {/* Title */}
          <h3 className="font-serif text-[0.95rem] font-bold text-[rgb(9,9,11)] leading-snug tracking-tight group-hover:text-gray-600 transition-colors duration-200 line-clamp-2 mb-3">
            {title}
          </h3>

          {/* Author row */}
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
              <Image src={author.image} alt={author.name} fill className="object-cover" />
            </div>
            <span className="text-[11px] font-medium text-gray-500">{author.name}</span>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-[11px] text-gray-400">{date}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MainCard;
