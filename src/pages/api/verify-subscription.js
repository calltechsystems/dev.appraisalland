export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { subscriptionID } = req.body;
  if (!subscriptionID) {
    return res.status(400).json({ message: "Missing subscriptionID" });
  }

  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const tokenRes = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const subscriptionRes = await fetch(
      `${baseURL}/v1/billing/subscriptions/${subscriptionID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log({subscriptionRes})

    const subscriptionDetails = await subscriptionRes.json();
    console.log({subscriptionDetails})
    return res.status(200).json({ success: true, data: subscriptionDetails });
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return res
      .status(500)
      .json({ success: false, message: "Subscription verification failed" });
  }
}
