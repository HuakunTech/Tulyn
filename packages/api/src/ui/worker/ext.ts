export interface IWorkerExtensionBase {
  /**
   * Load the extension. Initialize the extension.
   * Will be called once when the extension is first loaded.
   */
  load(): Promise<void>
  onSearchTermChange(term: string): Promise<void>
  onItemSelected(value: string): Promise<void>
  onScrolledToBottom(): Promise<void>
  onHighlightedItemChanged(value: string): Promise<void>
  onActionSelected(value: string): Promise<void>
  // filter(items: any[], term: string): Promise<any[]>
}
