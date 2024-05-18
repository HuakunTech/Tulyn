import fs from "fs";
import { BaseJarvisExtension, TListItem, type IJarvisAPIContext } from "@jarvis/api";
import { z } from "zod";

export const Project = z.object({
  name: z.string(),
  rootPath: z.string(),
  paths: z.array(z.unknown()),
  tags: z.array(z.string()),
  enabled: z.boolean(),
});
export type Project = z.infer<typeof Project>;

export default class VSCodeProjectManagerExt extends BaseJarvisExtension {
  projectManagerStoragePath: string;

  constructor(ctx: IJarvisAPIContext) {
    if (!ctx) {
      throw new Error("Context is required");
    }
    super(ctx);
    // - Mac: `~/Library/Application Support/Code/User/globalStorage/alefragnani.project-manager/projects.json`
    // - Windows: `%APPDATA%\Code\User\globalStorage\alefragnani.project-manager\projects.json`
    // - Linux: `~/.config/Code/User/globalStorage/alefragnani.project-manager/projects.json`
    // determine current platform
    const platform = process.platform;
    switch (platform) {
      case "darwin":
        this.projectManagerStoragePath = `${process.env.HOME}/Library/Application Support/Code/User/globalStorage/alefragnani.project-manager/projects.json`;
        break;
      case "win32":
        this.projectManagerStoragePath = `${process.env.APPDATA}/Code/User/globalStorage/alefragnani.project-manager/projects.json`;
        break;
      case "linux":
        this.projectManagerStoragePath = `${process.env.HOME}/.config/Code/User/globalStorage/alefragnani.project-manager/projects.json`;
        break;
      default:
        throw new Error(`Platform ${platform} is not supported`);
    }

    // check if the file exists
    const fs = require("fs");
    if (!fs.existsSync(this.projectManagerStoragePath)) {
      throw new Error(`File ${this.projectManagerStoragePath} does not exist`);
    }
  }
  onSearchTermUpdate(searchTerm: string) {
    const projects = Project.array().parse(
      JSON.parse(fs.readFileSync(this.projectManagerStoragePath, "utf-8")),
    );
    const filteredProjects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.map((t) => t.toLowerCase()).includes(searchTerm),
    );

    this.ctx.setSearchResult(
      filteredProjects.map((project) =>
        TListItem.parse({
          title: project.name,
          value: project.rootPath,
          description: "",
          type: "",
          icon: null,
          keywords: [],
        }),
      ),
    );
  }

  onItemSelected(item: TListItem) {
    this.ctx.apps.openWithApp(item.value, `"/Applications/Visual Studio Code.app"`);
  }
}
