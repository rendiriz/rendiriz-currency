import { Handlers, PageProps } from "$fresh/server.ts";
import Calculate from "../islands/Calculate.tsx";

interface Currency {
  date: string;
  rate: number;
  symbol: string;
  name: string;
}

const base = "idr";

export const handler: Handlers<Currency[] | []> = {
  async GET(_, ctx) {
    const currs = [
      {
        symbol: "usd",
        name: "United States Dollar",
        url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/idr.json",
      },
      {
        symbol: "thb",
        name: "Thai Baht",
        url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/thb/idr.json",
      },
    ];

    const resp = await Promise.all(
      currs.map(async (curr) => {
        const resp = await fetch(curr.url);
        const data = await resp.json();

        const date = new Date(data.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return {
          date,
          rate: data.idr.toFixed(2),
          symbol: curr.symbol,
          name: curr.name,
        };
      })
    );

    if (Array.isArray(resp) && resp.length) {
      return ctx.render(resp);
    }

    return ctx.render([]);
  },
};

export default function Home({ data }: PageProps<Currency[] | []>) {
  if (!data) {
    return <h1>Data not found</h1>;
  }

  return (
    <div class="mx-auto max-w-4xl px-4 my-12 mb-24">
      <div class="flex flex-col gap-10">
        <h1 class="text-5xl">Currency</h1>
        <div class="flex flex-col gap-4">
          {data.map((row) => (
            <>
              <div class="flex flex-col gap-1">
                <div class="text(xs gray-500)">{row.date}</div>
                <div class="uppercase font-bold">
                  {row.symbol} = {row.name}
                </div>
                <div>
                  {Number(row.rate).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  <span class="uppercase">{row.symbol}</span>
                </div>
                <div class="flex flex-col gap-2 mt-3">
                  <Calculate rate={row.rate} base={base} symbol={row.symbol} />
                </div>
              </div>
              <hr class="my-4" />
            </>
          ))}
        </div>
        <div class="mx-auto">
          <a href="https://fresh.deno.dev">
            <img
              width="197"
              height="37"
              src="https://fresh.deno.dev/fresh-badge.svg"
              alt="Made with Fresh"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
