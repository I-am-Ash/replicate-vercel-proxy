import https from "https";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const prompt = req.body.prompt;
  const token = process.env.REPLICATE_API_TOKEN;

  const payload = JSON.stringify({
    version: "cc6e3bb4b8f2463f8e26f5e09c93e4a8ab7d1fbd1a1ecfb4269b99f83e4d0947",
    input: { prompt, width: 512, height: 512 }
  });

  const options = {
    hostname: "api.replicate.com",
    path: "/v1/predictions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      "Content-Length": Buffer.byteLength(payload)
    }
  };

  const request = https.request(options, (resp) => {
    let data = "";
    resp.on("data", (chunk) => data += chunk);
    resp.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        return parsed.id
          ? res.status(200).json({ id: parsed.id })
          : res.status(500).json({ error: parsed });
      } catch {
        return res.status(500).json({ error: data });
      }
    });
  });

  request.on("error", (err) => res.status(500).json({ error: err.message }));
  request.write(payload);
  request.end();
}
