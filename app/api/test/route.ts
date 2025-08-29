import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "Unauthorized", 
        session: null,
        user: null 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "Session working",
      session: {
        user: {
          email: session.user.email,
          name: session.user.name,
          id: session.user.id
        }
      }
    });
  } catch (error) {
    console.error("Error in test route:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
