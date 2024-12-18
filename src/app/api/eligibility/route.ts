import { NextResponse } from "next/server";
import { EligibilityResponse } from "@/utils/types";

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

    const eligibility = await fetch(
      `https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/${address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!eligibility.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch eligibility data",
        },
        { status: eligibility.status }
      );
    }

    const eligibilityData = (await eligibility.json()) as EligibilityResponse;

    if (!eligibilityData.total) {
      return NextResponse.json(
        {
          error:
            "There is an error from the pengu server please try again later",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        eligibility: eligibilityData,
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
