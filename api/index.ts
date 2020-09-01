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
  console.log(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
  return (
    await axios.get(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    })
  ).data;
};

export default async (req: NowRequest, res: NowResponse) => {
  try {
    res.json(await forward(req));
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};
