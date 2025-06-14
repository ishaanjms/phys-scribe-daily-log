import { useState } from "react";
import { Calendar, User, Trash2, ChevronDown, ChevronUp, Hash, FileText, Lightbulb, Target, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Observation } from "../pages/Index";

interface ObservationCardProps {
  observation: Observation;
  onDelete: (id: string) => void;
}

export const ObservationCard = ({ observation, onDelete }: ObservationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this observation?")) {
      onDelete(observation.id);
    }
  };

  const renderCustomField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <p className="text-slate-600 text-sm whitespace-pre-wrap">
            {field.value as string}
          </p>
        );
      case 'number':
        return (
          <p className="text-slate-600 text-sm font-mono">
            {field.value}
          </p>
        );
      case 'table':
        const tableData = field.value as string[][];
        if (!tableData || tableData.length === 0) return null;
        
        return (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableData[0].map((header, index) => (
                    <TableHead key={index} className="bg-slate-50 font-medium text-slate-700">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="text-sm">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{formatDate(observation.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{observation.researcher}</span>
              </div>
            </div>
            
            {observation.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Hash className="h-3 w-3 text-slate-400" />
                {observation.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-600 hover:text-slate-800"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Problem Preview */}
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
              <FileText className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 mb-1">Problem</h4>
              <p className="text-slate-600 text-sm line-clamp-2">
                {observation.problem}
              </p>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-fade-in">
            <Separator />
            
            {observation.solution && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 mb-1">Solution</h4>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">
                    {observation.solution}
                  </p>
                </div>
              </div>
            )}

            {observation.outcome && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 mb-1">Outcome</h4>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">
                    {observation.outcome}
                  </p>
                </div>
              </div>
            )}

            {/* Custom Fields */}
            {observation.customFields && observation.customFields.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Additional Data
                  </h4>
                  {observation.customFields.map((field) => (
                    <div key={field.id} className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                        <Database className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-slate-800">{field.label}</h5>
                          <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                            {field.type}
                          </Badge>
                        </div>
                        {renderCustomField(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!isExpanded && (observation.solution || observation.outcome) && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              View Solution & Outcome
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
