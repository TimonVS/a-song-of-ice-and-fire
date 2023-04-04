import { parseLinkHeader } from "../parse-link-header";
import type { House, Character } from "./types";

export async function getHouses({ page }: { page: number }): Promise<{
  houses: (House & { id: string })[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const response = await fetch(
    `https://www.anapioficeandfire.com/api/houses?page=${page}`
  );
  const parsedLinkHeader = parseLinkHeader(response.headers.get("link") ?? "");

  const houses = (await response.json()) as House[];

  return {
    houses: houses.map((house) => ({ ...house, id: extractId(house.url) })),
    hasNextPage: "next" in parsedLinkHeader,
    hasPrevPage: "prev" in parsedLinkHeader,
  };
}

export async function getHouse(id: string): Promise<House> {
  const response = await fetch(
    `https://www.anapioficeandfire.com/api/houses/${id}`
  );

  return response.json<House>();
}

export async function getCharacter(id: string): Promise<Character> {
  const response = await fetch(
    `https://www.anapioficeandfire.com/api/characters/${id}`
  );

  return response.json<Character>();
}

export function extractId(url: string): string {
  return url.substring(url.lastIndexOf("/") + 1);
}
