export abstract class WorkerExtension {
	searchTerm: string = ""
	highlightedListItemValue?: string
	onListItemSelected(value: string): Promise<void> {
		return Promise.resolve()
	}

	onListScrolledToBottom(): Promise<void> {
		return Promise.resolve()
	}

	onHighlightedListItemChanged(value: string): Promise<void> {
		this.highlightedListItemValue = value
		return Promise.resolve()
	}
	/**
	 * Load the extension. Initialize the extension.
	 * Will be called once when the extension is first loaded.
	 */
	abstract load(): Promise<void>
	onSearchTermChange(term: string): Promise<void> {
		this.searchTerm = term
		return Promise.resolve()
	}

	onActionSelected(value: string): Promise<void> {
		return Promise.resolve()
	}
	onEnterPressedOnSearchBar(): Promise<void> {
		return Promise.resolve()
	}
}
