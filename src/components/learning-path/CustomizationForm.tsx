
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateCustomizedLearningPathAction, type LearningPathFormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const learningStylePreferences = [
  { value: "visual", label: "Visual (Graphs, Diagrams)" },
  { value: "auditory", label: "Auditory (Lectures, Discussions)" },
  { value: "kinesthetic", label: "Kinesthetic (Hands-on, Interactive)" },
  { value: "reading-writing", label: "Reading/Writing (Texts, Notes)" },
  { value: "mixed", label: "Mixed (A bit of everything)" },
];

// Client-side schema for react-hook-form
const formSchema = z.object({
  userInteractions: z.string().min(10, { message: "Please describe your typical interactions in at least 10 characters." }),
  quizPerformance: z.string().min(10, { message: "Please describe your quiz performance in at least 10 characters." }),
  learningStylePreferences: z.string().min(1, { message: "Please select your preferred learning style." }),
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }),
});


interface CustomizationFormProps {
  onFormSubmitSuccess: (data: LearningPathFormState) => void;
}

export default function CustomizationForm({ onFormSubmitSuccess }: CustomizationFormProps) {
  const { toast } = useToast();

  const initialState: LearningPathFormState = { message: null, errors: {}, data: undefined };
  const [state, formAction] = useFormState(generateCustomizedLearningPathAction, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInteractions: "",
      quizPerformance: "",
      learningStylePreferences: "",
      topic: "",
    },
  });
  
  // Effect to handle form submission result from server action
  useEffect(() => {
    if (state.message) {
      if (state.data) {
        toast({
          title: "Success!",
          description: state.message,
          variant: "default",
        });
        onFormSubmitSuccess(state);
        form.reset(); // Reset form on successful submission
      } else if (state.errors && Object.keys(state.errors).length > 0) {
         toast({
          title: "Error",
          description: state.message || "Please check the form for errors.",
          variant: "destructive",
        });
        // Set form errors from server action state
        if (state.errors.userInteractions) form.setError("userInteractions", { type: "server", message: state.errors.userInteractions.join(', ') });
        if (state.errors.quizPerformance) form.setError("quizPerformance", { type: "server", message: state.errors.quizPerformance.join(', ') });
        if (state.errors.learningStylePreferences) form.setError("learningStylePreferences", { type: "server", message: state.errors.learningStylePreferences.join(', ') });
        if (state.errors.topic) form.setError("topic", { type: "server", message: state.errors.topic.join(', ') });
        if (state.errors._form) form.setError("root.serverError", { type: "server", message: state.errors._form.join(', ') });

      }
    }
  }, [state, toast, form, onFormSubmitSuccess]);


  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <BrainCircuit className="w-4 h-4 mr-2" />
        )}
        Generate My Learning Path
      </Button>
    );
  }


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Customize Your Learning Path</CardTitle>
        <CardDescription>
          Tell us about your learning habits and preferences. Our AI will generate a personalized path for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} onSubmit={form.handleSubmit(()=>formAction(new FormData(form.control.fieldsRef.current.form)))} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic of Interest</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced JavaScript, Quantum Physics Basics" {...field} />
                  </FormControl>
                  <FormDescription>What subject or skill do you want to learn?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningStylePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Learning Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your learning style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {learningStylePreferences.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>How do you learn best?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userInteractions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typical Platform Interactions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I prefer watching videos then trying examples. I often re-read articles."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Describe how you usually interact with learning materials.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quizPerformance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typical Quiz Performance & Challenges</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I do well on multiple choice but struggle with open-ended questions. I sometimes miss details."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>How do you usually perform on quizzes? What are your common difficulties?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root?.serverError && (
                <FormMessage>{form.formState.errors.root.serverError.message}</FormMessage>
            )}
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
