import {
  type LoaderArgs,
  type V2_MetaFunction,
  type HeadersFunction,
  json,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getHouses } from "~/lib/asoiaf-api";

const buttonClasses = "border rounded-lg bg-gray-100 p-2";

export const meta: V2_MetaFunction = () => {
  return [{ title: "A Song of Ice and Fire — overview" }];
};

export default function Houses() {
  const { houses, currentPage, hasNextPage, hasPrevPage } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-3xl mb-4">Houses</h2>
      <ul className="list-disc pl-4 mb-4 space-y-1">
        {houses.map((house) => (
          <li key={house.url}>
            <Link to={`/houses/${house.id}`} className="font-semibold">
              {house.name}
            </Link>
          </li>
        ))}
      </ul>
      <nav>
        <ul className="font-semibold space-x-4">
          {hasPrevPage && (
            <li className="inline">
              <Link
                to={`/houses?page=${currentPage - 1}`}
                className={buttonClasses}
              >
                ← Previous
              </Link>
            </li>
          )}
          {hasNextPage && (
            <li className="inline">
              <Link
                to={`/houses?page=${currentPage + 1}`}
                className={buttonClasses}
              >
                Next →
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const rawPage = url.searchParams.get("page");
  const page = rawPage ? parseInt(rawPage, 10) : 1;
  invariant(!Number.isNaN(page), "page must be of type number");

  return json(
    {
      currentPage: page,
      ...(await getHouses({ page })),
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
