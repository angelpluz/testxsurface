import { NextResponse } from "next/server";

import {
  explodeContacts,
  namesByAgeRangeSorted,
  renderBulletListFromNames,
  sampleInputA,
  sampleInputB,
  sampleInputC,
  transformContactsByCode,
} from "@/lib/pt1";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minAgeParam = searchParams.get("minAge");
  const maxAgeParam = searchParams.get("maxAge");

  let minAge = Number(minAgeParam);
  let maxAge = Number(maxAgeParam);
  if (!Number.isFinite(minAge)) minAge = 9;
  if (!Number.isFinite(maxAge)) maxAge = 30;
  if (minAge > maxAge) [minAge, maxAge] = [maxAge, minAge];

  const outputA = transformContactsByCode(sampleInputA);
  const outputB = explodeContacts(sampleInputB);
  const outputC = namesByAgeRangeSorted(sampleInputC, minAge, maxAge);
  const outputD = renderBulletListFromNames(outputC);

  return NextResponse.json({
    success: true,
    minAge,
    maxAge,
    outputs: {
      A: outputA,
      B: outputB,
      C: outputC,
      D: outputD,
    },
  });
}
