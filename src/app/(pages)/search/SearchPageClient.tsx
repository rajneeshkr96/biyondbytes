'use client';
import Searchbar from "@/components/SearchBar/SearchBar";

export default function SearchPageClient({ defaultValue }: { defaultValue: string }) {
  return <Searchbar defaultValue={defaultValue} size="lg" autoFocus={!defaultValue} />;
}
