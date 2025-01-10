import axios from "axios";
import { Request, RequestHandler } from "express";

export interface AuthenticatedRequest extends Request {
  token?: string; // Add token as an optional property
}

export const generateToken: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const key = process.env.LIVE_CONSUMER_KEY;
    const secret = process.env.LIVE_CONSUMER_SECRET;

    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${auth}`,
      },
    };

    const response = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      config
    );

    const token = response.data.access_token;

    // console.log(token)

    // Attach the token to the request object
    req.token = token;

    // Call next to proceed to the controller
    next();
  } catch (error) {
    console.log("An error occurred generating the token", error);
  }
};
