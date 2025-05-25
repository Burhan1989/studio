
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
import { LogIn, Loader2, ShieldCheck, User, Briefcase, Eye, EyeOff, Users as UsersIcon, UserCog } from "lucide-react"; // Added UsersIcon, UserCog
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/lib/types";

const roles: { value: UserRole; label: string; icon?: React.ElementType }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "teacher", label: "Guru", icon: UserCog }, // Changed icon to UserCog for Guru
  { value: "student", label: "Siswa", icon: User },
  { value: "parent", label: "Orang Tua Murid", icon: UsersIcon }, // Changed icon for Orang Tua
];

const formSchema = z.object({
  role: z.string().min(1, { message: "Silakan pilih peran Anda." }),
  email: z.string().email({ message: "Alamat email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal harus 6 karakter." }),
});

// Kredensial contoh
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "adminpassword";
const STUDENT_EMAIL = "student@example.com";
const STUDENT_PASSWORD = "password";
const TEACHER_EMAIL = "teacher@example.com";
const TEACHER_PASSWORD = "password";
const PARENT_EMAIL = "parent@example.com";
const PARENT_PASSWORD = "password";


export default function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const selectedRole = values.role as UserRole;
    let loginSuccess = false;
    let userName = "Pengguna";
    let userId = String(Math.random());
    let isAdmin = false;

    if (selectedRole === "admin" && values.email === ADMIN_EMAIL && values.password === ADMIN_PASSWORD) {
      loginSuccess = true;
      userName = "Admin AdeptLearn";
      userId = "admin001";
      isAdmin = true;
    } else if (selectedRole === "student" && values.email === STUDENT_EMAIL && values.password === STUDENT_PASSWORD) {
      loginSuccess = true;
      userName = "Siswa Rajin";
      userId = "student001";
    } else if (selectedRole === "teacher" && values.email === TEACHER_EMAIL && values.password === TEACHER_PASSWORD) {
      loginSuccess = true;
      userName = "Guru Inovatif";
      userId = "teacher001";
    } else if (selectedRole === "parent" && values.email === PARENT_EMAIL && values.password === PARENT_PASSWORD) {
      loginSuccess = true;
      userName = "Orang Tua Bijak";
      userId = "parent001";
    }

    if (loginSuccess) {
      login({ 
        id: userId, 
        email: values.email, 
        name: userName, 
        role: selectedRole, 
        isAdmin: isAdmin, 
        username: values.email.split('@')[0] 
      });
      toast({
        title: `Login ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Berhasil`,
        description: `Selamat datang, ${userName}!`,
        action: React.createElement(roles.find(r => r.value === selectedRole)?.icon || LogIn, { className: "w-5 h-5 text-green-500" })
      });
    } else {
      toast({
        title: "Login Gagal",
        description: "Peran, email, atau kata sandi tidak valid.",
        variant: "destructive",
      });
      form.setError("email", { type: "manual", message: " " }); 
      form.setError("password", { type: "manual", message: "Peran, email, atau kata sandi tidak valid." });
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peran Anda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            {role.icon && <role.icon className="w-4 h-4 text-muted-foreground" />}
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
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
        <div className="mt-4 text-xs text-center text-muted-foreground space-y-1">
          <p className="font-semibold">Contoh Kredensial (Pilih Peran yang Sesuai):</p>
          <p>Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}</p>
          <p>Guru: {TEACHER_EMAIL} / {TEACHER_PASSWORD}</p>
          <p>Siswa: {STUDENT_EMAIL} / {STUDENT_PASSWORD}</p>
          <p>Ortu: {PARENT_EMAIL} / {PARENT_PASSWORD}</p>
        </div>
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
