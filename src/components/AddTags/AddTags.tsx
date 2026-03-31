"use client";
import React, { useEffect, useState } from "react";
import ActionBtn from "../layoutComponents/Button/ActionBtn";
import SubmitButton from "../layoutComponents/Button/SubmitButton";
import axios from "axios";
import Modal from "../Modals/Modal";

const AddTags = () => {
    const [tags,setTags] = useState([]);
    useEffect(() => {
        const getTags = async () =>{
            try {
                const res = await axios.get("/api/tags/get");
                if(res.data.success){
                    setTags(res.data.data);
                }               
            } catch (error) {
                
            }
        }
        getTags();
    }, []);
    const delTag = (id:string,val:string)=>{
        console.log(id,val);
    }
  return (
    <>
    <div >
        {tags?.map(({ id,title, value }: {
            id:string
          title: string;
          value: string[];
        })=><div key={id} className='w-11/12 max-sm:w-full mx-auto my-2 px-10 max-sm:px-0'>
            <div className='flex justify-between items-center px-6 py-2 max-md:px-0'>
                <h2 className='text-gray-600 capitalize'>
                    {title}
                </h2>
                <Modal btnClass='px-4 py-2 text-white bg-black rounded-3xl font-semibold' button="ADD TAG">
                    <div className="px-4 py-2">
                        <input type="text" className="w-full px-8 py-2 rounded-md font-medium  border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white max-md:w-full text-center" placeholder="Enter Tag" />
                        <SubmitButton className="w-full px-4 py-2 bg-black text-white mt-2"  >Add</SubmitButton>
                    </div>
                </Modal>

            </div>
            <div className="px-12 max-md:px-4 flex gap-x-4 flex-wrap gap-y-2">
                {value.map(val=><span key={val} className="flex justify-between gap-x-12 border-solid border-2 border-blue-300  capitalize items-center px-4 py-2 w-fit text-gray-700 font-medium rounded-full shadow-md shadow-[#7dbcffa7]  max-md:px-2 max-md:py-1 max-md:gap-x-8 dark:text-white">
                    {val}
                    <ActionBtn className="w-8 h-8" >
                        <SubmitButton onClick={()=>delTag(id,val)} className="px-4 py-2 text-center" >Delete</SubmitButton>
                    </ActionBtn>
                </span>)}

            </div>
        </div>)}

      
    </div>
    </>
  )
}

export default AddTags
