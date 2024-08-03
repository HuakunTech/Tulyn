import {
	Action,
	clipboard,
	expose,
	fetch,
	Icon,
	IconEnum,
	List,
	log,
	shell,
	toast,
	ui,
	WorkerExtension,
	wrap
} from "@kksh/api/ui/worker"
import { boolean, number, object, parse, safeParse, string, type InferOutput } from "valibot"

const IpApiJsonSchema = object({
	status: string(),
	continent: string(),
	country: string(),
	countryCode: string(),
	region: string(),
	regionName: string(),
	city: string(),
	district: string(),
	zip: string(),
	lat: number(),
	lon: number(),
	timezone: string(),
	offset: number(),
	currency: string(),
	isp: string(),
	org: string(),
	as: string(),
	asname: string(),
	reverse: string(),
	proxy: boolean(),
	hosting: boolean(),
	query: string()
})

type IpListItem = {
	title: string
	value: string
	icon: string
}

const Actions = {
	CopyToClipboard: "Copy to Clipboard"
}

function mapIpInfoToListItem(ip: IpListItem): List.Item {
	return new List.Item({
		title: ip.title,
		value: ip.value,
		subTitle: ip.value,
		icon: new Icon({ type: IconEnum.Iconify, value: ip.icon }),
		keywords: [ip.title],
		defaultAction: "Copy",
		actions: new Action.ActionPanel({
			items: [
				new Action.Action({
					title: Actions.CopyToClipboard,
					icon: new Icon({ type: IconEnum.Iconify, value: "tabler:copy" })
				})
			]
		})
	})
}

class IpInfo extends WorkerExtension {
	onListScrolledToBottom(): Promise<void> {
		throw new Error("Method not implemented.")
	}
	onHighlightedListItemChanged(value: string): Promise<void> {
		throw new Error("Method not implemented.")
	}
	ip?: InferOutput<typeof IpApiJsonSchema>
	listitems: List.Item[] = []

	onEnterPressedOnSearchBar(): Promise<void> {
		// check if this.searchTerm is ipv4
		if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(this.searchTerm)) {
			return Promise.resolve()
		}
		return this.searchIp(this.searchTerm)
			.then(() => {
				return ui.render(new List.List({ items: this.listitems }))
			})
			.then(() => {
				return ui.setSearchTerm("")
			})
	}

	load(): Promise<void> {
		return ui
			.setSearchBarPlaceholder("Enter an IPv4 address, and press enter to search")
			.then(() => this.searchIp())
	}
	onListItemSelected(value: string): Promise<void> {
		return clipboard
			.writeText(value)
			.then(() => {
				return toast.success("Copied to clipboard")
			})
			.then(() => {
				return
			})
	}
	onActionSelected(value: string): Promise<void> {
		if (value === Actions.CopyToClipboard) {
			if (this.highlightedListItemValue) {
				return this.onListItemSelected(this.highlightedListItemValue)
			} else {
				return toast.warning("No item selected").then(() => {})
			}
		}
		return Promise.resolve()
	}

	searchIp(ipv4?: string) {
		const apiUrl = `http://ip-api.com/json${
			ipv4 ? "/" + ipv4 : ""
		}?fields=status,message,continent,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,proxy,hosting,query`
		log.debug(`API URL: ${apiUrl}`)
		return fetch(apiUrl, {
			method: "GET"
		})
			.then((res) => res.json())
			.then((data) => {
				this.ip = parse(IpApiJsonSchema, data)
				const items: IpListItem[] = [
					{
						icon: "mdi:web",
						title: "Public IPv4",
						value: this.ip.query
					},
					{
						icon: "mdi:earth",
						title: "Continent",
						value: this.ip.continent
					},
					{
						icon: "gis:search-country",
						title: "Country",
						value: this.ip.country
					},
					{
						icon: "ic:baseline-code",
						title: "Country Code",
						value: this.ip.countryCode
					},
					{
						icon: "mdi:web",
						title: "Region",
						value: this.ip.region
					},
					{
						icon: "oui:vis-map-region",
						title: "Region Name",
						value: this.ip.regionName
					},
					{
						icon: "solar:city-bold",
						title: "City",
						value: this.ip.city
					},
					{
						icon: "oui:vis-map-region",
						title: "District",
						value: this.ip.district
					},
					{
						icon: "tabler:zip",
						title: "ZIP",
						value: this.ip.zip
					},
					{
						icon: "tabler:zip",
						title: "Geo Coordinates",
						value: `${this.ip.lat}, ${this.ip.lon}`
					},
					{
						icon: "mdi:timezone",
						title: "Timezone",
						value: this.ip.timezone
					},
					{
						icon: "mdi:clock",
						title: "Offset",
						value: `${this.ip.offset / 3600} hr`
					},
					{
						icon: "simple-icons:bitcoinsv",
						title: "Currency",
						value: this.ip.currency
					},
					{
						icon: "carbon:container-services",
						title: "ISP",
						value: this.ip.isp
					},
					{
						icon: "clarity:organization-solid",
						title: "Org",
						value: this.ip.org
					},
					{
						icon: "carbon:container-services",
						title: "AS Number",
						value: this.ip.as
					},
					{
						icon: "carbon:container-services",
						title: "AS Name",
						value: this.ip.asname
					},
					{
						icon: "material-symbols:dns",
						title: "Reverse DNS",
						value: this.ip.reverse
					},
					{
						icon: "mdi:proxy",
						title: "Proxy, VPN or Tor exit Address",
						value: this.ip.proxy.toString()
					},
					{
						icon: "clarity:host-solid",
						title: "Hosting, colocated or data center",
						value: this.ip.hosting.toString()
					}
				]
				this.listitems = items.map(mapIpInfoToListItem)
				return ui.render(new List.List({ items: this.listitems }))
			})
			.catch((error) => {
				console.error(error)
				toast.error("Failed to fetch IP info")
			})
	}
}

expose(new IpInfo())
