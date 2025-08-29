import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("GET /api/projects called");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    
    if (!session?.user?.email) {
      console.log("No session or user email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Looking for user with email:", session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.id);
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    console.log("Found projects:", projects.length);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/projects called");
    const session = await getServerSession(authOptions);
    console.log("Session in POST:", session);
    
    if (!session?.user?.email) {
      console.log("No session or user email in POST");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Looking for user with email:", session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found in database for POST");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found for POST:", user.id);
    const body = await request.json();
    console.log("Request body:", body);
    
    const { title, description, content, type, isPublic } = body;

    console.log("Creating project with data:", { title, description, type, isPublic, userId: user.id });
    const project = await prisma.project.create({
      data: {
        title,
        description,
        content,
        type,
        isPublic: isPublic || false,
        userId: user.id,
      },
    });

    console.log("Project created successfully:", project.id);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}