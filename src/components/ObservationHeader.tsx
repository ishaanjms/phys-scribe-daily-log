
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ObservationHeaderProps {
  searchTerm: string;
  selectedDate: string;
  onSearchTerm: (v: string) => void;
  onDate: (d: string) => void;
  onClear: () => void;
  onNew: () => void;
}

export function ObservationHeader({
  searchTerm,
  selectedDate,
  onSearchTerm,
  onDate,
  onClear,
  onNew
}: ObservationHeaderProps) {

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search observations..."
            value={searchTerm}
            onChange={(e) => onSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
          />
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDate(e.target.value)}
          className="w-40 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {(searchTerm || selectedDate) && (
          <Button
            variant="ghost"
            onClick={onClear}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Clear
          </Button>
        )}
      </div>
      <Button
        onClick={onNew}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        New
      </Button>
    </header>
  );
}
