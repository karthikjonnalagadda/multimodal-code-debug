import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Code2 } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const languages = [
  { value: "auto", label: "Auto Detect", icon: "🔍" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "javascript", label: "JavaScript", icon: "📜" },
  { value: "typescript", label: "TypeScript", icon: "💙" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "csharp", label: "C#", icon: "🎮" },
  { value: "go", label: "Go", icon: "🔷" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "ruby", label: "Ruby", icon: "💎" },
  { value: "php", label: "PHP", icon: "🐘" },
  { value: "swift", label: "Swift", icon: "🍎" },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600 flex items-center gap-2">
        <Code2 className="w-4 h-4" />
        Programming Language
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              <span className="flex items-center gap-2">
                <span>{lang.icon}</span>
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
