
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  email: z.string().email({ message: "Alamat email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal harus 6 karakter." }),
});

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "adminpassword";

export default function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (values.email === ADMIN_EMAIL && values.password === ADMIN_PASSWORD) {
      login({ id: "admin001", email: values.email, name: "Admin AdeptLearn", isAdmin: true });
      toast({
        title: "Login Admin Berhasil",
        description: "Selamat datang, Admin!",
        action: <ShieldCheck className="w-5 h-5 text-green-500" />
      });
    } else if (values.email === "user@example.com" && values.password === "password") {
      login({ id: "1", email: values.email, name: "Pengguna Tes" });
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali di AdeptLearn!",
      });
    } else {
      toast({
        title: "Login Gagal",
        description: "Email atau kata sandi tidak valid.",
        variant: "destructive",
      });
      form.setError("email", { type: "manual", message: " " }); 
      form.setError("password", { type: "manual", message: "Email atau kata sandi tidak valid." });
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Selamat Datang Kembali!</CardTitle>
        <CardDescription>Masuk untuk melanjutkan perjalanan belajar Anda di AdeptLearn.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="anda@contoh.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Masuk
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
