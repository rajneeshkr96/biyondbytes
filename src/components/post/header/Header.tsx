
import { formatDate } from '@/tools/FormatDate';
import Image from 'next/image'
import React, { FC } from 'react'


interface HeaderProps {
    title: string,
    createdAt: Date,
    readTime: string,
    tags:string[],
    image: { src: string, alt: string, caption?: string },
    author:{ id: string; name: string, image: string, role: string },
}
const Header: FC<HeaderProps> = ({title, createdAt, readTime,image,tags,author }) => {

    return (
        <header className='text-gray-700 w-full flex flex-col justify-center items-center pt-4 font-serif'>
            <div className='text-sm text-center py-2 flex flex-col gap-y-2'>
                <h1 className='text-5xl max-md:text-2xl text-dark-color font-bold line-clamp-3 px-12 max-md:px-0'>{title}</h1>
                <div >
                    <time dateTime={createdAt.toString()}>Published {formatDate(createdAt)}</time> 
                </div>    

            </div>
            <div className='flex items-center px-12 justify-center gap-2 max-w-[799px] mx-auto ' >
                <Image
                src={author.image}
                alt={author.name}
                width={20}
                height={20}
                className="w-12 h-12 border rounded-full border-white"
            ></Image> <span className='text-center text-sm'> <p className='font-bold'>{author.name}</p><p>{readTime}</p> </span></div>
            <ul className='text-center text-sm flex justify-center flex-wrap gap-2 items-center my-4'>
                {tags?.map((tag:string,index:number) => <li key={index} className='px-2 border-1 border-main-text-color bg-white bg-opacity-60 backdrop-blur-sm text-main-text-color  rounded-3xl'>{tag}</li>)}
            </ul>
            
            <figure className='w-[65%] max-md:!w-full my-6'>
                <Image src={image.src} alt={image.alt} width={300} height={200} className='w-full h-full object-cover max-md:!rounded-md rounded-3xl' />
                {image?.caption && <figcaption className='mx-auto inline-block'>{image.caption}</figcaption>}
            </figure>
        </header>
    )
}

export default Header
