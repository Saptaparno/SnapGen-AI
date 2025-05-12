const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const OpenAI = require("openai");

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: "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", // Replace with your key
});

app.post("/api/generate-image-post", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Step 1: Generate text (caption/post)
    const chatRes = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Write a social media post: ${prompt}` }],
    });

    const generatedText = chatRes.choices[0].message.content;

    // Step 2: Generate image from DALL·E
    const imageRes = await openai.images.generate({
      model: "dall-e-3", // or "dall-e-2" if "dall-e-3" isn't available to your API key
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageRes.data[0].url;

    // Step 3: Load image and overlay text using canvas
    const image = await loadImage(imageUrl);
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    // Draw the base image
    ctx.drawImage(image, 0, 0, 1024, 1024);

    // Overlay the text
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 900, 1024, 124); // background for text
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(generatedText, 20, 960); // position text

    // Convert to base64 image
    const finalImageBase64 = canvas.toDataURL();

    res.json({
      caption: generatedText,
      image: finalImageBase64,
    });

  } catch (error) {
    console.error("OpenAI or Canvas Error:", error.message || error);
    res.status(500).json({ error: "Failed to generate image post" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
