"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GeneratePromptResponse {
  prompt: string;
}

export default function Home() {
  const [genre, setGenre] = useState<string>("Mystery");
  const [topic, setTopic] = useState<string>("");
  const [complexity, setComplexity] = useState<number>(3);
  const [addTwist, setAddTwist] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generatePrompt = async () => {
    setLoading(true);
    setPrompt(""); // Reset prompt before loading
    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, topic, complexity, addTwist }),
      });
      const data: GeneratePromptResponse = await response.json();
      setPrompt(data.prompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Creative Writing Prompts
          </h1>

          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Genre</label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                  <SelectItem value="Fantasy">Fantasy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Topic</label>
              <Input
                type="text"
                placeholder="Enter a topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Complexity: {complexity}
              </label>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[complexity]}
                onValueChange={(value) => setComplexity(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={addTwist}
                onCheckedChange={setAddTwist}
                id="twist-mode"
              />
              <label
                htmlFor="twist-mode"
                className="text-sm font-medium text-gray-700"
              >
                Add a twist
              </label>
            </div>

            <Button
              onClick={generatePrompt}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Prompt"
              )}
            </Button>
          </div>

          {prompt && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">Your Prompt:</h2>
              <p className="text-gray-700 italic">
                {prompt.split(/(\*\*.*?\*\*)/).map((part, index) => 
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={index} className="font-bold">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
