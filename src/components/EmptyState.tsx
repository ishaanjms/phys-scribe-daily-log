
import { Rocket, Dog, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  observationsCount: number;
  onCreate: () => void;
  onClear?: () => void;
  searchActive?: boolean;
}

export function EmptyState({
  observationsCount,
  onCreate,
  onClear,
  searchActive = false,
}: EmptyStateProps) {
  if (observationsCount === 0) {
    // Rocket: No observations at all
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
          <Rocket className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No observations yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          Begin Your Research Journey
        </p>
        <Button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create first observation
        </Button>
      </div>
    );
  }

  // Puppy: No search match
  return (
    <div className="text-center py-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-yellow-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in hover:scale-105 transition-transform shadow">
        <Dog className="h-12 w-12 text-yellow-400 dark:text-yellow-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        No results found!
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-xs mx-auto">
        {`We couldn't find any observations matching your search.`}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span className="inline-block">
          <span role="img" aria-label="Puppy">🐶</span>
          &nbsp;This puppy couldn't sniff out any results!
        </span>
      </p>
      {searchActive && onClear && (
        <Button
          variant="ghost"
          onClick={onClear}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          Clear search & try again
        </Button>
      )}
    </div>
  );
}
