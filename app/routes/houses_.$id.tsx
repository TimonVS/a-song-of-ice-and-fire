import {
  type LoaderArgs,
  type V2_MetaFunction,
  json,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { House } from "~/lib/asoiaf-api";

export const meta: V2_MetaFunction = () => {
  // TODO: update title
  return [{ title: "A Song of Ice and Fire — overview" }];
};

export default function HouseDetail() {
  const { house } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{house.name}</h1>
    </div>
  );
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.id, "params.id must be present");
  const id = parseInt(params.id, 10);

  // TODO: handle NaN

  const response = await fetch(
    `https://www.anapioficeandfire.com/api/houses/${id}`
  );

  return json({
    // TODO: handle non-200 responses
    house: (await response.json()) as House,
  });
}
