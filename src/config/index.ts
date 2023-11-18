export class AppConfig {
  static backupDirectory: string = "/home/exeral/GSaves";
  static itemsPerPage: number = 9;
  static backupTimeInMinutes: number = 30;

  static getBackupDirectory (): string {
    return this.backupDirectory
  }

  static getItemsPerPage (): number {
    return this.itemsPerPage
  }

  static getBakupTimeInMinutes (): number {
    return this.backupTimeInMinutes
  }
}
