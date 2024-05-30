import { z } from "zod";
import { ElMessage, ElNotification } from "element-plus";
import { sendNotificationWithPermission } from "./notification";

export async function loadEnvVarWithNotification(envVarName: string): Promise<string> {
  const parse = z
    .string()
    .min(1)
    .safeParse(import.meta.env[envVarName]);
  if (parse.error || !parse.data) {
    console.error(`Invalid Env Var: ${envVarName}`, parse.error);
    sendNotificationWithPermission("Invalid Env Var", envVarName);
    ElMessage.error(`Invalid Env Var: ${envVarName}`);
    ElNotification.error({
      title: `Invalid Env Var: ${envVarName}`,
      message: parse.error?.toString(),
    });
    return Promise.reject(parse.error);
  } else {
    return parse.data;
  }
}
