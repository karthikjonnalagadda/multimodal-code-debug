import { useState } from "react";
import { UploadZone } from "./components/UploadZone";
import { ResultPanel } from "./components/ResultPanel";
import { CodeEditor } from "./components/CodeEditor";
import { LanguageSelector } from "./components/LanguageSelector";
import { analyzeImages } from "./services/api";
import { Bug, Sparkles, Code2, ImagePlus } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./components/ui/dialog";

export default function Home() {
  const [language, setLanguage] = useState("auto");
  const [sourceCode, setSourceCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("input");

  const handleFiles = async (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleDebug = async () => {
    if (!sourceCode && uploadedFiles.length === 0) return;
    
    setLoading(true);
    setResult(null);
    setActiveTab("results");
    
    try {
      const res = await analyzeImages(uploadedFiles);
      setResult(res);
    } catch (error) {
      setResult({
        error: true,
        message: "Analysis failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const hasInput = sourceCode.trim().length > 0 || uploadedFiles.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Multimodal Code Debug
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Debug Assistant</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  About
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>About Multimodal Code Debug</DialogTitle>
                <DialogDescription>
                  A concise overview of the project and how to use it.
                </DialogDescription>

                <div className="mt-4 text-sm text-gray-700 space-y-3">
                  <h4 className="font-medium">Overview</h4>
                  <p>
                    Multimodal Code Debug is an AI-powered assistant that helps
                    developers diagnose and fix errors by combining visual
                    context (screenshots) with source code. It extracts text
                    from screenshots using OCR, constructs a focused debugging
                    prompt, and runs a multimodal language model to generate
                    clear explanations and suggested fixes.
                  </p>

                  <h4 className="font-medium">How it works</h4>
                  <p>
                    1) Upload an error screenshot or paste code. 2) The backend
                    runs OCR to extract text, builds a debugging prompt, and
                    forwards it to the analysis model. 3) Results are returned
                    and displayed with explanations, suggested code fixes, and
                    prevention tips.
                  </p>

                  <h4 className="font-medium">Features</h4>
                  <ul className="list-disc list-inside">
                    <li>OCR extraction from screenshots</li>
                    <li>Automatic error identification and explanation</li>
                    <li>Suggested fixes and code snippets</li>
                    <li>Confidence score and prevention recommendations</li>
                  </ul>

                  <h4 className="font-medium">Limitations & Safety</h4>
                  <p>
                    The assistant provides suggestions but cannot run or verify
                    code. Always review and test fixes before applying them in
                    production. The model may sometimes misinterpret images or
                    produce incorrect code — use with caution.
                  </p>

                  <h4 className="font-medium">Contact & Contributing</h4>
                  <p>
                    This is a lightweight developer tool. Contributions and
                    improvements are welcome — open issues or pull requests in
                    the project repository.
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="input" className="gap-2">
              <Code2 className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2" disabled={!result && !loading}>
              <Sparkles className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Code Input */}
              <div className="space-y-6">
                <Card className="p-6 shadow-lg border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold">Source Code</h2>
                  </div>
                  
                  <LanguageSelector value={language} onChange={setLanguage} />
                  
                  <div className="mt-4">
                    <CodeEditor
                      value={sourceCode}
                      onChange={setSourceCode}
                      language={language}
                    />
                  </div>
                </Card>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-6">
                <Card className="p-6 shadow-lg border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <ImagePlus className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold">Error Screenshots</h2>
                  </div>
                  
                  <UploadZone 
                    onFiles={handleFiles}
                    files={uploadedFiles}
                  />
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Upload screenshots of error messages, terminal output, or debugging consoles
                  </p>
                </Card>

                {/* Info cards removed per request */}
              </div>
            </div>

            {/* Debug Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleDebug}
                disabled={!hasInput || loading}
                size="lg"
                className="gap-2 px-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Debug with AI
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <ResultPanel result={result} loading={loading} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Author: karthik
        </div>
      </footer>
    </div>
  );
}
