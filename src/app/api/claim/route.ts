import { NextResponse } from "next/server";
import type { ClaimResponse } from "@/utils/types";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const address = body.address;

    if (!address) {
      return NextResponse.json(
        {
          error: "Address is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.clusters.xyz/v0.1/airdrops/pengu/claim/${address}?`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch claim data",
        },
        { status: response.status }
      );
    }

    const claimData = (await response.json()) as ClaimResponse;

    if (!claimData.claim || !Array.isArray(claimData.claim)) {
      return NextResponse.json(
        {
          error: "Invalid claim data received",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        claim: claimData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error", error);

    return NextResponse.json(
      {
        error: "There is an error from the pengu server please try again later",
      },
      { status: 500 }
    );
  }
};
