
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { useCurrentUser } from '@/hooks/use-current-user'
import { auth } from '@/auth'


export default async function CoursesPage() {
  const session = await auth();

  const userId = session?.user?.id;

  if(!userId) {
    return redirect("/");
  }

  const course = await db.course.findMany({
    where: {
      userId
    },
    orderBy: {
      title: "asc"
    }
  });


  return (
    <div className='p-6'>
      <DataTable columns={columns} data={course} />
    </div>
  )
}
