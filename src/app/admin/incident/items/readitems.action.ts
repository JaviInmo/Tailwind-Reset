"use server"

import prisma from "@/libs/db"

export async function countItems() {
  const count = await prisma.incidentItem.count()
  return count
}
