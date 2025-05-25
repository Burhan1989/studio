
"use client";

import CustomizationForm from "@/components/learning-path/CustomizationForm";
import GeneratedPathDisplay from "@/components/learning-path/GeneratedPathDisplay";
import type { LearningPathFormState } from "@/lib/actions";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function LearningPathPage() {
  const [generatedPath, setGeneratedPath] = useState<LearningPathFormState | null>(null);

  // This key forces GeneratedPathDisplay to re-mount when new data arrives
  // ensuring animations or initial states replay correctly.
  const [displayKey, setDisplayKey] = useState(0);


  const handleFormSuccess = (data: LearningPathFormState) => {
    setGeneratedPath(data);
    if(data.data){ //Only update key if there is new data.
        setDisplayKey(prevKey => prevKey + 1);
    }
  };
  
  useEffect(() => {
    if (generatedPath?.timestamp) { // Check if timestamp exists
        // Logic that depends on generatedPath being updated
    }
  }, [generatedPath?.timestamp]); // Depend on the timestamp

  return (
    <div className="max-w-3xl mx-auto">
      <Alert className="mb-8 border-primary/50 text-primary bg-primary/10">
        <Info className="w-5 h-5 text-primary" />
        <AlertTitle className="font-semibold">AI-Powered Path Customization</AlertTitle>
        <AlertDescription>
          Provide details about your learning preferences, and our AI will generate a tailored learning path, 
          including custom quizzes and resources, to help you achieve your goals more effectively.
        </AlertDescription>
      </Alert>
      
      <CustomizationForm onFormSubmitSuccess={handleFormSuccess} />

      {generatedPath?.data && (
        <GeneratedPathDisplay key={displayKey} pathData={generatedPath.data} />
      )}
    </div>
  );
}
