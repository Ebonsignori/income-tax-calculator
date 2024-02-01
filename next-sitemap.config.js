/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.income-calc.com",
  generateRobotsTxt: true,
  output: "export",
  generateRobotsTxt: true,
  priority: 0.5,
  transform: async (config, path) => {
    let priority = config.priority;

    const splitPath = path.split("/");

    if (path === "/") {
      priority = 1;
    } else if (path === "/about") {
      priority = 0.6;
    } else if (path === "/tax-tables") {
      priority = 0.9;
      // Tax tables
    } else if (path.startsWith("/tax-tables")) {
      const year = parseInt(splitPath[2], 10);
      if (!isNaN(year)) {
        splitPath.shift();
        priority = determinePriorityBasedOnYearPath(splitPath, year, 0.6);
      }
      // Calculator
    } else {
      const year = parseInt(splitPath[1], 10);
      if (!isNaN(year)) {
        priority = determinePriorityBasedOnYearPath(splitPath, year);
      }
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: Math.round(priority * 10) / 10,
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

function determinePriorityBasedOnYearPath(
  splitPath,
  year,
  defaultPriority = 0.8,
) {
  const thisYear = new Date().getFullYear();
  let priority = 0;

  // This year gets extra priority
  if (year === thisYear) {
    priority = defaultPriority;
    // Cities get extra priority for current year
    if (splitPath.length > 3) {
      priority += 0.1;
    }
    // Previous year get less priority, subsequent previous years get even less
  } else if (year === thisYear - 1) {
    priority = defaultPriority - 0.2;
    // Cities get extra priority for only the previous year
    if (splitPath.length > 3) {
      priority += 0.1;
    }
  } else {
    const yearsAgo = thisYear - year;
    priority = defaultPriority - 0.2 - yearsAgo * 0.1;
    if (priority < 0.1) priority = 0.1;
  }

  return priority;
}
