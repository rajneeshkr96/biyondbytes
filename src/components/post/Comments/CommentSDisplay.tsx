"use client";
import React, { useCallback, useEffect, useState } from "react";
import CommentsInput from "./CommentsInput";
import CommentCard from "./CommentCard";
import axios from "axios";

interface Comment {
  id: string;
  UserImage: string;
  name: string;
  createdAt: string;
  ReplyUserName?: string;
  comment: string;
  UserName: string;
  likesCount: number;
  repliesCount: number;
  BlogId?: string;
}

const CommentSDisplay: React.FC<{ Blogid: string }> = ({ Blogid }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReply, setIsReply] = useState(false);
  const [replyUserName, setReplyUserName] = useState("");
  const [replyId, setReplyId] = useState("");

  // ─── Fetch once on mount, then only on manual refresh ───────────────
  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`/api/user/comment/get/${Blogid}`);
      if (res.data.success) setComments(res.data.data);
    } catch {}
    finally { setLoading(false); }
  }, [Blogid]); // only Blogid — never state that changes on every render

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 px-4 pb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-xl font-bold text-[rgb(9,9,11)]">
            Discussion
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Comment Input */}
      <CommentsInput
        id={isReply ? replyId : Blogid}
        isReply={isReply}
        replyUserName={replyUserName}
        setIsReply={setIsReply}
        onCommentPosted={fetchComments}
      />

      {/* Divider */}
      {comments.length > 0 && (
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-medium uppercase tracking-widest">Comments</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-24 h-3 bg-gray-200 rounded-full" />
                  <div className="w-16 h-2.5 bg-gray-100 rounded-full" />
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full mb-2" />
              <div className="w-2/3 h-3 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-14">
          <div className="text-3xl mb-3">💬</div>
          <p className="font-semibold text-[rgb(9,9,11)] text-sm">No comments yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts</p>
        </div>
      )}

      {/* Comment list */}
      {!loading && comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          isReply={isReply}
          setIsReply={setIsReply}
          setReplyUserName={setReplyUserName}
          setReplyId={setReplyId}
          onReplyPosted={fetchComments}
        />
      ))}
    </div>
  );
};

export default CommentSDisplay;
