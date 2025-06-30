import https from "https";

export default function handler(req, res) {
  const { id } = req.query;
  const token = process.env.REPLICATE_API_TOKEN;

  const options = {
    hostname: "api.replicate.com",
    path: `/v1/predictions/${id}`,
    method: "GET",
    headers: { Authorization: `Token ${token}` }
  };

  const request = https.request(options, (resp) => {
    let data = "";
    resp.on("data", (chunk) => data += chunk);
    resp.on("end", () => {
      try {
        return res.status(200).json(JSON.parse(data));
      } catch {
        return res.status(500).json({ error: data });
      }
    });
  });

  request.on("error", (err) => res.status(500).json({ error: err.message }));
  request.end();
}
