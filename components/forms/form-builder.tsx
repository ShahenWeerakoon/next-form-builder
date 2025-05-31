
// "use client";

// import { Label } from '@radix-ui/react-label';
// import { title } from 'process';
// import React, { FormEvent, useState } from 'react';
// import { Input } from '../ui/input';
// import { Textarea } from '../ui/textarea';
// import { Button } from '../ui/button';
// import{ v4 as uuidv4} from "uuid"
// import { toast } from 'sonner';
// // import { useRouter } from 'next/router';
// import { useRouter } from 'next/navigation';
// import { resolve } from 'path';
// import { error } from 'console';


// export default function FormBuilder() {

//     const router = useRouter();
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [form, setForm] = useState({
//         title: "",
//         description: "",
//         questions: [
//             {
//                 id: '1',
//                 text: "",
//             },
//         ],
//     });

//     const addQuestion = () => {
//         setForm(prev => ({
//             ...prev,
//             questions: [...prev.questions, {id: uuidv4(), text: ""}],
//         }));
//     };

//     const removeQuestion = (index: number) => {
//         if (form.questions.length > 1) {
//           setForm((prev) => ({
//             ...prev,
//             questions: prev.questions.filter((_, i) => i !== index),
//           }));
//         } else {
//           toast.error("Form must have at least one question");
//         }
//       };

//       const handleQuestionChange = (index: number, value: string) => {
//         const updatedQuestions = [...form.questions];
//         updatedQuestions[index].text = value;
//         setForm({ ...form, questions: updatedQuestions });
//       };

//     const handleSubmit = async (e: FormEvent) =>{
//         e.preventDefault();

//         // validate form
//         if (!form.title.trim()) {
//             toast.error("Title is required");
//             return;
//         }

//         const emptyQuestions = form.questions.some((q) => !q.text.trim());
//             if (emptyQuestions) {
//             toast.error("All questions must have text");
//             return;
//         }

//         try{
//             setIsSubmitting(true);
//             // //simulate the delay 
//             // await new Promise((resolve) => setTimeout(resolve, 2000));

//             const response = await fetch("/api/forms", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(form)
//             });

//             if (!response.ok) {
//                 const error = await response.text();
//                 throw new Error(error);
//             };

//             const data = await response.json();
//             toast.success("Form created!", {
//             description: "Your form has been saved successfully.",
//             });
//             router.push(`/dashboard/forms/${data.id}`);
//             router.refresh();

//         }catch(error){
//             console.error("Error saving form:", error);
//              toast.error("Error", {
//             description: "Something went wrong while saving your form.",
//         });
//         }finally{
//             setIsSubmitting(false);
//         }
//     };
    

//     return (
//         <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="space-y-4">
//             <div>
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                     id="title"
//                     value={form.title}
//                     onChange={(e) => setForm({ ...form, title: e.target.value })}
//                     placeholder="Enter form title"
//                     className="mt-1 border border-gray-300 p-2 rounded"
//                 />
//             </div>

//             <div>
//                 <Label htmlFor="description">Description (Optional)</Label>
//                 <Textarea
//                     id="description"
//                     value={form.description}
//                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                     placeholder="Enter form description"
//                     className="mt-1"
//                  />
//             </div>
//             </div>

//             <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                 <h3 className="tetx-lg font-medium">Questions</h3>
//                 <Button variant="outline" type="button" onClick={addQuestion}>
//                     Add Question
//                 </Button>
//                 </div>

//                 {form.questions.map((question, index) =>(
//                     <div key={question.id} className="space-y-2 p-4 border rounded-md">
//                         <div className="flex items-center justify-between">
//                         <Label htmlFor={`Question-${index}`}>Question {index + 1}</Label>
//                         <Button
//                             variant="ghost"
//                             type="button"
//                             size="sm"
//                             className="text-red-500 hover:text-red-700"
//                             onClick={() => removeQuestion(index)}
//                         >remove</Button>
//                         </div>
//                         <Textarea
//                             id={`Question-${index}`}
//                             value={question.text}
//                             onChange={(e) => handleQuestionChange(index, e.target.value)}
//                             placeholder="Enter your question"
//                             className="mt-1"
//                         />
//                     </div>
//                 ))}
//             </div>
            
//             <div className="flex justify-end gap-2">
//             <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//                 disabled={isSubmitting}
//             >
//             Cancel
//             </Button>

//             <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Create Form"}
//             </Button>
//             </div>
//         </form>
//     );
// }


"use client";

import { FormEvent, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
};
type FormBuilderProps = {
  initialData: {
    id?: string;
    title: string;
    description: string | null;
    questions: Question[];
  };
  isEditing?: boolean;
};
export default function FormBuilder({
  initialData,
  isEditing = false,
}: FormBuilderProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    questions: initialData?.questions || [
      {
        id: "1",
        text: "",
      },
    ],
  });

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { id: uuidv4(), text: "" }],
    }));
  };

  const removeQuestion = (index: number) => {
    if (form.questions.length > 1) {
      setForm((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    } else {
      toast.error("Form must have at least one question");
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].text = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // validate form
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const emptyQuestions = form.questions.some((q) => !q.text.trim());
    if (emptyQuestions) {
      toast.error("All questions must have text");
      return;
    }

    try {
      setIsSubmitting(true);

      const url = isEditing ? `/api/forms/${initialData?.id}` : "/api/forms";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      toast.success(isEditing ? "Form updated!" : "Form created!", {
        description: "Your form has been saved successfully.",
      });
      router.push(`/dashboard/forms/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Error", {
        description: "Something went wrong while saving your form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter form title"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter form description"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="tetx-lg font-medium">Questions</h3>
          <Button variant="outline" type="button" onClick={addQuestion}>
            Add Question
          </Button>
        </div>

        {form.questions.map((question, index) => (
          <div key={question.id} className="space-y-2 p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <Label htmlFor={`Question-${index}`}>Question {index + 1}</Label>
              <Button
                variant="ghost"
                type="button"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeQuestion(index)}
              >
                remove
              </Button>
            </div>
            <Textarea
              id={`Question-${index}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder="Enter your question"
              className="mt-1"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Form"
            : "Create Form"}
        </Button>
      </div>
    </form>
  );
}