import type { MetadataRoute } from "next";

import { isDemoDeployment } from "@/config";
import { getSiteURL } from "@/lib/get-site-url";
import { buildRobots } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(getSiteURL(), { demo: isDemoDeployment });
}
