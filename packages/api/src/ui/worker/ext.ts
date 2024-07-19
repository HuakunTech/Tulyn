// export interface IWorkerExtension {
//   /**
//    * Load the extension. Initialize the extension.
//    * Will be called once when the extension is first loaded.
//    */
//   load(): Promise<void>
//   onSearchTermChange(term: string): Promise<void>
//   onItemSelected(value: string): Promise<void>
//   onScrolledToBottom(): Promise<void>
//   onHighlightedItemChanged(value: string): Promise<void>
//   onActionSelected(value: string): Promise<void>
//   onEnterPressedOnSearchBar(): Promise<void>
// }

export abstract class WorkerExtension {
  searchTerm: string = ""
  highlightedItemValue?: string

  /**
   * Load the extension. Initialize the extension.
   * Will be called once when the extension is first loaded.
   */
  abstract load(): Promise<void>
  onSearchTermChange(term: string): Promise<void> {
    this.searchTerm = term
    return Promise.resolve()
  }
  onItemSelected(value: string): Promise<void> {
    return Promise.resolve()
  }
  onScrolledToBottom(): Promise<void> {
    return Promise.resolve()
  }
  onHighlightedItemChanged(value: string): Promise<void> {
    this.highlightedItemValue = value
    return Promise.resolve()
  }
  onActionSelected(value: string): Promise<void> {
    return Promise.resolve()
  }
  onEnterPressedOnSearchBar(): Promise<void> {
    return Promise.resolve()
  }
}
