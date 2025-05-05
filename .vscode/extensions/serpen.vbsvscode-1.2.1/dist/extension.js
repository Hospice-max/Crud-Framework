"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const hover_1 = __importDefault(require("./hover"));
const completion_1 = __importDefault(require("./completion"));
const symbols_1 = __importDefault(require("./symbols"));
const signature_1 = __importDefault(require("./signature"));
const definition_1 = __importDefault(require("./definition"));
const colorprovider_1 = __importDefault(require("./colorprovider"));
const Launcher_1 = __importDefault(require("./Launcher"));
const cmds = __importStar(require("./commands"));
const Includes_1 = require("./Includes");
function activate(context) {
    Includes_1.Includes.set("Global", new Includes_1.IncludeFile(context.asAbsolutePath("./GlobalDefs.vbs")));
    Includes_1.Includes.set("ObjectDefs", new Includes_1.IncludeFile(context.asAbsolutePath("./ObjectDefs.vbs")));
    vscode_1.workspace.onDidChangeConfiguration(Includes_1.reloadImportDocuments);
    Includes_1.reloadImportDocuments();
    context.subscriptions.push(hover_1.default, completion_1.default, symbols_1.default, signature_1.default, definition_1.default, colorprovider_1.default, Launcher_1.default.launchConfigProvider, Launcher_1.default.inlineDebugAdapterFactory);
    vscode_1.commands.registerCommand("vbs.runScript", () => {
        cmds.runScript();
    });
    vscode_1.commands.registerCommand("vbs.killScript", () => {
        cmds.killScript();
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map