"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { SendHorizontal, X } from "lucide-react";
import { toast } from "react-toastify";

type FormValues = { comment: string };

interface CommentsInputProps {
  id: string;
  isReply?: boolean;
  replyUserName?: string;
  setIsReply?: (value: boolean) => void;
  onCommentPosted?: () => void; // callback to refresh list
}

const schema = yup.object({ comment: yup.string().required().min(6).max(500) });

const CommentsInput: React.FC<CommentsInputProps> = ({
  id,
  isReply,
  replyUserName,
  setIsReply,
  onCommentPosted,
}) => {
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const watchedValue = watch("comment", "");

  // Auto-focus when entering reply mode
  useEffect(() => {
    if (isReply) setFocus("comment");
  }, [isReply, setFocus]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSubmitting(true);
    try {
      if (isReply) {
        await axios.post(`/api/user/comment/reply/add/${id}`, data);
        setIsReply && setIsReply(false);
        toast.success("Reply posted!");
      } else {
        await axios.post(`/api/user/comment/add/${id}`, data);
        toast.success("Comment posted!");
      }
      reset();
      setFocused(false);
      // Trigger parent re-fetch — no more polling needed
      onCommentPosted?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to post. Please sign in.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setFocused(false);
    setIsReply && setIsReply(false);
  };

  return (
    <div className="w-full">
      {isReply && (
        <div className="flex items-center gap-2 text-xs text-[#462C7D] font-medium mb-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
          <span>Replying to <span className="font-bold">@{replyUserName}</span></span>
          <button onClick={handleCancel} className="ml-auto text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div
          className={`relative w-full rounded-2xl border transition-all duration-200 bg-white ${
            focused || isReply
              ? "border-[#462C7D] shadow-sm shadow-violet-100"
              : "border-gray-200"
          }`}
        >
          <textarea
            {...register("comment")}
            rows={focused || isReply ? 3 : 1}
            onFocus={() => setFocused(true)}
            placeholder={isReply ? `Reply to @${replyUserName}…` : "Add a comment…"}
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 px-4 py-3 outline-none resize-none rounded-2xl leading-relaxed"
          />
          <div
            className={`flex items-center justify-between px-3 pb-3 transition-all ${
              focused || watchedValue?.length > 0 || isReply ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
            }`}
          >
            {errors.comment && (
              <p className="text-xs text-red-500">{errors.comment.message}</p>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[rgb(9,9,11)] text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <SendHorizontal className="w-3 h-3" />
                {submitting ? "Posting…" : isReply ? "Reply" : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentsInput;
