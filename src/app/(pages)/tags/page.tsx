import TagCard from "@/components/(cards)/tagCard/TagCard";
import axios from "axios";

export const metadata = {
  title: "Explore Tags | BiyondBytes",
  description: "Browse and discover content by tags on BiyondBytes.",
};

const page = async () => {
  let tags;
  try {
    const res = await axios.get(`${process.env.BASE_URL}/api/tags/get`);
    if (res.data.success) tags = res.data.data;
  } catch (_) {}

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="bb-container max-w-[860px]">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-gray-100">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">Explore</p>
          <h1 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold text-[rgb(9,9,11)] leading-[1.15] mb-3">
            Browse by Topic
          </h1>
          <p className="text-gray-400 text-sm">
            Discover articles organized by topic. Click any tag to find related content.
          </p>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 ? (
          <div className="flex flex-col gap-8">
            {tags.map(({ title, value }: { title: string; value: string[] }) => (
              <TagCard key={title} title={title} value={value} />
            ))}
          </div>
        ) : (
          <div className="py-24 border-t border-dashed border-gray-100">
            <p className="text-gray-400 text-sm">No tags available yet.</p>
            <p className="text-xs text-gray-300 mt-1">Tags will appear once content is published.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
