// import * as _notificationApis from "@tauri-apps/plugin-notification";

export {
  Importance,
  Visibility,
  sendNotification,
  requestPermission,
  isPermissionGranted,
  registerActionTypes,
  pending,
  cancel,
  cancelAll,
  active,
  removeActive,
  removeAllActive,
  createChannel,
  removeChannel,
  channels,
  onNotificationReceived,
  onAction,
  Schedule,
  ScheduleEvery,
} from "@tauri-apps/plugin-notification";
