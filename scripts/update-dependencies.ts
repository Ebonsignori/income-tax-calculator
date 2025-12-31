#!/usr/bin/env ts-node

/**
 * Update Dependencies Script
 *
 * This script automates the process of updating npm dependencies using the
 * GitHub Copilot CLI. It intelligently groups related packages (like @mui/*,
 * @emotion/*) and their corresponding @types/* packages together to maintain
 * compatibility.
 *
 * The script will:
 *   1. Group related packages by namespace/prefix with their @types
 *   2. Use Copilot CLI to update packages with code changes
 *   3. Run validation (lint, test, build) after each update
 *   4. Log all changes for review
 *
 * Usage:
 *   npm run update-dependencies [-- OPTIONS]
 *   ts-node scripts/update-dependencies.ts [OPTIONS]
 *
 * Options:
 *   --dry-run        Show what would be updated without making changes
 *   --group-only     Show package groupings without updating
 *   --help           Show this help message
 *
 * Examples:
 *   npm run update-dependencies
 *   npm run update-dependencies -- --dry-run
 */

import { execSync, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface PackageGroup {
  name: string;
  packages: string[];
}

interface PackageInfo {
  name: string;
  current: string;
  latest: string;
  needsUpdate: boolean;
}

class DependencyUpdater {
  private logFile: string;
  private dryRun: boolean;
  private groupOnly: boolean;
  private logStream: fs.WriteStream;

  constructor() {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    this.logFile = path.join(
      process.cwd(),
      "logs",
      `update-deps-${timestamp}.log`
    );

    // Parse arguments
    this.dryRun = process.argv.includes("--dry-run");
    this.groupOnly = process.argv.includes("--group-only");

    if (process.argv.includes("--help")) {
      this.showHelp();
      process.exit(0);
    }

    // Ensure logs directory exists
    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs");
    }

    this.logStream = fs.createWriteStream(this.logFile, { flags: "a" });
  }

  private showHelp(): void {
    const help = `
Update Dependencies Script

Usage:
  npm run update-dependencies [-- OPTIONS]
  ts-node scripts/update-dependencies.ts [OPTIONS]

Options:
  --dry-run        Show what would be updated without making changes
  --group-only     Show package groupings without updating
  --help           Show this help message

Examples:
  npm run update-dependencies
  npm run update-dependencies -- --dry-run
`;
    console.log(help);
  }

  private log(message: string, color?: keyof typeof colors): void {
    const colorCode = color ? colors[color] : "";
    const resetCode = color ? colors.reset : "";
    const displayMessage = `${colorCode}${message}${resetCode}`;

    console.log(displayMessage);
    this.logStream.write(message + "\n");
  }

  private async question(prompt: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  private getPackageVersion(packageName: string): string {
    try {
      const result = execSync(`npm info ${packageName} version`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return result.trim();
    } catch {
      return "unknown";
    }
  }

  private getInstalledVersion(packageName: string): string {
    try {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson: PackageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf-8")
      );

      const version =
        packageJson.dependencies?.[packageName] ||
        packageJson.devDependencies?.[packageName] ||
        "not installed";

      return version.replace(/^[\^~]/, "");
    } catch {
      return "not installed";
    }
  }

  private groupPackages(): PackageGroup[] {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    );

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const packages = Object.keys(allDeps);
    const groups: Map<string, string[]> = new Map();
    const typePackages: string[] = [];

    // Define custom package groups
    const nextGroup = [
      "next",
      "next-sitemap",
      "next-pwa",
      "react",
      "react-dom",
    ];
    const typescriptGroup = ["ts-node", "tsconfig-paths", "typescript"];
    const eslintGroup = ["prettier"]; // Will be combined with eslint* packages

    // First pass: separate @types packages and group regular packages
    packages.forEach((pkg) => {
      if (pkg.startsWith("@types/")) {
        typePackages.push(pkg);
        return;
      }

      let groupName: string;

      if (pkg.startsWith("@mui/")) {
        groupName = "@mui";
      } else if (pkg.startsWith("@emotion/")) {
        groupName = "@emotion";
      } else if (pkg.startsWith("@playwright/")) {
        groupName = "@playwright";
      } else if (pkg.startsWith("@typescript-eslint/")) {
        groupName = "@typescript-eslint";
      } else if (pkg.startsWith("@vitest/")) {
        groupName = "@vitest";
      } else if (pkg.startsWith("@fontsource/")) {
        groupName = "@fontsource";
      } else if (pkg.startsWith("eslint") || eslintGroup.includes(pkg)) {
        groupName = "eslint";
      } else if (nextGroup.includes(pkg)) {
        groupName = "next";
      } else if (typescriptGroup.includes(pkg)) {
        groupName = "typescript";
      } else {
        groupName = `standalone:${pkg}`;
      }

      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(pkg);
    });

    // Second pass: assign @types packages to their corresponding groups
    typePackages.forEach((typePkg) => {
      // Extract the base package name from @types/package-name
      const baseName = typePkg.replace("@types/", "");

      // Try to find which group this type belongs to
      let assigned = false;

      groups.forEach((groupPackages) => {
        if (assigned) return;

        // Check if any package in the group matches this type
        const matchesGroup = groupPackages.some((pkg: string) => {
          // Handle scoped packages like @mui/material -> @types/mui__material
          const scopedMatch =
            pkg.startsWith("@") && baseName === pkg.slice(1).replace("/", "__");

          // Handle regular packages like react -> @types/react
          const regularMatch = pkg === baseName;

          // Handle packages with the same base like node -> @types/node
          const baseMatch =
            pkg.startsWith(baseName) || baseName.startsWith(pkg);

          return scopedMatch || regularMatch || baseMatch;
        });

        if (matchesGroup) {
          groupPackages.push(typePkg);
          assigned = true;
        }
      });

      // If not assigned to any group, create a standalone group for it
      if (!assigned) {
        const standaloneName = `standalone:${baseName}`;
        if (!groups.has(standaloneName)) {
          groups.set(standaloneName, []);
        }
        groups.get(standaloneName)!.push(typePkg);
      }
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([name, packages]) => ({ name, packages }))
      .sort((a, b) => {
        // Standalone packages last
        if (
          a.name.startsWith("standalone:") &&
          !b.name.startsWith("standalone:")
        )
          return 1;
        if (
          !a.name.startsWith("standalone:") &&
          b.name.startsWith("standalone:")
        )
          return -1;
        return a.name.localeCompare(b.name);
      });
  }

  private getPackageInfo(packageName: string): PackageInfo {
    const current = this.getInstalledVersion(packageName);
    const latest = this.getPackageVersion(packageName);
    const needsUpdate = current !== latest && latest !== "unknown";

    return { name: packageName, current, latest, needsUpdate };
  }

  private getPeerDependencies(packageName: string): Record<string, string> {
    try {
      const result = execSync(
        `npm info ${packageName} peerDependencies --json`,
        {
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
        }
      );
      return JSON.parse(result);
    } catch {
      return {};
    }
  }

  private checkGroupCompatibility(group: PackageGroup): string[] {
    const warnings: string[] = [];
    const packageNames = group.packages;

    // Check if any package in the group has peer dependencies on other packages in the group
    for (const pkg of packageNames) {
      const peerDeps = this.getPeerDependencies(pkg);

      for (const [peerName, peerVersion] of Object.entries(peerDeps)) {
        if (packageNames.includes(peerName)) {
          warnings.push(
            `${pkg} has peer dependency: ${peerName}@${peerVersion}`
          );
        }
      }
    }

    return warnings;
  }

  private async displayGroups(): Promise<void> {
    const groups = this.groupPackages();

    this.log("Package Groups:", "blue");
    this.log("================");
    this.log("");

    for (const group of groups) {
      this.log(
        `${group.name} (${group.packages.length} package(s)):`,
        "yellow"
      );

      for (const pkg of group.packages) {
        const info = this.getPackageInfo(pkg);
        if (info.needsUpdate) {
          this.log(`  • ${pkg}: ${info.current} → ${info.latest}`, "green");
        } else {
          this.log(`  • ${pkg}: ${info.current} (up to date)`);
        }
      }

      this.log("");
    }
  }

  private async runCommand(
    command: string,
    args: string[],
    description: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.log(`  → ${description}...`);

      const child = spawn(command, args, {
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
      });

      child.stdout?.on("data", (data) => {
        this.logStream.write(data.toString());
      });

      child.stderr?.on("data", (data) => {
        this.logStream.write(data.toString());
      });

      child.on("close", (code) => {
        if (code === 0) {
          this.log(`  ✓ ${description} passed`, "green");
          resolve(true);
        } else {
          this.log(`  ✗ ${description} failed`, "red");
          resolve(false);
        }
      });
    });
  }

  private async validateChanges(step: string): Promise<boolean> {
    this.log(`Validating changes after ${step}...`, "yellow");

    // Run lint
    const lintPassed = await this.runCommand("npm", ["run", "lint"], "Lint");
    if (!lintPassed) return false;

    // Run tests
    const testPassed = await this.runCommand("npm", ["test"], "Tests");
    if (!testPassed) return false;

    // Run build
    const buildPassed = await this.runCommand("npm", ["run", "build"], "Build");
    if (!buildPassed) return false;

    this.log("All validation steps passed!", "green");
    return true;
  }

  private async updatePackageGroup(group: PackageGroup): Promise<boolean> {
    // Check if any packages need updates
    const needsUpdate = group.packages.some(
      (pkg) => this.getPackageInfo(pkg).needsUpdate
    );

    if (!needsUpdate) {
      this.log(`${group.name}: All packages up to date, skipping`, "green");
      return true;
    }

    this.log("==========================================", "blue");
    this.log(`Updating: ${group.name}`, "blue");
    this.log("==========================================", "blue");
    this.log(`Packages: ${group.packages.join(", ")}`);
    this.log("");

    // Check for peer dependencies within the group
    const compatibility = this.checkGroupCompatibility(group);
    if (compatibility.length > 0) {
      this.log("⚠️  Peer dependency constraints detected:", "yellow");
      compatibility.forEach((warning) => {
        this.log(`  • ${warning}`, "yellow");
      });
      this.log("");
    }

    const prompt = `Please update the following npm packages to their latest versions: ${group.packages.join(", ")}

IMPORTANT: Some packages in this group may have peer dependency constraints on each other. Before updating:
${
  compatibility.length > 0
    ? `
Peer dependency constraints:
${compatibility.map((w) => `- ${w}`).join("\n")}

When updating, ensure that the versions you install satisfy these peer dependency requirements. If a package requires a specific version range of another package in the group, install compatible versions, not necessarily the absolute latest.
`
    : ""
}

For each package:
1. Check peer dependencies: npm info <package> peerDependencies
2. If peer dependencies exist within this group, install compatible versions
3. Otherwise, run 'npm install <package>@latest' to update to the latest version
4. Review any breaking changes in the package's changelog
5. Make any necessary code changes to handle breaking changes or deprecations
6. Ensure all imports and usages are updated

After updating, run:
- npm run lint (to check for code issues)
- npm test (to run all tests)
- npm run build (to verify the build works)

If there are any issues, fix them before proceeding.`;

    this.log(`Calling Copilot CLI for ${group.name}...`);

    return new Promise((resolve) => {
      // Escape single quotes in the prompt and wrap it in single quotes
      const escapedPrompt = prompt.replace(/'/g, "'\"'\"'");
      const command = `copilot -p '${escapedPrompt}' --allow-all-tools --allow-all-paths`;

      const child = spawn(command, {
        stdio: ["inherit", "pipe", "pipe"],
        shell: true,
      });

      child.stdout?.on("data", (data) => {
        process.stdout.write(data);
        this.logStream.write(data);
      });

      child.stderr?.on("data", (data) => {
        process.stderr.write(data);
        this.logStream.write(data);
      });

      child.on("close", (code) => {
        resolve(code === 0);
      });
    });
  }

  async run(): Promise<void> {
    this.log("==========================================", "blue");
    this.log("Dependency Update Script", "blue");
    this.log("==========================================", "blue");
    this.log(`Started: ${new Date().toLocaleString()}`);
    this.log("");

    this.log("Reading package.json...");
    const groups = this.groupPackages();

    await this.displayGroups();

    if (this.groupOnly) {
      this.log("Group-only mode. Exiting.");
      this.cleanup();
      return;
    }

    if (this.dryRun) {
      this.log("Dry-run mode. No changes will be made.", "yellow");
      this.cleanup();
      return;
    }

    const answer = await this.question("Proceed with updates? (y/N): ");
    if (answer.toLowerCase() !== "y") {
      this.log("Update cancelled by user.");
      this.cleanup();
      return;
    }

    this.log("");
    this.log("==========================================", "blue");
    this.log("Starting Updates", "blue");
    this.log("==========================================", "blue");
    this.log("");

    // Process all groups
    for (const group of groups) {
      await this.updatePackageGroup(group);

      this.log("");
      if (!(await this.validateChanges(group.name))) {
        this.log(`Validation failed after updating ${group.name}`, "red");
        this.log(
          "Please review the changes and fix any issues manually.",
          "yellow"
        );

        const continueAnswer = await this.question(
          "Continue with remaining updates? (y/N): "
        );
        if (continueAnswer.toLowerCase() !== "y") {
          this.log(`Updates stopped by user after ${group.name}`);
          this.cleanup();
          return;
        }
      }

      this.log("");
      this.log(`✓ ${group.name} update complete`, "green");
      this.log("");

      // Pause between groups
      if (group !== groups[groups.length - 1]) {
        await this.question("Press Enter to continue to next group...");
        this.log("");
      }
    }

    this.log("==========================================", "blue");
    this.log("All dependency updates complete!", "green");
    this.log("==========================================", "blue");
    this.log(`Completed: ${new Date().toLocaleString()}`);
    this.log("");
    this.log(`Log file saved to: ${this.logFile}`);
    this.log("");
    this.log("Next steps:", "yellow");
    this.log("1. Review the changes: git diff");
    this.log("2. Test the application manually: npm run dev");
    this.log(
      "3. Commit the changes: git add . && git commit -m 'chore: update dependencies'"
    );

    this.cleanup();
  }

  private cleanup(): void {
    this.logStream.end();
  }
}

// Run the script
const updater = new DependencyUpdater();
updater.run().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
