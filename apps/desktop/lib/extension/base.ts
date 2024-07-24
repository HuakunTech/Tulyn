import { TListItem } from "@kksh/schema"
import type { ReadableAtom } from "nanostores"

export interface IExtensionBase {
  extensionName: string
  $listItems: ReadableAtom<TListItem[]>
  // $listItemsDisplay: ReadableAtom<TListItem[]>;

  load(): Promise<void>

  /**
   * Get the default list items for the extension when search term is empty
   */
  default(): TListItem[]

  onSelect(item: TListItem): Promise<void>

  // search(items: TListItem[], searchTerm?: string): TListItem[];
}
