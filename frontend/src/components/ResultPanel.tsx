import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Code2, 
  TrendingUp,
  Copy,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";

interface ResultPanelProps {
  result: any;
  loading: boolean;
}

export function ResultPanel({ result, loading }: ResultPanelProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Analyzing your code...</h3>
              <p className="text-sm text-gray-500">AI is working its magic</p>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full mt-6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <Card className="p-12 text-center">
        <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No results yet. Submit your code to get started.</p>
      </Card>
    );
  }

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {result.message || "An error occurred during analysis"}
        </AlertDescription>
      </Alert>
    );
  }

  // If backend returned structured analysis JSON, render it; otherwise show raw text
  const analysisText = typeof result === "string" ? result : result?.analysis;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Analysis Result</h3>
            <p className="text-sm text-gray-500">AI analysis output from the backend</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{analysisText || "No analysis returned."}</pre>
        </div>
      </Card>

      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Copy All
        </Button>
      </div>
    </div>
  );
}
