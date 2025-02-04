import { prisma_client } from "@/app/DB/client";
import { getUserId } from "@/lib/getUserId";
import { newMonitor } from "@/lib/type";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const userId: string = await getUserId();
    const body: newMonitor = await req.json();

    const targetDomain = extractDomain(body.url);

    const newMonitor = await prisma_client.url.create({
      data: {
        ...body,
        userId: userId,
        targetDomain,
      },
    });

    return Response.json(
      {
        success: true,
        message: "successfully created ",
        data: newMonitor,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return Response.json(
      {
        success: false,
        message: "something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.hostname.replace(/^www\./, "");
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
}


