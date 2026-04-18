import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Agents
async function productAgent(product) {
  return "Good specs";
}

async function priceAgent(product) {
  return "Price dropped recently";
}

// Review Agent
async function reviewAgent(product) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ fixed
    });

    const result = await model.generateContent(
      `Give a short review summary for ${product}`
    );

    return result.response.text();
  } catch (err) {
    console.error("Review Agent Error:", err);
    return "Review data unavailable";
  }
}

// Recommendation Agent
async function recommendationAgent(data) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ fixed
    });
    console.log("Data for Recommendation Agent:", data);

    const result = await model.generateContent(`
      Product: ${data.product}
      Specs: ${data.productData}
      Price: ${data.priceData}
      Reviews: ${data.reviewData}

      Should user BUY, WAIT, or SKIP?
    `);

    return result.response.text();
  } catch (err) {
    console.error("Recommendation Error:", err);
    return "Recommendation unavailable";
  }
}

// API Route
export async function POST(req) {
  try {
    const { product } = await req.json();

    const [productData, priceData, reviewData] = await Promise.all([
      productAgent(product),
      priceAgent(product),
      reviewAgent(product),
    ]);

    const finalDecision = await recommendationAgent({
      product,
      productData,
      priceData,
      reviewData,
    });

    return Response.json({
      result: `
${productData}
${priceData}
${reviewData}

👉 ${finalDecision}
`,
    });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}