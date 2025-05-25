
"use client";

import type { CustomizedLearningPath, LearningResource } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ExternalLink, ListChecks, Lightbulb } from "lucide-react";
import Link from "next/link";

interface GeneratedPathDisplayProps {
  pathData: CustomizedLearningPath;
}

const ResourceCard = ({ resource }: { resource: LearningResource }) => (
  <Card className="mb-4 shadow-sm bg-background/70">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{resource.resourceType}</CardTitle>
      <CardDescription>{resource.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button variant="outline" size="sm" asChild>
        <Link href={resource.resourceLink} target="_blank" rel="noopener noreferrer">
          Access Resource <ExternalLink className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default function GeneratedPathDisplay({ pathData }: GeneratedPathDisplayProps) {
  return (
    <Card className="w-full mt-8 shadow-xl bg-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Your Personalized Learning Path</CardTitle>
        <CardDescription>
          Based on your inputs, here&apos;s a learning path tailored for you:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">Learning Path Overview</h3>
          <p className="text-foreground/80">{pathData.learningPathDescription}</p>
        </div>

        {pathData.customQuizzes && pathData.customQuizzes.length > 0 && (
          <div>
            <h3 className="mb-3 text-xl font-semibold text-foreground flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-primary" /> Custom Quizzes
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {pathData.customQuizzes.map((quiz, index) => (
                <AccordionItem value={`quiz-${index}`} key={`quiz-${index}`}>
                  <AccordionTrigger className="text-base font-medium hover:no-underline">
                    Quiz {index + 1}: {quiz.resourceType}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ResourceCard resource={quiz} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {pathData.customLearningResources && pathData.customLearningResources.length > 0 && (
          <div>
            <h3 className="mb-3 text-xl font-semibold text-foreground flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" /> Custom Learning Resources
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {pathData.customLearningResources.map((resource, index) => (
                <AccordionItem value={`resource-${index}`} key={`resource-${index}`}>
                  <AccordionTrigger className="text-base font-medium hover:no-underline">
                     Resource {index + 1}: {resource.resourceType}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ResourceCard resource={resource} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
