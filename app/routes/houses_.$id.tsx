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
    <div>
      <h2 className="text-3xl mb-4">{house.name}</h2>

      {house.words && (
        <blockquote className="mb-4">
          <p className="text-gray-600 font-serif italic text-xl before:content-[open-quote] after:content-[close-quote]">
            {house.words}
          </p>
        </blockquote>
      )}

      <h3 className="text-2xl mb-2">Sworn members</h3>
      <ul className="space-y-3">
        {members.map((member) => (
          <li key={member.url} className="">
            <h4 className="text-lg font-semibold inline-flex items-center gap-1">
              {member.died && "† "}
              {member.name}
              {member.gender && (
                <span className="text-sm text-gray-600">
                  {member.gender === "Female" ? "♀" : "♂"}
                </span>
              )}
            </h4>
            {member.titles.length > 0 && <p>{member.titles.join(", ")}</p>}
          </li>
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
