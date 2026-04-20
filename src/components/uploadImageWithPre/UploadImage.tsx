import React from 'react'
import { TiImage } from "react-icons/ti";
import Image from 'next/image'
import { PreImageProps } from '@/app/(editor)/write/[operation]/page';
const UploadImage = ({preImage,...props}:{preImage:PreImageProps}) => {
  return (
    <div className=" w-full mx-auto sm:max-w-7xl my-2">
    <div className='flex justify-center items-center gap-4 max-h-24 '>
      {preImage.src && <Image src={preImage.src} alt={preImage.alt} width={300} height={400} className='object-fill h-full w-auto' />}
    </div>
    {/* select method  */}
    <div className="flex flex-col items-center justify-center w-full h-auto my-6 bg-white sm:w-full sm:rounded-lg sm:shadow-xl">
      <div className="mt-10 mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Upload your cover Image</h2>
        <p className="text-xs text-gray-500">
          File should be of format .jpg, .jpeg, .png or .svg
        </p>
        <section
          className="relative w-[90%] h-32 mb-10 rounded-lg shadow-inner "
        >
          <div
            className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
          >
            <p className="z-10 text-xs font-light text-center text-gray-500">
              Drag &amp; Drop your files here
            </p>
            <TiImage width={'12px'} />
          </div>
        </section>
      </div>
    </div>
  </div>
  )
}

export default UploadImage
