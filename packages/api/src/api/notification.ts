import { type INotification } from "../api/client-types"
import { defaultClientAPI, isMain } from "../client"
import { proxy as comlinkProxy, type Remote } from "@huakunshen/comlink"
import { PluginListener } from "@tauri-apps/api/core"
import {
  active,
  cancel,
  cancelAll,
  channels,
  createChannel,
  isPermissionGranted,
  onAction,
  onNotificationReceived,
  pending,
  registerActionTypes,
  removeActive,
  removeAllActive,
  removeChannel,
  requestPermission,
  sendNotification,
  type Options as NotificationOptions
} from "@tauri-apps/plugin-notification"
import { type INotificationServer } from "./server-types"

export function constructAPI(api: Remote<INotificationServer>): INotification {
  return {
    sendNotification: api.notificationSendNotification,
    requestPermission: api.notificationRequestPermission,
    isPermissionGranted: api.notificationIsPermissionGranted,
    registerActionTypes: api.notificationRegisterActionTypes,
    // this may not work
    pending: api.notificationPending,
    cancel: api.notificationCancel,
    cancelAll: api.notificationCancelAll,
    // this may not work
    active: api.notificationActive,
    removeActive: api.notificationRemoveActive,
    removeAllActive: api.notificationRemoveAllActive,
    createChannel: api.notificationCreateChannel,
    removeChannel: api.notificationRemoveChannel,
    channels: api.notificationChannels,
    // this may not work
    onNotificationReceived: (
      cb: (notification: NotificationOptions) => void
    ): Promise<PluginListener> => {
      return api.notificationOnNotificationReceived(comlinkProxy(cb))
    },
    // this may not work
    onAction: (cb: (notification: NotificationOptions) => void): Promise<PluginListener> => {
      return api.notificationOnAction(comlinkProxy(cb))
    }
  }
}
export const comlinkNotification: INotification = constructAPI(defaultClientAPI)

export const nativeNotification: INotification = {
  sendNotification: sendNotification,
  requestPermission: requestPermission,
  isPermissionGranted: isPermissionGranted,
  registerActionTypes: registerActionTypes,
  pending: pending,
  cancel: cancel,
  cancelAll: cancelAll,
  active: active,
  removeActive: removeActive,
  removeAllActive: removeAllActive,
  createChannel: createChannel,
  removeChannel: removeChannel,
  channels: channels,
  onNotificationReceived: onNotificationReceived,
  onAction: onAction
}

export const notification = isMain ? nativeNotification : comlinkNotification
