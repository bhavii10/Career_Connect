const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post(
  "/analyze-resume",
  async (req, res) => {

    try {

      const {
        fullName,
        summary,
        skills = [],
        education = [],
        experience = [],
        projects = [],
      } = req.body;

      const prompt = `
You are an ATS Resume Analyzer.

Analyze this resume and return ONLY valid JSON.

{
  "atsScore": number,
  "roles": [],
  "missingSkills": [],
  "suggestions": []
}

Resume Data:

Name: ${fullName}

Summary:
${summary}

Skills:
${skills.join(", ")}

Education:
${education.join(", ")}

Experience:
${experience.join(", ")}

Projects:
${projects.join(", ")}
`;

      const response =
        await axios.post(

          "https://openrouter.ai/api/v1/chat/completions",

          {
            model:
              "deepseek/deepseek-chat",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },

          {
            headers: {

              Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const text =
        response.data.choices[0]
          .message.content;

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed =
        JSON.parse(cleanedText);

      res.json({
        success: true,
        result: parsed,
      });

    } catch (error) {

      console.error(
        "AI Error:",
        error.response?.data ||
        error.message
      );

      res.status(500).json({
        success: false,
        error:
          error.response?.data ||
          error.message,
      });
    }
  }
);

module.exports = router;