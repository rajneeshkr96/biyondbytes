"use client";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { CornerDownRight, ThumbsUp } from "lucide-react";

interface ReplyComment {
  id: string;
  UserImage: string;
  name: string;
  createdAt: string;
  comment: string;
  ReplyUserName: string;
  UserName: string;
  likesCount: number;
  repliesCount: number;
  BlogId?: string;
}

interface ReplyCommentsCardProps {
  comment: ReplyComment;
  isReply: boolean;
  setIsReply: (value: boolean) => void;
  setReplyUserName: (value: string) => void;
  setReplyId: (value: string) => void;
}

const ReplyCommentsCard: React.FC<ReplyCommentsCardProps> = ({
  comment,
  isReply,
  setIsReply,
  setReplyUserName,
  setReplyId,
}) => {
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(comment.likesCount);

  const handleLike = async () => {
    try {
      await axios.post(`/api/user/comment/like/${comment.id}`);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch {}
  };

  const handleReply = () => {
    setReplyId(comment.id);
    setReplyUserName(comment.UserName || comment.name);
    setIsReply(true);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return days < 7
      ? `${days}d ago`
      : new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <article className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 mt-2 hover:border-gray-200 transition-colors">
      {/* Author row */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
          {comment.UserImage ? (
            <Image src={comment.UserImage} alt={comment.name || "User"} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#462C7D] text-white font-bold text-[10px]">
              {comment.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-xs text-[rgb(9,9,11)] capitalize">{comment.name || "Anonymous"}</span>
            <span className="text-[10px] text-gray-400">{timeAgo(comment.createdAt)}</span>
          </div>
          {comment.ReplyUserName && (
            <span className="text-[10px] text-gray-400">
              replying to <span className="text-[#462C7D] font-medium">@{comment.ReplyUserName}</span>
            </span>
          )}
        </div>
      </div>

      {/* Comment text */}
      <p className="text-xs text-gray-600 leading-relaxed pl-[38px] mb-2.5">
        {comment.comment}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pl-[38px]">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
            liked ? "text-[#462C7D]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <ThumbsUp className={`w-3 h-3 ${liked ? "fill-[#462C7D]" : ""}`} />
          {likesCount > 0 && <span>{likesCount}</span>}
          <span>Like</span>
        </button>

        <button
          onClick={handleReply}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-[#462C7D] transition-colors"
        >
          <CornerDownRight className="w-3 h-3" />
          Reply
        </button>
      </div>
    </article>
  );
};

export default ReplyCommentsCard;