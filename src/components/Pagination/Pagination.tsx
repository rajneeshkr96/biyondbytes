import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  path: string;
  page: number;
  keyword: string;
  documentCount: number;
  className?: string;
}

function Pagination({ path, page, keyword, documentCount, className = "" }: PaginationProps) {
  const limit = 10;
  const pages = Math.ceil(documentCount / limit);

  if (documentCount <= limit) return null;

  const prevHref = page > 1 ? { pathname: path, query: { keyword, page: page - 1 } } : undefined;
  const nextHref = page < pages ? { pathname: path, query: { keyword, page: page + 1 } } : undefined;

  const btnBase = "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-150";
  const btnActive = `${btnBase} border-[rgb(9,9,11)] text-[rgb(9,9,11)] hover:bg-[rgb(9,9,11)] hover:text-white`;
  const btnDisabled = `${btnBase} border-gray-200 text-gray-300 cursor-not-allowed pointer-events-none`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {prevHref ? (
        <Link href={prevHref} className={btnActive}>
          <ArrowLeft className="w-4 h-4" /> Previous
        </Link>
      ) : (
        <span className={btnDisabled}><ArrowLeft className="w-4 h-4" /> Previous</span>
      )}

      <span className="text-sm text-[rgb(113,113,122)] px-2">
        {page} / {pages}
      </span>

      {nextHref ? (
        <Link href={nextHref} className={btnActive}>
          Next <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={btnDisabled}>Next <ArrowRight className="w-4 h-4" /></span>
      )}
    </div>
  );
}

export default Pagination;
