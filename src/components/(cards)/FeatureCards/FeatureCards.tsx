import React, { FC } from 'react';
import { CardsProps } from '../MainCard/MainCard';
import Image from 'next/image';
import Link from 'next/link';

interface FeatureCardProps extends CardsProps {
  category?: string;
  className?: string;
}

const FeatureCards: FC<FeatureCardProps> = ({
  image, title, slug, author, createdAt,
  category = "Editorial", className = "", ...props
}) => {
  const date = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <article
      {...props}
      className={`group relative flex flex-col w-[300px] shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 ${className}`}
    >
      {/* Image */}
      <Link href={`/post/${slug}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={image.src}
          alt={image.alt || title}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full border border-white/60">
          {category}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-serif text-[1rem] font-bold text-gray-900 leading-[1.45] line-clamp-2 group-hover:text-bb-accent transition-colors duration-300">
          <Link href={`/post/${slug}`}>{title}</Link>
        </h3>

        {/* Author + date */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <div className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-gray-100 shrink-0">
            <Image src={author.image} alt={author.name} fill className="object-cover" />
          </div>
          <span className="text-[11px] font-semibold text-gray-500 flex-1 truncate">{author.name}</span>
          <span className="text-[11px] text-gray-400 shrink-0">{date}</span>
        </div>
      </div>
    </article>
  );
};

export default FeatureCards;
