export type AppNameType =
  | "Folder"
  | "Task View"
  | "File Explorer"
  | "Copilot"
  | "Microsoft Store"
  | "Start"
  | "vsCode"
  | string;

export interface AppType {
  name: AppNameType;
  isDir: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  isOnTaskBar: boolean;
  canAddPages: boolean;
  isTempOnTaskBar: boolean;
  iconUrl: string;
  children?: AppType[];
}

export interface FileManagerType {
  apps: AppType[];
  handleOpenApp: (appName: AppNameType) => void;
  handleCloseApp: (appName: AppNameType) => void;
  handleMinimizeApp: (appName: AppNameType) => void;
  handleCreateNewFolder: () => void;
  handleAddAppToTaskBar: (appName: AppNameType, isOnTaskBar: boolean) => void;
}
