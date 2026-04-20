import Link from 'next/link'

const TagCard = ({ title, value }: { title: string; value: string[] }) => {
  return (
    <div className="border-t border-gray-100 pt-6 pb-2">
      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">{title}</p>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Link
            key={tag}
            href={`/search?tags=${tag}`}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 text-sm text-[rgb(9,9,11)] font-medium capitalize hover:bg-[rgb(9,9,11)] hover:text-white hover:border-[rgb(9,9,11)] transition-all duration-150"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TagCard
