export interface FileItem {
  id: number;
  name: string;
  filePath: string;
  backupPath: string;
  backupStatus: boolean;
  backupTask?: NodeJS.Timeout
}

export interface AddFileFormProps {
  onFileSubmit: (file: FileItem) => void;
}

export interface DragAndDropAreaProps {
  onFilesAdded: (acceptedFiles: File[]) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export interface SidebarProps {
  onCategorySelect: (category: string) => void;
}

export interface AddFileFormProps {
  onFileSubmit: (file: FileItem) => void;
}

export interface MainContentProps {
  selectedCategory: string;
}

export interface SidebarProps {
  onCategorySelect: (category: string) => void;
}

export interface ContentTemplates {
  [key: string]: () => JSX.Element;
}