import { Textarea } from "./ui/textarea";
import { FileCode } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="# Paste your code here...
# Example:
def calculate_sum(a, b):
    return a + b

print(calculate_sum(5, '10'))  # This will cause an error!"
          className="min-h-[400px] font-mono text-sm resize-none bg-slate-50 border-2 focus:bg-white transition-colors"
        />
        {value.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <FileCode className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{value.split('\n').length} lines</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}
