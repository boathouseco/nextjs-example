import { v4 as uuidv4 } from "uuid";
import { BoathouseApi } from "../../lib/boathouseApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  // Server Action
  async function doLogin() {
    "use server";

    // Generate a random email address
    const randomEmailAddress = `playground-${uuidv4()}@mailexample.com`;

    // Instantiate BoathouseApi with configuration if needed
    const boathouseApi = new BoathouseApi(); // Add configuration as necessary
    const resp = await boathouseApi.getBoathouseResponse(
      randomEmailAddress,
      null
    );

    console.log(resp);

    // Set the cookie with the paddle customer ID from the response
    cookies().set("PaddleCustomerID", resp.paddleCustomerId, {
      httpOnly: true,
    });

    redirect("/account");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-start w-full max-w-5xl flex-1 py-24 gap-6">
        <h1 className="text-xl font-bold">Login</h1>

        <p>
          This is the anonymous pricing table loaded from Boathouse using an
          iframe shown to your website visitors. Click on the button to be
          redirected to the dummy login.
        </p>

        <form action={doLogin}>
          <button className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
