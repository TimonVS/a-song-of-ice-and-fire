import {
  type LoaderArgs,
  type V2_MetaFunction,
  json,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { House } from "~/lib/asoiaf-api";
import { parseLinkHeader } from "~/lib/parse-link-header";

export const meta: V2_MetaFunction = () => {
  return [{ title: "A Song of Ice and Fire — overview" }];
};

export default function Index() {
  const { houses, currentPage, hasNextPage, hasPrevPage } =
    useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Houses</h1>
      <ul>
        {houses.map((house) => (
          <li key={house.url}>{house.name}</li>
        ))}
      </ul>
      <nav>
        <ul>
          {hasPrevPage && (
            <li>
              <Link to={`/houses/${currentPage - 1}`}>Prev</Link>
            </li>
          )}
          {hasNextPage && (
            <li>
              <Link to={`/houses/${currentPage + 1}`}>Next</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export async function loader({ params }: LoaderArgs) {
  const parsedPage = params.page ? parseInt(params.page, 10) : 1;
  invariant(!Number.isNaN(parsedPage), "params.page must be of type number");

  const response = await fetch(
    `https://www.anapioficeandfire.com/api/houses?page=${parsedPage}`
  );
  const parsedLinkHeader = parseLinkHeader(response.headers.get("link") ?? "");

  return json({
    houses: (await response.json()) as House[],
    currentPage: parsedPage,
    hasNextPage: "next" in parsedLinkHeader,
    hasPrevPage: "prev" in parsedLinkHeader,
  });
}
