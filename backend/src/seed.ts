import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
import Review from './models/Review.js';
import Faq from './models/Faq.js';
import { connectDB } from './config/database.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  console.log("Seeding started...");

  const reviews = [
    {
      name: "Marcus T.",
      location: "Los Angeles, CA",
      message: "This isn't just clothing — it starts conversations. I wore it to a local coffee shop and ended up having a 20-minute talk about faith with a complete stranger.",
      status: "approved" as const,
    },
    {
      name: "Jasmine R.",
      location: "Atlanta, GA",
      message: "The quality is insane. I've never felt fabric this thick and premium on a faith brand. It fits exactly how I wanted: boxy, heavy, and extremely comfortable.",
      status: "approved" as const,
    },
    {
      name: "David K.",
      location: "Houston, TX",
      message: "Finally, a streetwear brand that represents who I am without compromising on the aesthetic. It feels premium and minimalist. 10/10 will buy again.",
      status: "approved" as const,
    },
    {
      name: "Sarah L.",
      location: "Chicago, IL",
      message: "Super fast shipping, packaging was beautiful, and the print quality is incredibly durable. Has survived multiple hot washes perfectly without cracking.",
      status: "approved" as const,
    }
  ];

  const faqs = [
    {
      question: "How do your clothes fit?",
      answer: "Our garments are designed with a modern, slightly boxy streetwear fit. We recommend ordering your true size for the intended relaxed look, or sizing down if you prefer a more fitted aesthetic.",
      order: 1,
      isVisible: true
    },
    {
      question: "What are the care instructions?",
      answer: "To ensure the longevity of both the fabric and the prints, we highly recommend washing all garments inside out in cold water. Hang drying is preferred, or tumble dry on low heat.",
      order: 2,
      isVisible: true
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! Shipping times and costs vary depending on the destination. You can see exact rates at checkout.",
      order: 3,
      isVisible: true
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 14-day return and exchange policy from the date of delivery. Items must be unworn, unwashed, and in their original packaging.",
      order: 4,
      isVisible: true
    }
  ];

  try {
    const existingReviews = await Review.count();
    if (existingReviews === 0) {
      await Review.bulkCreate(reviews);
      console.log("Reviews seeded");
    }

    const existingFaqs = await Faq.count();
    if (existingFaqs === 0) {
      await Faq.bulkCreate(faqs);
      console.log("Faqs seeded");
    }
  } catch (err) {
    console.error(err);
  }

  process.exit(0);
};

seed();
