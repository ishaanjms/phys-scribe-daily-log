
import { useState } from "react";
import { X, Save, User, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Observation } from "../pages/Index";

interface ObservationFormProps {
  onSubmit: (observation: Omit<Observation, "id">) => void;
  onClose: () => void;
}

export const ObservationForm = ({ onSubmit, onClose }: ObservationFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    problem: "",
    solution: "",
    outcome: "",
    researcher: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.problem.trim() || !formData.researcher.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target === document.activeElement) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              New Research Observation
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Researcher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="researcher" className="flex items-center gap-2 text-slate-700">
                  <User className="h-4 w-4" />
                  Researcher
                </Label>
                <Input
                  id="researcher"
                  placeholder="Your name or ID"
                  value={formData.researcher}
                  onChange={(e) => setFormData(prev => ({ ...prev, researcher: e.target.value }))}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Problem */}
            <div className="space-y-2">
              <Label htmlFor="problem" className="text-slate-700 font-medium">
                Problem Encountered *
              </Label>
              <Textarea
                id="problem"
                placeholder="Describe the problem or challenge you faced today..."
                value={formData.problem}
                onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Solution */}
            <div className="space-y-2">
              <Label htmlFor="solution" className="text-slate-700 font-medium">
                Solution Applied
              </Label>
              <Textarea
                id="solution"
                placeholder="Describe the approach or solution you tried..."
                value={formData.solution}
                onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Outcome */}
            <div className="space-y-2">
              <Label htmlFor="outcome" className="text-slate-700 font-medium">
                Outcome & Results
              </Label>
              <Textarea
                id="outcome"
                placeholder="What happened? What were the results or next steps?"
                value={formData.outcome}
                onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
                className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-700 font-medium">
                <Hash className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tags (e.g., quantum, experiment, theory)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button type="button" onClick={addTag} variant="outline" className="px-3">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Observation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
