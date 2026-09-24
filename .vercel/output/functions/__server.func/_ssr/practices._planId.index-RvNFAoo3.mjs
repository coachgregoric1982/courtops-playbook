import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as Route$1 } from "./router-BTQHqHHs.mjs";
import { t as PlanEditor } from "./plan-editor-Bl5hcn16.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practices._planId.index-RvNFAoo3.js
var import_jsx_runtime = require_jsx_runtime();
function PlanEditorPage() {
	const { planId } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanEditor, { planId });
}
//#endregion
export { PlanEditorPage as component };
