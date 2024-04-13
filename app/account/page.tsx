import PaddleClient from "@/lib/paddleClient";
import { BoathouseApi } from "../../lib/boathouseApi";
import { cookies } from "next/headers";
import InnerHTML from "dangerously-set-html-content";

export default async function Home() {
  // Server Action
  async function getData() {
    ("use server");

    var returnUrl = `http://localhost:3000/account`;

    var paddleCustomerId = cookies().get("PaddleCustomerID")?.value;

    const boathouse = await new BoathouseApi().getBoathouseResponse(
      null,
      paddleCustomerId,
      returnUrl
    );

    return {
      paddleCustomerId,
      boathouse,
    };
  }

  var d = await getData();
  const { paddleCustomerId, boathouse } = d;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-start w-full max-w-5xl flex-1 py-24 gap-6">
        <h1 className="text-xl font-bold">Account Page</h1>

        <p>
          You are logged in to this application as Paddle Customer ID{" "}
          <b>{paddleCustomerId}</b>.
        </p>

        <p>This is the return value from the Boathouse API:</p>
        <div className="max-w-[60em] overflow-scroll">
          <pre>{JSON.stringify(boathouse, null, 2)}</pre>
        </div>

        {boathouse.activeSubscriptions.length == 0 ? (
          <>
            <div className="font-bold">
              This is the pricing table that Boathouse generates for you from
              your plan configuration. You can subscribe to a plan using the
              test credit card information below
            </div>

            <div style={{ margin: "5em 0" }}>
              {/* 
                If you are using the standard dangerouslySetInnerHTML, the pricing script in the pricing table will not execute.
                This component will render the HTML _and_ execute the script
                */}
              <InnerHTML html={boathouse.pricingTableHtml} />
            </div>

            <div className="border border-red-500 rounded-xl p-5 bg-red-50 text-base">
              <div className="text-lg font-bold">
                Use this test credit card for the checkout
              </div>

              <ul>
                <li>Card: 4000 0566 5566 5556</li>
                <li>Name: Any</li>
                <li>CVC: 100</li>
                <li>
                  Expiry: {new Date().getMonth()}/{new Date().getFullYear()}
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="border border-emerald-500 rounded-xl p-5 bg-emerald-50 text-base">
              <div className="text-lg font-bold">
                You have an active subscription
              </div>
              <div>
                Click here to open your{" "}
                <a
                  className="underline text-emerald-600"
                  href={boathouse.billingPortalUrl}
                >
                  billing portal
                </a>
                .
              </div>
            </div>
          </>
        )}
      </div>
      <PaddleClient />
    </main>
  );
}
