/**
 * Web Search is a combination of trigger node and open url actin node.
 */

import { v4 as uuidv4 } from "uuid"
import { NodeType, Workflow } from "../workflow"
import { OpenUrlNode } from "../workflow/actions/open-url"
import { ArgumentRequired, NodeTypeInput } from "../workflow/common"
import { KeywordTriggerNode } from "../workflow/inputs/keyword-trigger"

// export const GoogleSearch: Workflow = {
//     name: "Google Search",
//     version: "0.0.1",
//     appVersion: "0.0.1",
//     author: 'Huakun',
//     uuid: 'jarvis://builtin:google-search',
//     nodes: {
//         'uuidv4()': {
//             type: NodeTypeInput.value,
//             name: 'xxx',
//             argType: ArgumentRequired.value,
//             keyword: "google",
//             workflowIcon: "",
//             title: "google",
//             subtext: "google search",
//         }
//     },
//     edges: [],
// }
