import Image from "next/image";
import DropDown from "@/components/layoutComponents/Button/Dropdown";
import Link from "next/link";
import axios from "axios";
import { CornerDownRight, ThumbsUp, Edit, Trash2, AlertTriangle } from "lucide-react";

interface CommentCardProps {
    comment: {
      UserImage: string;
      name: string;
      createdAt: string;
      comment: string;
      ReplyUserName: string;
      UserName: string;
      likesCount: number;
      repliesCount: number;
      id: string;
      Blogid?: string;
    };
  }
  const ReplyCommentsCard: React.FC<
  CommentCardProps & {
    isReply: boolean;
    setIsReply: (value: boolean) => void;
    setReplyUserName: (value: string) => void;
    setReplyId: (value: string) => void;
  }
> = ({
  comment,
  isReply,
  setIsReply,
  setReplyUserName,
  setReplyId,
}) => {
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
    
  return (
    <>
      <article className="text-base bg-bb-surface/50 rounded-xl px-5 py-4 mt-3 border border-white/5">
        <footer className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Image
              width={24}
              height={24}
              className="mr-3 w-6 h-6 rounded-full border border-white/10"
              src={
                comment.UserImage
                  ? comment.UserImage
                  : "https://lh3.googleusercontent.com/a/ACg8ocKGKHmisSQpCqk2ykJStKwGDGu95aV_zi976oOn06DbmV8=s96-c"
              }
              alt={comment.UserName}
            />
            <div>
              <div className="flex flex-wrap items-center text-sm">
                <span className="font-semibold text-white capitalize mr-2">
                  {comment.name}
                </span>
                <span className="text-bb-muted text-xs mr-2">reply to</span>
                <Link className="font-medium text-bb-accent hover:underline text-xs" href={`#`}>
                  @{comment.ReplyUserName}
                </Link>
              </div>
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
        
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          {comment.comment}
        </p>
        
        <div className="flex items-center space-x-4">
          {commentsElements.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer flex items-center gap-1.5 text-xs text-bb-muted hover:text-bb-accent transition-colors"
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
      </article>
    </>
  )
}

export default ReplyCommentsCard