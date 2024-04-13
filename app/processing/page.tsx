import PaddleClient from "@/lib/paddleClient";
import { BoathouseApi } from "../../lib/boathouseApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";
export default async function Home({
  searchParams,
}: {
  searchParams: { pids: string };
}) {
  // Server Action
  async function getData() {
    ("use server");

    let priceIds = searchParams.pids.split(",");

    var paddleCustomerId = cookies().get("PaddleCustomerID")?.value;

    const boathouse = await new BoathouseApi().getBoathouseResponse(
      null,
      paddleCustomerId
    );

    const checkoutCompleted = priceIds.every((pid) =>
      boathouse?.activeSubscriptions?.some(
        (activePid: string) => activePid.toLowerCase() === pid.toLowerCase()
      )
    );

    // Redirect or render based on the completion status
    if (checkoutCompleted) {
      redirect("/account"); // Adjust redirect URL as needed
    } else {
      return;
    }
  }

  await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-start w-full max-w-5xl flex-1 py-24 gap-6">
        <h1 className="text-xl font-bold">Processing Purchase</h1>

        <meta http-equiv="refresh" content="2" />

        <div className="mt-4 block flex flex-col gap-6">
          <p>
            This is where the app will configure any upgrade settings. Please
            wait a moment...
          </p>
          <div>
            <img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" />
          </div>
        </div>
      </div>
      <PaddleClient />
    </main>
  );
}
