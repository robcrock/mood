import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../utils/db";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found, redirecting to sign-up");
    redirect("/sign-up");
  }

  // Check if user already exists in database
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  console.log("Database match:", match);

  if (!match) {
    console.log("Creating new user in database");
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  // By the time we get here, the user should exist in the database
  redirect("/journal");
};

export default async function NewUserPage() {
  await createNewUser();
  // This will only show briefly while redirecting
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="p-4 text-center">Setting up your account...</div>
    </div>
  );
}
