import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";

import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({ 
  params
 }: {
  params: { boardId: string; };
 }) {
  const { orgId } = auth();

  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string; };
}) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  const getRandomColor = () => {
    // Generate random RGB values
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    return randomColor;
  };

  const randomBackgroundColor = getRandomColor();

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundColor: randomBackgroundColor }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">
        {children}
      </main>
    </div>
  );
};

export default BoardIdLayout;
