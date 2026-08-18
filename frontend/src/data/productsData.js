import ogOrtho from "../assets/images/og-ortho.jpeg";
import orthosense from "../assets/images/orthosense.jpeg";
import aarogyam from "../assets/images/aarogyam.jpeg";
import bodiesense from "../assets/images/bodiesense.jpeg";

export const sizes = [
  "72x30",
  "72x36",
  "72x48",
  "72x60",
  "72x66",
  "72x72",
  "75x36",
  "75x48",
  "75x60",
  "75x72",
  "78x30",
  "78x36",
  "78x48",
  "78x60",
  "78x66",
  "78x72",
  "80x60",
  "80x72",
  "84x36",
  "84x48",
  "84x60",
  "84x72",
];

export const products = [
  {
    id: "og-ortho",
    name: "OG-Ortho",
    productSection: "MATTRESS",
    eyebrow: "Signature collection",
    image: ogOrtho,
    description:
      "An elevated orthopaedic sleep surface with natural latex comfort and dependable support.",
    warranty: "10 years",
    firmness: "Medium firm",
    materials: [
      "Knitted fabric",
      "Natural Latex",
      "HR foam",
      "Orthopaedic",
    ],
    needs: ["Back Support", "Latex"],
    userTypes: ["Couples", "For Individual"],
    tech: ["Ortho Comfort"],
    feels: ["Medium Firm"],
    prices: { 6: 950, 8: 1050 },
    badge: "Most loved",
  },
  {
    id: "somnus",
    name: "Somnus",
    productSection: "MATTRESS",
    eyebrow: "Memory comfort",
    image: ogOrtho,
    description:
      "Pressure-relieving memory foam comfort, balanced by a supportive orthopaedic core.",
    warranty: "10 years",
    firmness: "Medium plush",
    materials: [
      "Knitted fabric",
      "Memory foam",
      "HR foam",
      "Orthopaedic",
    ],
    needs: ["No Partner Disturbance", "Cozy & Snug"],
    userTypes: ["Couples", "Guests"],
    tech: ["Memory"],
    feels: ["Medium Soft Feel"],
    prices: { 6: 740, 8: 840 },
    badge: "Cloud comfort",
  },
  {
    id: "bodiesense",
    name: "BodySense",
    productSection: "MATTRESS",
    eyebrow: "Responsive comfort",
    image: bodiesense,
    description:
      "Body-contouring memory comfort made for restorative, uninterrupted sleep.",
    warranty: "10 years",
    firmness: "Balanced",
    materials: [
      "Knitted fabric",
      "Memory foam",
      "HR foam",
      "Orthopaedic",
    ],
    needs: ["Multi Activity", "Cozy & Snug"],
    userTypes: ["For Individual", "Couple With Kids"],
    tech: ["Pro Comfort"],
    feels: ["Medium Firm"],
    prices: { 5: 580, 6: 680 },
    badge: "Best value",
  },
  {
    id: "orthosense",
    name: "OrthoSense",
    productSection: "MATTRESS",
    eyebrow: "Everyday support",
    image: orthosense,
    description:
      "A supportive, practical mattress that brings soft comfort to your nightly routine.",
    warranty: "7 years",
    firmness: "Medium firm",
    materials: ["Knitted fabric", "Natural Latex", "Orthopaedic"],
    needs: ["Back Support", "Non Omni"],
    userTypes: ["For Individual", "Elders"],
    tech: ["Pro Spinetech"],
    feels: ["Firm"],
    prices: { 5: 360, 6: 470 },
    badge: "Everyday essential",
  },
  {
    id: "aarogyam",
    name: "Aarogyam",
    productSection: "MATTRESS",
    eyebrow: "Wellness comfort",
    image: aarogyam,
    description:
      "Layered everyday comfort with a resilient HR foam core for relaxed mornings.",
    warranty: "7 years",
    firmness: "Medium",
    materials: [
      "Knitted fabric",
      "Natural Latex",
      "HR foam",
      "Orthopaedic",
    ],
    needs: ["Back Support", "Reversible"],
    userTypes: ["Elders", "For Individual"],
    tech: ["Fitrest Series"],
    feels: ["Gentle"],
    prices: { 4: 310, 5: 360, 6: 470 },
    badge: "Wellness choice",
  },
];

export function getPrice(product, size, thickness) {
  let length = 72;
  let width = 60;

  if (size) {
    const match = String(size).match(/(\d+)\s*[xX×]\s*(\d+)/);
    if (match) {
      const parsedLen = parseInt(match[1], 10);
      const parsedWid = parseInt(match[2], 10);
      if (!isNaN(parsedLen) && parsedLen > 0) length = parsedLen;
      if (!isNaN(parsedWid) && parsedWid > 0) width = parsedWid;
    }
  }

  const areaSqFt = (length * width) / 144;

  const pricesObj = (product && typeof product.prices === 'object' && product.prices) ? product.prices : {};
  const availableThicknessKeys = Object.keys(pricesObj);

  let ratePerSqFt = 0;

  if (thickness !== undefined && thickness !== null && pricesObj[thickness] !== undefined) {
    ratePerSqFt = Number(pricesObj[thickness]);
  } else if (thickness !== undefined && thickness !== null && pricesObj[String(thickness)] !== undefined) {
    ratePerSqFt = Number(pricesObj[String(thickness)]);
  } else if (availableThicknessKeys.length > 0) {
    ratePerSqFt = Number(pricesObj[availableThicknessKeys[0]]);
  } else if (product && typeof product.price === 'number' && !isNaN(product.price) && product.price > 0) {
    ratePerSqFt = Number(product.price);
  } else {
    ratePerSqFt = 500;
  }

  if (isNaN(ratePerSqFt) || ratePerSqFt <= 0) {
    ratePerSqFt = 500;
  }

  const totalPrice = Math.round(areaSqFt * ratePerSqFt);

  if (isNaN(totalPrice) || !isFinite(totalPrice) || totalPrice <= 0) {
    return 0;
  }

  return totalPrice;
}
