import React, { useEffect, useState } from "react";
import Image from "next/image";
import DropDown from "@/components/layoutComponents/Button/Dropdown";
import Link from "next/link";
import axios from "axios";
import ReplyCommentsCard from "./ReplyCommentsCard";
import { CornerDownRight, ThumbsDown, ThumbsUp, Edit, Trash2, AlertTriangle } from "lucide-react";

interface CommentCardProps {
  comment: {
    UserImage: string;
    name: string;
    createdAt: string;
    comment: string;
    UserName: string;
    ReplyUserName?: string;
    likesCount: number;
    repliesCount: number;
    id: string;
    Blogid?: string;
  };
}

const CommentCard: React.FC<
  CommentCardProps & {
    isReply: boolean;
    setIsReply: (value: boolean) => void;
    setReplyUserName: (value: string) => void;
    setReplyId: (value: string) => void;
    setReplyComments: (value: Array<CommentCardProps[]>) => void;
  }
> = ({
  comment,
  isReply,
  setIsReply,
  setReplyUserName,
  setReplyId,
  setReplyComments,
}) => {
  const [seeReply, setSeeReply] = useState([]);
  const [seeReplyComments, setSeeReplyComments] = useState<boolean>(false);
  let success = false;
  
  const addRemoveLike = async (commentsId: string) => {
    try {
      const res = await axios.post(`/api/user/comment/like/${commentsId}`);
      success = true;
      return null;
    } catch (error) {
      success = false;
      return null;
    }
  };
  
  const replyTocomment = (commentsId: string) => {
    setReplyId(commentsId);
    setIsReply(true);
    if (isReply) {
      setReplyUserName(comment.UserName);
    }
    return isReply;
  };

  const commentsElements = [
    {
      name: "Like",
      icon: <ThumbsUp className="w-3.5 h-3.5" />,
      apiFunction: addRemoveLike,
    },
    {
      name: "Reply",
      icon: <CornerDownRight className="w-3.5 h-3.5" />,
      apiFunction: replyTocomment,
    },
  ];
  
  const dropdownElements = [
    {
      name: "Edit",
      icon: <Edit className="w-4 h-4" />,
      className: "text-white hover:text-bb-accent",
    },
    {
      name: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      className: "text-red-400 hover:text-red-300",
    },
    {
      name: "Report",
      icon: <AlertTriangle className="w-4 h-4" />,
      className: "text-yellow-500 hover:text-yellow-400",
    },
  ];
  
  const handleClickReplyComments = async (commentsId: string) => {
    try {
      const res = await axios.get(`/api/user/comment/get/reply/${commentsId}`);
      if (res.data.success) {
        setSeeReplyComments(true);
        setSeeReply(res.data.data);
        setReplyComments(res.data.data);
      }
    } catch (error) {
    }
  };

  return (
    <>
      <article className="text-base bg-white rounded-xl px-5 py-4 mt-4 border border-gray-100">
        <footer className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Image
              width={32}
              height={32}
              className="mr-3 w-8 h-8 rounded-full border border-white/10"
              src={
                comment.UserImage
                  ? comment.UserImage
                  : "https://lh3.googleusercontent.com/a/ACg8ocKGKHmisSQpCqk2ykJStKwGDGu95aV_zi976oOn06DbmV8=s96-c"
              }
              alt={comment.name}
            />
            <div>
              <p className="inline-flex items-center font-semibold text-sm text-[rgb(9,9,11)] capitalize mr-3">
                {comment.name}
              </p>
              <p className="text-xs text-bb-muted">
                <time dateTime={comment.createdAt}>
                  {comment.createdAt.split("T")[0]}
                </time>
              </p>
            </div>
          </div>
          <DropDown
            className="text-white"
            content={dropdownElements}
          ></DropDown>
        </footer>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {comment.comment}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            {commentsElements.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-400 hover:text-bb-accent transition-colors"
                onClick={async (event) => {
                  event.preventDefault();
                  try {
                    await item.apiFunction(comment.id);
                  } catch (error) {}
                }}
              >
                {item.icon}
                <span>
                  {item.name === "Like" ? comment?.likesCount : ""} {item.name}
                </span>
              </div>
            ))}
          </div>
          
          {comment.repliesCount > 0 && (
            <button
              onClick={() => handleClickReplyComments(comment.id)}
              className="text-xs font-medium text-bb-accent hover:text-bb-accent/80 transition-colors"
            >
              View all {comment.repliesCount} replies
            </button>
          )}
        </div>
      </article>
      
      {seeReplyComments && seeReply.length > 0 && (
        <div className="pl-6 ml-4 mt-2 border-l border-gray-100 flex flex-col gap-2">
          {seeReply.map((replyComment: any, index) => (
            <ReplyCommentsCard 
              key={index} 
              comment={replyComment} 
              setIsReply={setIsReply}
              isReply
              setReplyUserName={setReplyUserName}
              setReplyId={setReplyId}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CommentCard;
