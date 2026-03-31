import TagCard from '@/components/(cards)/tagCard/TagCard'
import axios from 'axios';
import React from 'react'

const page = async () => {
  let tags;
  try {
    const res = await axios.get(`${process.env.BASE_URL}/api/tags/get`);
    if (res.data.success) {
      tags = res.data.data;
    }
  } catch (error) {
    // console.log(error);
  }
  return (
    <div>
      <h1 className='mx-auto block font-bold text-3xl my-4'>Explore Tags</h1>
      <div className='flex justify-start items-center flex-wrap'>
        {tags?.map(({ title, value }: {
          title: string;
          value: string[];
        }) => <TagCard key={title} title={title} value={value} />)}

      </div>
    </div>
  )
}

export default page
