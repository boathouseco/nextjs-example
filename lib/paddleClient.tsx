"use client";
import Script from "next/script";

export default function PaddleClient() {
  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={() => {
          (window as any).Paddle.Environment.set("sandbox");
          (window as any).Paddle.Initialize({
            token: "test_ad79b30a7bab65b54ee5213f2b5",
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
    </>
  );
}
