import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: 'd8l1kuhs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const { documentId, blockKey, width } = await req.json();

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        { message: "Missing write token" },
        { status: 500 }
      );
    }

    if (!documentId || !blockKey || width === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the specific block within the body array
    // We target the block where _key matches the provided blockKey
    // and set the imageWidth property
    await client
      .patch(documentId)
      .set({
        [`body[_key=="${blockKey}"].imageWidth`]: width
      })
      .commit();

    return NextResponse.json({ message: "Image updated successfully" });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { message: "Error updating image" },
      { status: 500 }
    );
  }
}
