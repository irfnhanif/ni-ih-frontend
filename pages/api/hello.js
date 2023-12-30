// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import backend from "../../api/backend"

export default async function handler(req, res) {
  const response = await backend.get("/api", {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: false,
  });

  if (response.status !== 200) {
    res.status(400).json({ message: response.data.message })
    return
  }

  res.status(200).json(response.data)
}
