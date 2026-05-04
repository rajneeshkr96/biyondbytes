"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import ReplyCommentsCard from "./ReplyCommentsCard";
import { CornerDownRight, ThumbsUp } from "lucide-react";

interface CommentData {
  id: string;
  UserImage: string;
  name: string;
  createdAt: string;
  comment: string;
  UserName: string;
  ReplyUserName?: string;
  likesCount: number;
  repliesCount: number;
  BlogId?: string;
}

interface CommentCardProps {
  comment: CommentData;
  isReply: boolean;
  setIsReply: (value: boolean) => void;
  setReplyUserName: (value: string) => void;
  setReplyId: (value: string) => void;
  onReplyPosted?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  isReply,
  setIsReply,
  setReplyUserName,
  setReplyId,
  onReplyPosted,
}) => {
  const [replies, setReplies] = useState<any[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [loadingReplies, setLoadingReplies] = useState(false);

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

  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    setLoadingReplies(true);
    try {
      const res = await axios.get(`/api/user/comment/get/reply/${comment.id}`);
      if (res.data.success) {
        setReplies(res.data.data);
        setShowReplies(true);
      }
    } catch {}
    finally { setLoadingReplies(false); }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="mt-4">
      <article className="bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-gray-200 transition-colors">
        {/* Author row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            {comment.UserImage ? (
              <Image src={comment.UserImage} alt={comment.name || "User"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#462C7D] text-white font-bold text-xs">
                {comment.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-sm text-[rgb(9,9,11)] capitalize leading-tight">
                {comment.name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
            </div>
            {comment.ReplyUserName && (
              <span className="text-xs text-gray-400">
                replying to <span className="text-[#462C7D] font-medium">@{comment.ReplyUserName}</span>
              </span>
            )}
          </div>
        </div>

        {/* Comment text */}
        <p className="text-sm text-gray-700 leading-relaxed pl-12 mb-3">
          {comment.comment}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 pl-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              liked ? "text-[#462C7D]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-[#462C7D]" : ""}`} />
            {likesCount > 0 && <span>{likesCount}</span>}
            <span>Like</span>
          </button>

          <button
            onClick={handleReply}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#462C7D] transition-colors"
          >
            <CornerDownRight className="w-3.5 h-3.5" />
            Reply
          </button>

          {comment.repliesCount > 0 && (
            <button
              onClick={handleToggleReplies}
              className="flex items-center gap-1 text-xs font-semibold text-[#462C7D] hover:text-[#462C7D]/70 transition-colors ml-auto"
            >
              {loadingReplies ? "Loading…" : showReplies ? "Hide replies" : `View ${comment.repliesCount} repl${comment.repliesCount === 1 ? "y" : "ies"}`}
            </button>
          )}
        </div>
      </article>

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-2 ml-6 pl-4 border-l-2 border-violet-100 flex flex-col gap-2">
          {replies.map((reply: any) => (
            <ReplyCommentsCard
              key={reply.id}
              comment={reply}
              isReply={isReply}
              setIsReply={setIsReply}
              setReplyUserName={setReplyUserName}
              setReplyId={setReplyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
