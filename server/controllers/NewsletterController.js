import { Newsletter } from "../models/newsletterModel.js";

export async function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const alreadySubscribed = await Newsletter.findOne({ email });
    if (alreadySubscribed) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }
    const subscription = new Newsletter({ email });
    await subscription.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllSubscriptions(req, res) {
    try {
      const subscriptions = await Newsletter.find().sort({ subscribedAt: -1 });
      res
        .status(200)
        .json({ message: "All subscriptions fetched successfully", subscriptions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }