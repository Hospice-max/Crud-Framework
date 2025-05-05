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
exports.killScript = exports.runScript = void 0;
const vscode_1 = require("vscode");
const childProcess = __importStar(require("child_process"));
const path_1 = __importDefault(require("path"));
const localize_1 = __importDefault(require("./localize"));
const fs = __importStar(require("fs"));
const configuration = vscode_1.workspace.getConfiguration("vbs");
const vbsOut = vscode_1.window.createOutputChannel("VBScript");
let runner;
const scriptInterpreter = configuration.get("interpreter");
let statbar;
function runScript() {
    if (!vscode_1.window.activeTextEditor)
        return;
    try {
        fs.accessSync(scriptInterpreter, fs.constants.X_OK);
    }
    catch {
        vscode_1.window.showErrorMessage(`${localize_1.default("vbs.msg.interpreterRunError")} ${scriptInterpreter}`);
    }
    const doc = vscode_1.window.activeTextEditor.document;
    doc.save().then(() => {
        vbsOut.clear();
        vbsOut.show(true);
        const workDir = path_1.default.dirname(doc.fileName);
        if (statbar)
            statbar.dispose();
        statbar = vscode_1.window.setStatusBarMessage(localize_1.default("vbs.msg.runningscript"));
        runner = childProcess.spawn(scriptInterpreter, [doc.fileName], {
            cwd: workDir
        });
        runner.stdout.on("data", data => {
            const output = data.toString();
            vbsOut.append(output);
        });
        runner.stderr.on("data", data => {
            const output = data.toString();
            vbsOut.append(output);
        });
        runner.on("exit", code => {
            vbsOut.appendLine(`Process exited with code ${code}`);
            statbar.dispose();
        });
    }, () => {
        vscode_1.window.showErrorMessage("Document can' be saved");
        return;
    });
}
exports.runScript = runScript;
function killScript() {
    runner === null || runner === void 0 ? void 0 : runner.kill();
    statbar === null || statbar === void 0 ? void 0 : statbar.dispose();
}
exports.killScript = killScript;
//# sourceMappingURL=commands.js.map