"use client";

import { Question } from "@/lib/generated/prisma";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormPreviewProps = {
  form: {
    id: string;
    title: string;
    description: string | null;
    questions: Question[];
  };
};
export default function FormPreview({ form }: FormPreviewProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(
    form.questions.map((q) => ({ questionId: q.id, text: "" }))
  );

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => {
      return prev.map((a) =>
        a.questionId === questionId ? { ...a, text } : a
      );
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validate required fields
    const emptyAnswers = answers.some((a) => !a.text.trim());
    if (emptyAnswers) {
      toast.error("All questions are required!");
      return;
    }

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: form.id,
          answers,
          respondentName: name,
          respondentEmail: email,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Response submitted!", {
        description: "Thank you for completing this form.",
      });
      // Reset form
      setAnswers(form.questions.map((q) => ({ questionId: q.id, text: "" })));
      setName("");
      setEmail("");

      // Redirect to thank you page or back to home
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error", {
        description: "Something went wrong while submitting your response.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{form.title}</h1>
        {form.description && (
          <p className="mt-2 text-gray-600">{form.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>Your Name (Optional)</Label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="space-y-4">
          <Label>Your Email (Optional)</Label>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="space-y-6">
          {form.questions
            .sort((a, b) => a.order - b.order)
            .map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label className="font-medium">
                  {index + 1}. {question.text}
                </Label>
                <Textarea
                  placeholder="Your answer"
                  value={
                    answers.find((a) => a.questionId === question.id)?.text ||
                    ""
                  }
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                />
              </div>
            ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Submit Response</Button>
        </div>
      </form>
    </div>
  );
}