#!/usr/bin/env node
import fs from "fs"
import os from "os"
import path from "path"
import { verifyCmd } from "@/commands"
import { getDockerFolder } from "@/constants"
import logger from "@/logger"
import { program } from "commander"
import { version } from "./package.json"

const cwd = process.cwd()

program.name("Kunkun CLI").description("CLI for Kunkun Extension Development").version(version)

program
	.command("verify [project_path]")
	.description("Verify the validity of a Kunkun extension")
	.option("-b, --batch", "Batch mode", false)
	.action((projectPath: string | undefined, opts: { batch: boolean }) => {
		if (!projectPath) {
			projectPath = cwd
		} else if (fs.existsSync(projectPath)) {
			projectPath = path.resolve(projectPath)
		} else if (fs.existsSync(path.join(cwd, projectPath))) {
			projectPath = path.join(cwd, projectPath)
		} else {
			logger.error("Invalid project path")
			process.exit(1)
		}
		logger.info("cwd:", cwd)
		verifyCmd(projectPath, opts.batch)
	})

program.parse()
