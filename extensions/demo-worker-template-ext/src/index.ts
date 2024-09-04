import {
	Action,
	expose,
	Form,
	fs,
	Icon,
	IconEnum,
	List,
	path,
	toast,
	ui,
	WorkerExtension
} from "@kksh/api/ui/worker"

class ExtensionTemplate extends WorkerExtension {
	async onBeforeGoBack() {
		console.log("onBeforeGoBack")
	}
	async onFormSubmit(value: Record<string, any>): Promise<void> {
		console.log("Form submitted", value)
	}
	async load() {
		return ui.render(
			new Form.Form({
				key: "form1",
				fields: [
					new Form.NumberField({
						key: "age",
						label: "Age",
						placeholder: "Enter your age"
					}),
					new Form.InputField({
						key: "name"
					})
				]
			})
		)
		return ui.setSearchBarPlaceholder("Enter search term").then(() => {
			return ui.render(
				new List.List({
					sections: [
						new List.Section({
							title: "Section 1",
							items: [
								new List.Item({
									title: "Hello, World!",
									value: "Section 1 Hello, World!",
									icon: new Icon({ type: IconEnum.Iconify, value: "gg:hello" })
								}),
								new List.Item({ title: "Hello, World 2!", value: "Section 1 Hello, World 2!" })
							]
						}),
						new List.Section({
							title: "Section 2",
							items: [
								new List.Item({
									title: "Hello, World!",
									value: "Section 2 Hello, World!",
									icon: new Icon({ type: IconEnum.Iconify, value: "gg:hello" })
								})
							]
						})
					],
					items: [
						new List.Item({
							title: "Hello, World!",
							value: "Hello, World!",
							icon: new Icon({ type: IconEnum.Iconify, value: "ri:star-s-fill" })
						}),
						new List.Item({
							title: "Hello, World 2!",
							value: "Hello, World 2!",
							icon: new Icon({ type: IconEnum.Iconify, value: "gg:hello" }),
							actions: new Action.ActionPanel({
								items: [
									new Action.Action({
										title: "Open",
										icon: new Icon({ type: IconEnum.Iconify, value: "ion:open-outline" })
									})
								]
							})
						})
					]
				})
			)
		})
	}

	async onSearchTermChange(term: string): Promise<void> {
		console.log("Search term changed to:", term)
	}

	async onItemSelected(value: string): Promise<void> {
		console.log("Item selected:", value)
	}

	async onActionSelected(value: string): Promise<void> {
		console.log("Action selected:", value)
	}
}

expose(new ExtensionTemplate())
