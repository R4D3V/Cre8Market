import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getCategories } from "@/lib/db/queries";
import {
  normalizeCategorySlug,
  normalizeCondition,
  normalizeSpecs,
  normalizePrice,
} from "@/lib/ai/normalize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Product title is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI is not configured. Add OPENAI_API_KEY to your environment.",
        },
        { status: 500 },
      );
    }

    const categories = await getCategories();
    const validSlugs = categories.map((category) => category.slug);
    const categoryList = validSlugs.join(", ");

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a product listing assistant for a marketplace in Uganda. Return valid JSON only with this exact shape: {
            "categorySlug": "phones-tablets",
            "condition": "New",
            "description": "Sales-focused description in 1-2 sentences.",
            "specs": "Storage: 256GB\nRAM: 8GB\nColor: Phantom Black",
            "price": "1200000"
          }

          Rules:
          - categorySlug must be one of these exact values: ${categoryList}
          - Use the closest relevant category if the title is a little different.
          - condition must be one of: New, Like New, Used - Good, Used - Fair, Refurbished.
          - description should sound like a clean marketplace listing.
          - specs should be plain text with one item per line using "Label: Value".
          - price must be a string of digits only in UGX, realistic for Uganda.
          - do not include explanatory text outside JSON.`,
        },
        {
          role: "user",
          content: `Generate listing details for: ${title}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI returned an empty response." },
        { status: 500 },
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON." },
        { status: 500 },
      );
    }

    const result = {
      categorySlug: normalizeCategorySlug(
        typeof parsed.categorySlug === "string"
          ? parsed.categorySlug
          : undefined,
        validSlugs,
      ),
      condition: normalizeCondition(
        typeof parsed.condition === "string" ? parsed.condition : undefined,
      ),
      description:
        typeof parsed.description === "string" &&
        parsed.description.trim().length > 0
          ? parsed.description.trim()
          : `Great condition ${title}. Ideal for everyday use and ready to sell.`,
      specs: normalizeSpecs(parsed.specs),
      price: normalizePrice(parsed.price),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI product fill error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate product details.",
      },
      { status: 500 },
    );
  }
}
