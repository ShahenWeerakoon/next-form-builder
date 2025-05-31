import FormBuilder from "@/components/forms/form-builder";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


export default async function CreateFormPage() {
  const { userId, redirectToSignIn } = await auth();
  
  if (!userId) return redirectToSignIn();

  const forms = await prisma.form.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          responses: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <p className="text-gray-500 mt-1">Design your custom form</p>
      </div>
    
      <FormBuilder/>

    </div>
  );
}