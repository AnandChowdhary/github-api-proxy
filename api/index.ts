import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

const allowedRepos = ["AnandChowdhary/life"];

const forward = async (req: NowRequest) => {
  const endpoint = req.query.endpoint;
  if (!endpoint) throw new Error("Specify an endpoint");
  let allowed = false;
  if (typeof endpoint === "string")
    allowedRepos.forEach(
      (repo) => (allowed = allowed || endpoint.startsWith(`/repos/${repo}/`))
    );
  if (!allowed) throw new Error("Access to this repository is not allowed");
  return await axios.get(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  });
};

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const response = await forward(req);
    Object.keys(response.headers).forEach((key) => {
      res.setHeader(key, response.headers[key]);
    });
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};
