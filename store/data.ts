import { create } from "zustand";
import { AppNameType, AppType, FileManagerType, FileType } from "..";

// constants
const defaultStackLevel: number = 20;

// default template
const template: AppType = {
  name: "None",
  launcher: null,
  isDir: false,
  isOpen: false,
  stackLevel: defaultStackLevel,
  isMinimized: false,
  isOnTaskBar: true,
  canAddPages: false,
  isTempOnTaskBar: false,
  isOnBothDeskTopAndTaskBar: false,
  showApp: true,
  iconUrl: "/icons/windows.png",
};

// children type
const wallpapers: FileType[] = [
  {
    type: "image",
    name: "wallpaper-purple.jpg",
    launcher: "Image Viewer",
    iconUrl: "/icons/photo.png",
  },
  {
    type: "image",
    name: "wallpaper-nun.jpg",
    launcher: "Image Viewer",
    iconUrl: "/icons/photo.png",
  },
  {
    type: "image",
    name: "wallpaper-black.jpg",
    launcher: "Image Viewer",
    iconUrl: "/icons/photo.png",
  },
];

const aboutAuthor: FileType[] = [
  {
    type: "pdf",
    name: "cv.pdf",
    launcher: "Pdf Viewer",
    iconUrl: "/icons/photo.png",
  },
];

// main object state
export const useFileMangerStore = create<FileManagerType>((set) => ({
  apps: [
    {
      ...template,
      name: "Start",
      iconUrl: "/icons/windows.png",
    },
    {
      ...template,
      name: "Task View",
      iconUrl: "/icons/taskview.png",
    },
    {
      ...template,
      name: "Copilot",
      iconUrl: "/icons/copilot.png",
    },
    {
      ...template,
      name: "Microsoft Store",
      iconUrl: "/icons/microsoft-store.webp",
    },
    {
      ...template,
      name: "File Explorer",
      isDir: true,
      canAddPages: true,
      iconUrl: "/icons/file-explorer.png",
    },
    {
      ...template,
      name: "Settings",
      iconUrl: "/icons/settings.png",
    },
    {
      ...template,
      name: "VSCode",
      isOnBothDeskTopAndTaskBar: true,
      iconUrl: "/icons/vscode.png",
    },
    {
      ...template,
      name: "Recycle Bin",
      isDir: true,
      isOnTaskBar: false,
      canAddPages: true,
      iconUrl: "/icons/recycle-bin.png",
    },
    {
      ...template,
      name: "About Author",
      isDir: true,
      isOnTaskBar: false,
      canAddPages: true,
      iconUrl: "/icons/folder.png",
      children: [...aboutAuthor],
    },
    {
      ...template,
      name: "Wallpapers",
      isDir: true,
      canAddPages: true,
      isOnTaskBar: false,
      iconUrl: "/icons/folder.png",
      children: [...wallpapers],
    },
    {
      ...template,
      name: "Terminal",
      isOnTaskBar: false,
      canAddPages: true,
      iconUrl: "/icons/terminal.png",
    },
    {
      ...template,
      name: "Pdf Viewer",
      launcher: "Pdf Viewer",
      isOnTaskBar: false,
      canAddPages: true,
      showApp: false,
      iconUrl: "/icons/pdf.png",
    },
    {
      ...template,
      name: "credits.txt",
      launcher: "Text Viewer",
      isOnTaskBar: false,
      canAddPages: true,
      iconUrl: "/icons/document.png",
    },
  ],
  wallpaper: "wallpaper-purple.jpg",
  setWallpaper: (wallpaperName: string) =>
    set((state: FileManagerType) => {
      return { wallpaper: wallpaperName };
    }),
  handleOpenApp: (appName: AppNameType) =>
    set((state) => {
      if (appName === "Pdf Viewer") {
        window.open("/files/cv.pdf");
        return { ...state };
      }
      const updatedApps = state.apps.map((app) => {
        if (app.name === "Start" && app.name !== appName && app.isOpen) {
          return { ...app, isOpen: false, stackLevel: defaultStackLevel };
        }
        return {
          ...app,
          isOpen:
            app.name === appName || app.launcher === appName
              ? true
              : app.isOpen,
          stackLevel:
            app.name === appName ? defaultStackLevel + 30 : defaultStackLevel,
        };
      });

      return { apps: updatedApps };
    }),

  handleCloseApp: (appName: AppNameType) =>
    set((state) => {
      const updatedApps = state.apps.map((app) =>
        app.name === appName ? { ...app, isOpen: false } : app
      );

      return { apps: updatedApps };
    }),

  handleMinimizeApp: (appName: AppNameType) =>
    set((state) => {
      const updatedApps = state.apps.map((app) =>
        app.name === appName ? { ...app, isMinimized: !app.isMinimized } : app
      );
      return { apps: updatedApps };
    }),

  // desktop functions
  handleCreateNewFolder: () =>
    set((state) => {
      let newFolderName: string = "New folder";
      const otherNames = state.apps.filter((app: AppType) =>
        app.name.startsWith(newFolderName)
      );
      if (otherNames.length >= 1) {
        const lastItem = otherNames[otherNames.length - 1];
        let previousNumber: number = parseInt(
          lastItem.name.split(" ")[lastItem.name.split(" ").length - 1]
        );
        if (!isNaN(previousNumber)) {
          newFolderName += " " + (previousNumber + 1).toString();
        } else {
          newFolderName += " 1";
        }
      }

      const folder: AppType = {
        ...template,
        name: newFolderName,
        isDir: true,
        canAddPages: true,
        isOnTaskBar: false,
        iconUrl: "/icons/folder.png",
      };
      return { apps: [...state.apps, folder] };
    }),

  handleAddAppToTaskBar: (appName: AppNameType, isTempOnTaskBar: boolean) =>
    set((state) => {
      const updatedApps = state.apps.map((app) =>
        app.name === appName
          ? { ...app, isTempOnTaskBar: isTempOnTaskBar }
          : app
      );

      return { apps: updatedApps };
    }),

  handlePinAndUnpinTaskBarApps: (appName: AppNameType, pinOrUnpin: boolean) =>
    set((state) => {
      const updatedApps = state.apps.map((app) =>
        app.name === appName ? { ...app, isOnTaskBar: pinOrUnpin } : app
      );

      return { apps: updatedApps };
    }),

  handleUpdateStackZIndexLevel: (appName: AppNameType) =>
    set((state) => {
      const updatedApps = state.apps.map((app) => {
        if (app.name === "Start")
          return { ...app, isOpen: false, stackLevel: defaultStackLevel };

        if (app.name === appName)
          return { ...app, stackLevel: defaultStackLevel + 30 };

        return { ...app, stackLevel: defaultStackLevel };
      });

      return { apps: updatedApps };
    }),
}));
