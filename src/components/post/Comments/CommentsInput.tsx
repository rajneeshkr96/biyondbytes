"use client";
import React,{useEffect, useState} from "react";
import { SendHorizontal } from "lucide-react";
import MediaQuery from "@/components/layoutComponents/MediaQuery";
import SubmitButton from "@/components/layoutComponents/Button/SubmitButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm,SubmitHandler, set  } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";

type CommentsInputProps = {
  comment:string;
};

interface CommentsInputPropsd {
  id:string;
  isReply?:boolean;
  setIsReply?:(value:boolean)=>void;
  replyUserName?:string;
}

const CommentsInput:React.FC<CommentsInputPropsd> = ({id,isReply,setIsReply,replyUserName}) => {
  const [comment, setComment] = useState<Boolean>(false);

  const validateSchema = yup.object().shape({
    comment: yup.string().required()
    .max(500)
    .min(6),
  });
  
  const forOptions = {resolver:yupResolver(validateSchema)};
  const {register,handleSubmit,formState:{errors},watch,reset,setFocus} = useForm<CommentsInputProps>(forOptions);
  
  const onSubmit: SubmitHandler<CommentsInputProps> = async data => {
      try {
        if(isReply){
          const res = await axios.post(`/api/user/comment/reply/add/${id}`,data);
          if(res){
            setIsReply && setIsReply(true);
            setComment(false);
            reset();
          }
        }else{
          const res = await axios.post(`/api/user/comment/add/${id}`,data);
       
          if(res){
            setComment(false);
            reset();
          }
        }
    } catch (error) {
    }
  };
  
  const watchedComment = watch("comment", "");
  
  useEffect(() => {
    if (watchedComment.length > 0) {
      setComment(true);
    } else {
      setComment(false);
    }
  }, [watchedComment,isReply]);
 
  if(isReply){
    setFocus("comment");
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full" action="#">
        <div className="relative w-full min-w-[200px] h-auto">
          <MediaQuery maxSize={999}>
            <div className="absolute grid w-5 h-5 place-items-center text-bb-muted top-2/4 right-3 -translate-y-2/4">
              <button className="!bg-none !border-none p-0 m-0 hover:text-bb-accent transition-colors">
                <SendHorizontal
                  type="submit"
                  className="cursor-pointer max-sm:w-4 max-sm:h-4 text-xl"
                />
              </button>
            </div>
          </MediaQuery>
          <MediaQuery minSize={1000}>
            {comment ? (
              <div className="absolute right-0 top-12 flex flex-row-reverse gap-4 my-1">
                <SubmitButton
                  type="submit"
                  mainClass="px-5 py-2 border border-bb-accent bg-bb-accent hover:bg-[#00E5C0] text-[#0A0A0A] font-medium rounded-full text-sm transition-all"
                >Comment</SubmitButton>
                
                <SubmitButton
                  type="reset"
                  mainClass="px-5 py-2 border border-gray-200 text-gray-500 bg-transparent hover:bg-gray-100 rounded-full font-medium text-sm transition-all"
                >cancel</SubmitButton>
              </div>
            ) : (
              ""
            )}
          </MediaQuery>
          <input
            {...register("comment", {
              onBlur: () => {
                (setIsReply && !comment) && setIsReply(false);
              },
              required: "Comment is required",
              maxLength: 500,
            })}
            className="peer w-full h-full bg-transparent text-gray-800 placeholder-transparent border-b-2 border-gray-200 focus:border-bb-accent outline-none text-sm px-1 py-4 transition-all"
            placeholder=" "
          />
          {errors.comment && (
            <p className="text-red-400 text-xs mt-1">{errors.comment.message}</p>
          )}
          <label className="absolute left-1 top-4 text-sm text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-bb-accent pointer-events-none">
            {isReply ? `Reply to ${replyUserName}` : "Add a comment..."}
          </label>
        </div>
      </form>
    </div>
  );
};

export default CommentsInput;
