export interface IWorkerExtensionBase {
  name: string
  /**
   * Load the extension. Initialize the extension.
   * Will be called once when the extension is first loaded.
   */
  load(): Promise<void>
  onSearchTermChange(term: string): Promise<void>
}
