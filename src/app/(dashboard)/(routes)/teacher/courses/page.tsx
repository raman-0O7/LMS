
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'


export default async function CoursesPage() {
  const { userId } = auth();

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
