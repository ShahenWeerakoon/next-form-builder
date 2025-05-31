// import { Button } from "@/components/ui/button";
// import { syncUserWithDatabase } from "@/lib/clerk-sync";
// import prisma from "@/lib/db";
// // import { Link } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// export default async function Dashboard(){
//     // const users = await prisma.user.findMany()
//     // console.log(users);
//     //Sync user data whenever they access the dashboard
//     await syncUserWithDatabase();

//     return (
//             <div className="space-y-6">
//                 <div>
//                     <h1 className="text-3xl font-bold">Welcome, Shahen</h1>
//                     <p className="text-gray-500 mt-1">manage your forms and responses</p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                     <div className="bg-white rounded-lg shadow p-6 border">
//                         <h2 className="text-xl font-medium">Your Forms</h2>
//                         <p className="text-3xl font-bold mt-2">12</p>
//                         <Button className="mt-4" asChild>
//                             <Link href="/dashboard/forms">View All Forms</Link>
//                         </Button>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-6 border">
//                         <h2 className="text-xl font-medium">Total Responces</h2>
//                         <p className="text-3xl font-bold mt-2">100</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-6 border">
//                         <h2 className="text-xl font-medium">Create New</h2>
//                         <p className="text-gray-500 mt-2">Start building a new form</p>
//                         <Button className="mt-4" asChild>
//                             <Link href="/dashboard/forms/create">Create Form</Link>
//                         </Button>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-6 border">
//                     <h2 className="text-xl font-medium mb-4">Recent Forms</h2>
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between border-b pb-4">
//                             <div>
//                                 <h3 className="font-medium">This is the title</h3>
//                                 <p>responses · Created on 21 April 2025</p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button>
//                                     <Link href={`/dashboard/forms/123`}>View</Link>
//                                 </Button>
//                                 <Button>
//                                 <Link href={`/dashboard/forms/123/responses`}> Responses </Link>
//                                 </Button>
//                             </div>
//                         </div>
                        
//                     </div>
//                 </div>
//             </div>
//     );

// }

import { Button } from "@/components/ui/button";
import { syncUserWithDatabase } from "@/lib/clerk-sync";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Dashboard() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  // Sync user data whenever they access the dashboard
  await syncUserWithDatabase();

  // Get user's forms and responses counts
  const formsCount = await prisma.form.count({
    where: {
      userId,
    },
  });
  const responseCount = await prisma.formResponse.count({
    where: {
      form: {
        userId,
      },
    },
  });

  // Get recent forms
  const recentForms = await prisma.form.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: { responses: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Shahen</h1>
        <p className="text-gray-500 mt-1">manage your forms and responses</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-xl font-medium">Your Forms</h2>
          <p className="text-3xl font-bold mt-2">{formsCount}</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/forms">View All Forms</Link>
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-xl font-medium">Total Responses</h2>
          <p className="text-3xl font-bold mt-2">{responseCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-xl font-medium">Create New</h2>
          <p className="text-gray-500 mt-2">Start building a new form</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/forms/create">Create Form</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border">
        <h2 className="text-xl font-medium mb-4">Recent Forms</h2>
        {recentForms.length === 0 ? (
          <p>{`You haven't created any forms yet.`}</p>
        ) : (
          <div className="space-y-4">
            {recentForms.map((form) => (
              <div
                className="flex items-center justify-between border-b pb-4"
                key={form.id}
              >
                <div>
                  <h3 className="font-medium">{form.title}</h3>
                  <p className="text-sm text-gray-500">
                    {form._count.responses} responses · Created on{" "}
                    {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Link href={`/dashboard/forms/${form.id}`}>View</Link>
                  </Button>
                  <Button>
                    <Link href={`/dashboard/forms/${form.id}/responses`}>
                      Responses
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-4"></div>
      </div>
    </div>
  );
}