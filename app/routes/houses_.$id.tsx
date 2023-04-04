import {
  type LoaderArgs,
  type V2_MetaFunction,
  type HeadersFunction,
  json,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { extractId, getCharacter, getHouse } from "~/lib/asoiaf-api";

export const meta: V2_MetaFunction = () => {
  // TODO: update title
  return [{ title: "A Song of Ice and Fire — overview" }];
};

export default function HouseDetail() {
  const { house, members } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{house.name}</h1>
      <h2>Sworn members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.url}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.id, "params.id must be present");

  // TODO: handle non-200 responses
  const house = await getHouse(params.id);
  const members = await Promise.all(
    house.swornMembers.map(extractId).slice(0, 10).map(getCharacter)
  );

  return json(
    {
      house,
      members,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control")!,
  };
};
