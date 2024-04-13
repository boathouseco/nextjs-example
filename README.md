# NextJS Implementation Example for Boathouse Customer Portal for Paddle 

This code will show you all parts necessary to implement Boathouse in your own application:

- Boathouse API call to create a customer and retrieve their status.
- Adding the pricing table to a marketing website (in anonymous mode).
- Adding the pricing table to your app in order to allow user's to subscribe (checkout mode).
- Adding PaddleJS to your app.

## Prerequisites

- A Paddle Account (can be a [sandbox account](https://sandbox-login.paddle.com/signup)),
- at least one product and price configured in Paddle,
- and a [Boathouse Account](https://www.boathouse.pro) with one plan referencing the Paddle price.

## Configuration 

Copy .env.example to .env and enter your Boathouse Portal ID and Secret. 

    BOATHOUSE_API="https://my.boathouse.pro/api/v1"
    BOATHOUSE_PORTAL_ID=""
    BOATHOUSE_SECRET=""

## Recommended Paddle and Boathouse Setup

For the purposes of this example it's recommend to create two products in Paddle.

1. Name "Small" which has two prices: "Small-Monthly" and "Small-Annual"
2. Name "Large" which has two prices: "Large-Monthly" and "Large-Annual"

In Boathouse proceed to the Plans page and add three plans. Set the first one to "Free".
For the second choose "Small-Monthly", click "Customize" and select "Small-Annual" as the corresponding annual plan. 
Repeat for "Large-Monthly" and "Large-Annual".

## Architecture

All Boathouse examples follow the same architecture.

### Index Page

This simulates the logged-out state and will show the pricing table via an IFRAME (in anonymous mode).

The createAccountUrl passed to the IFRAME url references the login page (see next heading).

### Login Page 

This page shows a button which simulates a login. For this example it will simply create a Paddle customer via the Boathouse API (using a random email address) and store the Paddle Customer ID in the browser's cookie. This cookie will imply the user is now logged in.

Here the Boathouse API is called using the email in order to create the customer.

### Account Page

Shows you the Paddle Customer ID you are currently logged-in as and the response that the Boathouse API is currently returning for your user.

Here the Boathouse API is called using the Paddle Customer ID which in your app should be stored along side the user in order to facilitate the user changing their email (which if it was still used for the Boathouse API would create a new customer and lose the link to the existing Paddle customer record and so also to their active subscriptions).

If you have not subscribed this page will show you the pricing table (in checkout mode) which will allow you to subscribe to one of the configured plans.

This account page requires PaddleJS to be installed and configured in order for the checkout to succeed. **For NextJS this requires a client component which is implemented as PaddleClient.tsx.** You will need to replace the token with your own from the Paddle account. If you are moving to production remove the first line which sets the environment to "sandbox".

    <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={() => {
          (window as any).Paddle.Environment.set("sandbox");
          (window as any).Paddle.Initialize({
            token: "<YOUR-PADDLE-CLIENT-TOKEN>",
            eventCallback: (e: {
              name: string;
              data: { items: { price_id: string }[] };
            }) => {
              if (e.name == "checkout.completed")
                location.href =
                  "processing?pids=" +
                  e.data.items
                    .map((x: { price_id: string }) => x.price_id)
                    .join(",");
            },
          });
        }}
      />


### Processing Page

Paddle may take a moment to process the checkout. As Boathouse works directly with Paddle data the example redirects to this processing page to await the successful API result containing the price id that was just purchased.