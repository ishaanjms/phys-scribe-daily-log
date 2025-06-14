import { Calendar, BookOpen, Plus, FileText, Settings, Home, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Select } from "@/components/ui/select";

interface AppSidebarProps {
  onNewEntry: () => void;
  totalObservations: number;
  todayObservations: number;
  sortKey?: "date" | "researcher" | "id";
  setSortKey?: (v: "date" | "researcher" | "id") => void;
}

export function AppSidebar({ onNewEntry, totalObservations, todayObservations, sortKey, setSortKey }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex items-center justify-center">
            <BookOpen className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Eureka Notebook</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                  <Home className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span>All Observations</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{totalObservations}</span>
                </SidebarMenuButton>
                {/* Sort dropdown under All Observations */}
                {setSortKey && (
                  <div className="px-6 pt-2 pb-2">
                    <label htmlFor="sort-observations" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Sort by:
                    </label>
                    <select
                      id="sort-observations"
                      value={sortKey}
                      onChange={e => setSortKey(e.target.value as "date" | "researcher")}
                      className="w-full text-xs rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1"
                    >
                      <option value="date">Date (Newest)</option>
                      <option value="researcher">Researcher</option>
                    </select>
                  </div>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span>Today</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{todayObservations}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Button
              onClick={onNewEntry}
              className="w-full justify-start bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 border-0 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Observation
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
        <div className="px-2">
          <ThemeToggle />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <a href="/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
