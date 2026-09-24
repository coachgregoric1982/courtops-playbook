import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as Route$4 } from "./router-BTQHqHHs.mjs";
import { i as PlayEditor } from "./play-editor-DXtSJSBS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playbook._playId-DFvl80n8.js
var import_jsx_runtime = require_jsx_runtime();
function PlayEditorPage() {
	const { playId } = Route$4.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayEditor, { playId });
}
//#endregion
export { PlayEditorPage as component };
