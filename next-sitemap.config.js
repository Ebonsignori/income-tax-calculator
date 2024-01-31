/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.income-calc.com",
  generateRobotsTxt: true,
  output: "export",
  generateRobotsTxt: true,
  priority: 0.5,
  transform: async (config, path) => {
    const thisYear = new Date().getFullYear();

    let priority = config.priority;

    const splitPath = path.split("/");
    const year = parseInt(splitPath[1], 10);

    if (!isNaN(year)) {
      // Home page gets top priority
      if (path === "/") {
        priority = 1;
      }

      // This year gets extra priority
      if (year === thisYear) {
        priority = 0.8;
        // Cities get extra priority for current year
        if (splitPath.length > 3) {
          priority += 0.1;
        }
        // Previous year get less priority, subsequent previous years get even less
      } else if (year === thisYear - 1) {
        priority = 0.6;
        // Cities get extra priority for only the previous year
        if (splitPath.length > 3) {
          priority += 0.1;
        }
      } else {
        const yearsAgo = thisYear - year;
        priority = 0.6 - yearsAgo * 0.1;
        if (priority < 0.1) priority = 0.1;
      }
    }

    if (path === "/") {
      priority = 1;
    }

    if (path === "/about") {
      priority = 0.6;
    }
    if (path === "/tax-tables") {
      priority = 1;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://www.income-calc.com/sitemap.xml"],
  },
  changefreq: "yearly",
};
