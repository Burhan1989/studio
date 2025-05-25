
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
  { value: "visual", label: "Visual (Grafik, Diagram)" },
  { value: "auditory", label: "Auditori (Ceramah, Diskusi)" },
  { value: "kinesthetic", label: "Kinestetik (Praktik Langsung, Interaktif)" },
  { value: "reading-writing", label: "Membaca/Menulis (Teks, Catatan)" },
  { value: "mixed", label: "Campuran (Sedikit dari semuanya)" },
];

// Client-side schema for react-hook-form
const formSchema = z.object({
  userInteractions: z.string().min(10, { message: "Mohon deskripsikan interaksi tipikal Anda setidaknya 10 karakter." }),
  quizPerformance: z.string().min(10, { message: "Mohon deskripsikan performa kuis Anda setidaknya 10 karakter." }),
  learningStylePreferences: z.string().min(1, { message: "Mohon pilih preferensi gaya belajar Anda." }),
  topic: z.string().min(3, { message: "Topik minimal harus 3 karakter." }),
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
          title: "Sukses!",
          description: state.message,
          variant: "default",
        });
        onFormSubmitSuccess(state);
        form.reset(); // Reset form on successful submission
      } else if (state.errors && Object.keys(state.errors).length > 0) {
         toast({
          title: "Kesalahan",
          description: state.message || "Silakan periksa formulir untuk kesalahan.",
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
        Buat Jalur Belajar Saya
      </Button>
    );
  }


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Sesuaikan Jalur Belajar Anda</CardTitle>
        <CardDescription>
          Beri tahu kami tentang kebiasaan dan preferensi belajar Anda. AI kami akan membuat jalur yang dipersonalisasi untuk Anda.
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
                  <FormLabel>Topik Minat</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., JavaScript Lanjutan, Dasar-Dasar Fisika Kuantum" {...field} />
                  </FormControl>
                  <FormDescription>Subjek atau keahlian apa yang ingin Anda pelajari?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningStylePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gaya Belajar Pilihan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih gaya belajar Anda" />
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
                  <FormDescription>Bagaimana cara belajar terbaik Anda?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userInteractions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interaksi Platform Umum</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="cth., Saya lebih suka menonton video lalu mencoba contoh. Saya sering membaca ulang artikel."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Deskripsikan bagaimana Anda biasanya berinteraksi dengan materi pembelajaran.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quizPerformance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performa & Tantangan Kuis Umum</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="cth., Saya berhasil baik pada pilihan ganda tetapi kesulitan dengan pertanyaan terbuka. Saya terkadang melewatkan detail."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Bagaimana biasanya performa Anda dalam kuis? Apa kesulitan umum Anda?</FormDescription>
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
