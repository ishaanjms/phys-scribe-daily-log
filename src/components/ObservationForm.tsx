import { useState, useEffect } from "react";
import { X, Save, User, Calendar, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Observation, CustomField } from "../pages/Index";

interface ObservationFormProps {
  onSubmit: (observation: Omit<Observation, "id">) => void;
  onUpdate?: (observation: Observation) => void;
  onClose: () => void;
  editingObservation?: Observation;
}

export const ObservationForm = ({ onSubmit, onUpdate, onClose, editingObservation }: ObservationFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: "",
    problem: "",
    solution: "",
    outcome: "",
    researcher: "",
    tags: [] as string[],
    customFields: [] as CustomField[],
  });

  // Populate form data when editing
  useEffect(() => {
    if (editingObservation) {
      setFormData({
        date: editingObservation.date,
        title: editingObservation.title,
        problem: editingObservation.problem,
        solution: editingObservation.solution,
        outcome: editingObservation.outcome,
        researcher: editingObservation.researcher,
        tags: [],
        customFields: editingObservation.customFields || [],
      });
    }
  }, [editingObservation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.researcher.trim() || !formData.title.trim()) {
      return;
    }
    
    if (editingObservation && onUpdate) {
      onUpdate({
        ...editingObservation,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
  };

  const addCustomField = (type: CustomField['type']) => {
    const newField: CustomField = {
      id: Date.now().toString(),
      type,
      label: "",
      value: type === 'table' ? [['', '']] : type === 'number' ? 0 : "",
    };
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  };

  const removeCustomField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }));
  };

  const clearOptionalField = (fieldName: 'problem' | 'solution' | 'outcome') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ""
    }));
  };

  const updateTableCell = (fieldId: string, rowIndex: number, colIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(field => {
        if (field.id === fieldId && field.type === 'table') {
          const newTable = [...(field.value as string[][])];
          newTable[rowIndex][colIndex] = value;
          return { ...field, value: newTable };
        }
        return field;
      })
    }));
  };

  const addTableRow = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(field => {
        if (field.id === fieldId && field.type === 'table') {
          const currentTable = field.value as string[][];
          const colCount = currentTable[0]?.length || 2;
          const newRow = new Array(colCount).fill('');
          return { ...field, value: [...currentTable, newRow] };
        }
        return field;
      })
    }));
  };

  const addTableColumn = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(field => {
        if (field.id === fieldId && field.type === 'table') {
          const currentTable = field.value as string[][];
          const newTable = currentTable.map(row => [...row, '']);
          return { ...field, value: newTable };
        }
        return field;
      })
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {editingObservation ? "Edit Research Observation" : "New Research Observation"}
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

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-medium">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Brief title for your observation..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Problem - Now Optional */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="problem" className="text-slate-700 font-medium">
                  Problem Encountered
                </Label>
                {formData.problem && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearOptionalField('problem')}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <Textarea
                id="problem"
                placeholder="Describe the problem or challenge you faced today..."
                value={formData.problem}
                onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Solution - Now Optional */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="solution" className="text-slate-700 font-medium">
                  Solution Applied
                </Label>
                {formData.solution && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearOptionalField('solution')}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <Textarea
                id="solution"
                placeholder="Describe the approach or solution you tried..."
                value={formData.solution}
                onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Outcome - Now Optional */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="outcome" className="text-slate-700 font-medium">
                  Outcome & Results
                </Label>
                {formData.outcome && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearOptionalField('outcome')}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <Textarea
                id="outcome"
                placeholder="What happened? What were the results or next steps?"
                value={formData.outcome}
                onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
                className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-medium">Additional Data Fields</Label>
                <Select onValueChange={(value) => addCustomField(value as CustomField['type'])}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add field type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg z-[60]">
                    <SelectItem value="text" className="text-slate-900 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 cursor-pointer">Text Field</SelectItem>
                    <SelectItem value="number" className="text-slate-900 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 cursor-pointer">Numerical Value</SelectItem>
                    <SelectItem value="table" className="text-slate-900 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 cursor-pointer">Data Table</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.customFields.map((field) => (
                <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Field label (e.g., Temperature, Velocity, Results)"
                      value={field.label}
                      onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                      className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {field.type}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomField(field.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {field.type === 'text' && (
                    <Textarea
                      placeholder="Enter text value..."
                      value={field.value as string}
                      onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      type="number"
                      step="any"
                      placeholder="Enter numerical value..."
                      value={field.value as number}
                      onChange={(e) => updateCustomField(field.id, { value: parseFloat(e.target.value) || 0 })}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}

                  {field.type === 'table' && (
                    <div className="space-y-2">
                      <div className="overflow-x-auto">
                        <table className="w-full border border-slate-200 rounded">
                          <tbody>
                            {(field.value as string[][]).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex} className="border border-slate-200 p-1">
                                    <Input
                                      value={cell}
                                      onChange={(e) => updateTableCell(field.id, rowIndex, colIndex, e.target.value)}
                                      className="border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                      placeholder={`${rowIndex === 0 ? 'Header' : 'Data'}`}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTableRow(field.id)}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Row
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTableColumn(field.id)}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Column
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-white"
              >
                <Save className="h-4 w-4 mr-2 text-white" />
                {editingObservation ? "Update Observation" : "Save Observation"}
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
