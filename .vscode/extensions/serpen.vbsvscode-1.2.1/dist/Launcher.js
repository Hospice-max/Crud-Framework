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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineDebugAdapterFactory = exports.DebugConfigurationProvider = exports.VbsDebugSession = void 0;
const vscode_debugadapter_1 = require("vscode-debugadapter");
const vscode = __importStar(require("vscode"));
const path_1 = require("path");
const child_process_1 = require("child_process");
const diagCollection = vscode.languages.createDiagnosticCollection("vbs");
class VbsDebugSession extends vscode_debugadapter_1.LoggingDebugSession {
    constructor() {
        super();
    }
    initializeRequest(response) {
        response.body = response.body || {};
        response.body.supportsConfigurationDoneRequest = true;
        response.body.supportsCancelRequest = false;
        response.body.supportsTerminateRequest = true;
        this.sendResponse(response);
    }
    async launchRequest(response, args) {
        diagCollection.clear();
        const workDir = path_1.dirname(args.program);
        this.sendResponse(response);
        const configuration = vscode.workspace.getConfiguration("vbs");
        const scriptInterpreter = configuration.get("interpreter");
        this._runner = child_process_1.spawn(scriptInterpreter, [args.program], { "cwd": workDir });
        this._runner.stdout.on("data", data => {
            this.sendEvent(new vscode_debugadapter_1.OutputEvent(data.toString(), "stdout"));
        });
        this._runner.stderr.on("data", data => {
            const output = data.toString();
            const match = (/.*\((\d+), (\d+)\) (.*)/).exec(output);
            if (match) {
                const line = Number.parseInt(match[1]) - 1;
                const char = Number.parseInt(match[2]) - 1;
                const diag = new vscode.Diagnostic(new vscode.Range(line, char, line, char), match[3], vscode.DiagnosticSeverity.Error);
                diagCollection.set(vscode.Uri.file(args.program), [diag]);
            }
            this.sendEvent(new vscode_debugadapter_1.OutputEvent(output, "stderr"));
        });
        this._runner.on("exit", code => {
            this.sendEvent(new vscode_debugadapter_1.OutputEvent(`Process [${this._runner.pid}] exited with code ${code} (&H${code.toString(16).toUpperCase()})`));
            this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        });
    }
    terminateRequest(response, _args, _req) {
        var _a;
        (_a = this._runner) === null || _a === void 0 ? void 0 : _a.kill();
        this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        this.sendResponse(response);
    }
}
exports.VbsDebugSession = VbsDebugSession;
class DebugConfigurationProvider {
    resolveDebugConfiguration(_folder, config) {
        const editor = vscode.window.activeTextEditor;
        if (!config || !config.request) {
            if (editor && editor.document.languageId === "vbs") {
                config.type = "vbs";
                config.name = "CScript";
                config.request = "launch";
                config.program = editor.document.uri.fsPath;
            }
            else
                return;
        }
        if (!config.program || !editor || editor.document.languageId !== "vbs") {
            return vscode.window.showInformationMessage("Cannot find a program to debug").then(() => {
                return undefined;
            });
        }
        return config;
    }
}
exports.DebugConfigurationProvider = DebugConfigurationProvider;
class InlineDebugAdapterFactory {
    createDebugAdapterDescriptor() {
        return new vscode.DebugAdapterInlineImplementation(new VbsDebugSession());
    }
}
exports.InlineDebugAdapterFactory = InlineDebugAdapterFactory;
const launchConfigProvider = vscode.debug.registerDebugConfigurationProvider("vbs", new DebugConfigurationProvider());
const inlineDebugAdapterFactory = vscode.debug.registerDebugAdapterDescriptorFactory("vbs", new InlineDebugAdapterFactory());
exports.default = { launchConfigProvider, inlineDebugAdapterFactory };
//# sourceMappingURL=Launcher.js.map