import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const address = body.address;

    const eligibility = await fetch(
      `https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/${address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const eligibilityData = await eligibility.json();

    console.log("eligibilityData", eligibilityData);

    return NextResponse.json(
      {
        eligibility: eligibilityData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error", error);

    Response.json(
      {
        error: "There is an error from the pengu server please try again later",
      },
      { status: 500 }
    );
  }
};
