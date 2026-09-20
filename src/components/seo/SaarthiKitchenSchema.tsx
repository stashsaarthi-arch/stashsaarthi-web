import React from "react";
import { FOUNDER_WHATSAPP } from "@/lib/constants";

export interface SaarthiKitchenSchemaProps {
  kitchenName?: string;
  rating?: number;
  reviewCount?: number;
  standardPrice?: number;
  monthlyPrice?: number;
  currency?: string;
  locality?: string;
  postalCode?: string;
  streetAddress?: string;
  url?: string;
  image?: string;
  description?: string;
  servesCuisine?: string[];
}

export const SaarthiKitchenSchema: React.FC<SaarthiKitchenSchemaProps> = ({
  kitchenName = "Saarthi Kitchens - Kanpur Homestyle Tiffins",
  rating = 4.92,
  reviewCount = 410,
  standardPrice = 50,
  monthlyPrice = 2400,
  currency = "INR",
  locality = "Kakadeo, Kanpur",
  postalCode = "208025",
  streetAddress = "Chhapeda Pulia Road, Kakadeo Coaching Hub",
  url = typeof window !== "undefined" ? window.location.href : "https://stashsaarthi-web.vercel.app/tiffin",
  image = "https://stashsaarthi-web.vercel.app/images/og-student.png",
  description = "Pure homestyle tiffin service cooked by verified PG owner mother hosts near PW, Allen, Motion & Motion Kakadeo. Standard Thali from ₹50 with 1-tap meal pause.",
  servesCuisine = ["North Indian", "Homestyle Desi Thali", "Pure Ghee Phulkas", "Student Health Diet"],
}) => {
  // Schema.org Google Rich Snippet JSON-LD for FoodEstablishment / Restaurant / Service
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": url,
    "name": kitchenName,
    "image": image,
    "url": url,
    "telephone": `+${FOUNDER_WHATSAPP}`,
    "priceRange": `₹${standardPrice} - ₹${monthlyPrice}`,
    "description": description,
    "servesCuisine": servesCuisine,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": locality,
      "addressRegion": "Uttar Pradesh",
      "postalCode": postalCode,
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.4831,
      "longitude": 80.3072,
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toFixed(2),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString(),
      "reviewCount": reviewCount.toString(),
    },
    "hasMenu": {
      "@type": "Menu",
      "name": "Daily Homestyle Student Tiffin Menu",
      "hasMenuItem": [
        {
          "@type": "MenuItem",
          "name": "Standard Homestyle Thali",
          "description": "4 Ghee Phulkas, Arhar Dal Tadka, Seasonal Sabzi, Steamed Rice, Mint Chutney & Salad",
          "offers": {
            "@type": "Offer",
            "price": standardPrice.toString(),
            "priceCurrency": currency,
            "availability": "https://schema.org/InStock",
            "validFrom": "2026-01-01",
          },
        },
        {
          "@type": "MenuItem",
          "name": "Monthly Tiffin Subscription Pass (60 Meals)",
          "description": "60 Lunch/Dinner Meal Tokens with 1-tap pause and zero delivery charges",
          "offers": {
            "@type": "Offer",
            "price": monthlyPrice.toString(),
            "priceCurrency": currency,
            "availability": "https://schema.org/InStock",
          },
        },
      ],
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Standard Pickup Thali",
        "price": standardPrice.toString(),
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
