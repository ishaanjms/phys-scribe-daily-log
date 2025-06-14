
import { useState } from "react";
import { Calendar, User, Trash2, ChevronDown, ChevronUp, Hash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      month: "short",
      day: "numeric",
      year: "numeric",
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
          <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
            {field.value as string}
          </div>
        );
      case 'number':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
            {field.value}
          </div>
        );
      case 'table':
        const tableData = field.value as string[][];
        if (!tableData || tableData.length === 0) return null;
        
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {tableData[0].map((header, index) => (
                    <TableHead key={index} className="font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="border-b border-gray-100 last:border-b-0">
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="text-sm border-r border-gray-100 last:border-r-0">
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
    <div className="group border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(observation.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{observation.researcher}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {observation.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {observation.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Problem</h3>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {observation.problem}
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {observation.solution && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Solution</h3>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {observation.solution}
                  </div>
                </div>
              )}

              {observation.outcome && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Outcome</h3>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {observation.outcome}
                  </div>
                </div>
              )}

              {observation.customFields && observation.customFields.length > 0 && (
                <div className="space-y-4">
                  {observation.customFields.map((field) => (
                    <div key={field.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{field.label}</h3>
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          {field.type}
                        </Badge>
                      </div>
                      {renderCustomField(field)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isExpanded && (observation.solution || observation.outcome) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-gray-500 hover:text-gray-700 text-xs h-7 px-2"
            >
              Show more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
