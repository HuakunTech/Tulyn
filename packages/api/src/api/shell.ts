import type { IShell, IShellInternal } from "../api/client-types";
import { defaultClientAPI, isMain } from "../client";
import { proxy as comlinkProxy, type Remote } from "@huakunshen/comlink";
import {
  Child as ShellxChild,
  Command as ShellxCommand,
  executeAppleScript as shellxExecuteAppleScript,
  executeBashScript as shellxExecuteBashScript,
  executeNodeScript as shellxExecuteNodeScript,
  executePowershellScript as shellxExecutePowershellScript,
  executePythonScript as shellxExecutePythonScript,
  executeZshScript as shellxExecuteZshScript,
  hasCommand as shellxHasCommand,
  likelyOnWindows as shellxLikelyOnWindows,
  makeAppleScript as shellxMakeAppleScript,
  makeBashScript as shellxMakeBashScript,
  makeNodeScript as shellxMakeNodeScript,
  makePowershellScript as shellxMakePowershellScript,
  makePythonScript as shellxMakePythonScript,
  makeZshScript as shellxMakeZshScript,
  open as shellxOpen,
  type ChildProcess,
  type IOPayload,
  type SpawnOptions
} from "tauri-plugin-shellx-api";
import { type IShellServer } from "./server-types";

export function constructAPI(api: Remote<IShellServer>): IShellInternal {
  return {
    execute: api.shellExecute,
    kill: api.shellKill,
    stdinWrite: api.shellStdinWrite,
    open: api.shellOpen,
    rawSpawn: api.shellRawSpawn,
    makeBashScript,
    makePowershellScript,
    makeAppleScript,
    makePythonScript,
    makeZshScript,
    makeNodeScript,
    executeBashScript: api.shellExecuteBashScript,
    executePowershellScript: api.shellExecutePowershellScript,
    executeAppleScript: api.shellExecuteAppleScript,
    executePythonScript: api.shellExecutePythonScript,
    executeZshScript: api.shellExecuteZshScript,
    executeNodeScript: api.shellExecuteNodeScript,
    hasCommand: api.shellHasCommand,
    likelyOnWindows: api.shellLikelyOnWindows
  };
}

const _comlinkShell: IShellInternal = constructAPI(defaultClientAPI);

export class Child extends ShellxChild {
  write(data: IOPayload): Promise<void> {
    return _comlinkShell.stdinWrite(typeof data === "string" ? data : Array.from(data), this.pid);
  }

  kill(): Promise<void> {
    return _comlinkShell.kill(this.pid);
  }
}

export class Command<O extends IOPayload> extends ShellxCommand<O> {
  static create<O extends IOPayload>(
    program: string,
    args: string | string[] = [],
    options?: SpawnOptions
  ): Command<O> {
    return new Command(program, args, options);
  }

  async spawn(): Promise<Child> {
    const args = this.args;

    if (typeof args === "object") {
      Object.freeze(args);
    }

    return _comlinkShell
      .rawSpawn<O>(
        this.program,
        args,
        this.options,
        comlinkProxy((evt) => {
          switch (evt.event) {
            case "Error":
              this.emit("error", evt.payload);
              break;
            case "Terminated":
              this.emit("close", evt.payload);
              break;
            case "Stdout":
              this.stdout.emit("data", evt.payload);
              break;
            case "Stderr":
              this.stderr.emit("data", evt.payload);
              break;
          }
        })
      )
      .then((pid) => new Child(pid));
  }

  async execute(): Promise<ChildProcess<O>> {
    const program = this.program;
    const args = this.args;
    const options = this.options;

    if (typeof args === "object") {
      Object.freeze(args);
    }
    return _comlinkShell.execute(program, args, options) as Promise<ChildProcess<O>>;
  }
}

function makeBashScript(script: string): Command<string> {
  return Command.create("bash", ["-c", script]);
}

function makePowershellScript(script: string): Command<string> {
  return Command.create("powershell", ["-Command", script]);
}

function makeAppleScript(script: string): Command<string> {
  return Command.create("osascript", ["-e", script]);
}

function makePythonScript(script: string): Command<string> {
  return Command.create("python", ["-c", script]);
}

function makeZshScript(script: string): Command<string> {
  return Command.create("zsh", ["-c", script]);
}

function makeNodeScript(script: string): Command<string> {
  return Command.create("node", ["-e", script]);
}

export const shellOpen = _comlinkShell.open;

export const comlinkShell: IShell = {
  ..._comlinkShell,
  Command,
  Child
};

export const nativeShell: IShell = {
  open: shellxOpen,
  makeBashScript: shellxMakeBashScript,
  makePowershellScript: shellxMakePowershellScript,
  makeAppleScript: shellxMakeAppleScript,
  makePythonScript: shellxMakePythonScript,
  makeZshScript: shellxMakeZshScript,
  makeNodeScript: shellxMakeNodeScript,
  executeBashScript: shellxExecuteBashScript,
  executePowershellScript: shellxExecutePowershellScript,
  executeAppleScript: shellxExecuteAppleScript,
  executePythonScript: shellxExecutePythonScript,
  executeZshScript: shellxExecuteZshScript,
  executeNodeScript: shellxExecuteNodeScript,
  hasCommand: shellxHasCommand,
  likelyOnWindows: shellxLikelyOnWindows,
  Command: ShellxCommand,
  Child: ShellxChild
};

export const shell = isMain ? nativeShell : comlinkShell;
