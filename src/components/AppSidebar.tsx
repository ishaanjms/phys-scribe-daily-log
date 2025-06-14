
import { Calendar, BookOpen, Search, Plus, FileText, Settings, Home } from "lucide-react";
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

interface AppSidebarProps {
  onNewEntry: () => void;
  totalObservations: number;
  todayObservations: number;
}

export function AppSidebar({ onNewEntry, totalObservations, todayObservations }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex items-center justify-center">
            <BookOpen className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Eureka Notebook</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 rounded-md">
                  <Home className="h-4 w-4" />
                  <span>All Observations</span>
                  <span className="ml-auto text-xs text-gray-500">{totalObservations}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 rounded-md">
                  <Calendar className="h-4 w-4" />
                  <span>Today</span>
                  <span className="ml-auto text-xs text-gray-500">{todayObservations}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 rounded-md">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-2 py-1">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Button
              onClick={onNewEntry}
              className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-0 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Observation
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start hover:bg-gray-100 rounded-md">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
