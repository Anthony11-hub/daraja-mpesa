import axios from "axios";
import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { AuthenticatedRequest } from "../middleware/MPESAToken";

export const stkPush: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const { phone, amount } = req.body;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${req.token}`,
      },
    };

    const shortcode = process.env.LIVE_SHORTCODE;
    const passkey = process.env.LIVE_PASS_KEY;

    let password;

    if (shortcode && passkey) {
      password = Buffer.from(shortcode + passkey + timestamp).toString(
        "base64"
      );
    }

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: `254${phone.substring(1)}`,
      PartyB: shortcode,
      PhoneNumber: `254${phone.substring(1)}`,
      CallBackURL: "https://5d27-41-80-113-52.ngrok-free.app/callback",
      AccountReference: `254${phone.substring(1)}`,
      TransactionDesc: "Test",
    };

    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      body,
      config
    );

    if (response.status === 200) {
      res.status(200).json({ message: "Successful", data: response.data });
    } else {
      res.status(404).json({ error: "An error occurred" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const callback: RequestHandler = async (req, res, next) => {
  try {
    const callbackData = req.body;

    // callbackData.Body.stkCallback.ResultCode

    if (!callbackData.Body.stkCallback.CallbackMetadata) {
      res.status(400).json({ error: "transaction not processed" });
    }

    console.log(callbackData.Body.stkCallback.CallbackMetadata);

    const phone = callbackData.Body.stkCallback.CallbackMetadata.Item[4].value;
    const amount = callbackData.Body.stkCallback.CallbackMetadata.Item[0].value;
    const txnId = callbackData.Body.stkCallback.CallbackMetadata.Item[1].value;

    await prisma.transaction.create({
      data: {
        phone,
        amount,
        txnId,
      },
    });

    res.status(200).json({
      message: "Callback processed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
