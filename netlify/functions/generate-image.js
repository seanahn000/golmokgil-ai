import { GoogleGenAI } from "@google/genai";

const ALLOWED_BUSINESS_TYPES = ["치킨", "카페", "미용실", "분식", "세탁", "기타"];
const ALLOWED_MOODS = ["밝은", "세련된", "따뜻한", "고급"];

const MOOD_DESC = {
  밝은: "bright, cheerful, vibrant, energetic colors",
  세련된: "sleek, modern, sophisticated, minimalist design",
  따뜻한: "warm, cozy, friendly, inviting atmosphere",
  고급: "luxurious, premium, elegant, high-end feel",
};

const BUSINESS_DESC = {
  치킨: "fried chicken restaurant",
  카페: "Korean cafe / coffee shop",
  미용실: "Korean hair salon",
  분식: "Korean snack and noodle restaurant (tteokbokki, gimbap)",
  세탁: "laundry and dry cleaning shop",
  기타: "local Korean small business",
};

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "요청 형식이 올바르지 않습니다." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { businessType, promoTopic, promoPeriod, promoSlogan, mood, photos } = body;

  // --- 입력 검증 ---
  if (!businessType || !ALLOWED_BUSINESS_TYPES.includes(businessType)) {
    return new Response(
      JSON.stringify({ error: "올바른 업종을 선택해주세요." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const topic = (promoTopic || "").trim();
  if (!topic || topic.length < 2 || topic.length > 100) {
    return new Response(
      JSON.stringify({ error: "홍보 주제를 2~100자 사이로 입력해주세요." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!mood || !ALLOWED_MOODS.includes(mood)) {
    return new Response(
      JSON.stringify({ error: "올바른 분위기를 선택해주세요." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const period = (promoPeriod || "").trim().slice(0, 60);
  const slogan = (promoSlogan || "").trim().slice(0, 80);

  // --- 프롬프트 구성 ---
  const prompt = `Create a professional Korean promotional poster image (square, 1080x1080 style) for a local small business.

Business type: ${BUSINESS_DESC[businessType]}
Promotion topic: ${topic}${period ? `\nPromotion period: ${period}` : ""}${slogan ? `\nHighlight slogan (show this prominently on the poster): "${slogan}"` : ""}
Visual mood/style: ${MOOD_DESC[mood]}

Design requirements:
- Square format poster suitable for SNS or printed flyer
- Korean promotional poster aesthetic
- Display the promotion topic as the main headline
${slogan ? `- Feature the slogan "${slogan}" in large, eye-catching typography` : ""}
- Use colors, typography, and decorative elements that match the "${mood}" mood
- Include imagery or illustrations appropriate for ${BUSINESS_DESC[businessType]}
- Korean text is acceptable and encouraged for a local Korean business feel
- Make it vibrant, attractive, and professional${photos && photos.length > 0 ? "\n- Reference images from the business are included below — incorporate their visual elements, products, or atmosphere into the poster" : ""}`;

  // --- Gemini API 호출 ---
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const contents = [];

  if (photos && photos.length > 0) {
    contents.push({ text: prompt });
    for (const photo of photos.slice(0, 3)) {
      if (photo.data && photo.mimeType) {
        contents.push({
          inlineData: { mimeType: photo.mimeType, data: photo.data },
        });
      }
    }
  } else {
    contents.push({ text: prompt });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
    });

    let imageData = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "이미지 생성에 실패했습니다. 다시 시도해주세요." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ image: imageData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return new Response(
      JSON.stringify({
        error: "AI 이미지 생성 중 오류가 발생했습니다: " + err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/generate-image",
};
