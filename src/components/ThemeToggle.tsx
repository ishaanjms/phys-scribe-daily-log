
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="theme-toggle" className="text-sm text-gray-600 dark:text-gray-300">
        Light
      </Label>
      <Switch
        id="theme-toggle"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
      <Label htmlFor="theme-toggle" className="text-sm text-gray-600 dark:text-gray-300">
        Dark
      </Label>
    </div>
  );
}
