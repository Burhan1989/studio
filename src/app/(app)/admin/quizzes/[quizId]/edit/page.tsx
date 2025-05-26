
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, FilePenLine } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminEditQuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilePenLine className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Kuis: {quizId} (Admin)</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/quizzes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kuis Admin
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Formulir Edit Kuis</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan. Antarmuka untuk mengedit detail kuis akan tersedia di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Admin akan dapat mengedit kuis yang ada di iterasi berikutnya.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    