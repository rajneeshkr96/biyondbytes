import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import SubmitButton from '@/components/layoutComponents/Button/SubmitButton';

interface AuthorProps {
    author: { id: string; name: string; image: string; role: string };
    isFollow?: boolean;
    url?: string;
}

const Author: FC<AuthorProps> = ({ author, isFollow = true, url = '' }) => {
    return (
        <div className="flex items-center justify-between flex-wrap gap-6 py-8 my-10 border-y border-gray-100">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 bg-gray-100">
                    <Image src={author.image} alt={author.name} fill className="object-cover" />
                </div>
                <div>
                    <p className="font-bold text-[rgb(9,9,11)] text-base">{author.name}</p>
                    <p className="text-sm text-gray-400">{author.role || 'Author'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <SubmitButton mainClass="px-5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors text-sm">
                    {isFollow ? 'Follow' : 'Unfollow'}
                </SubmitButton>
                <Link href={`https://www.facebook.com/share.php?u=${encodeURIComponent(process.env.BASEURL + url)}`}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                    target="_blank" rel="noreferrer">
                    <FaFacebook className="w-4 h-4" />
                </Link>
                <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(process.env.BASEURL + url)}`}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                    target="_blank" rel="noreferrer">
                    <FaTwitter className="w-4 h-4" />
                </Link>
                <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(process.env.BASEURL + url)}`}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                    target="_blank" rel="noreferrer">
                    <FaLinkedin className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default Author;
