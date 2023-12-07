// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

//const { Configuration, OpenAIApi } = require("openai");
// const * as openapi from "openai"
// require("dotenv-safe").config();
// console.log(process.env)
import * as vscode from 'vscode';

// // import { ChatPanel } from './ChatPanel';
// // import OpenAI from "openai";
// // import {Configuration, OpenAIApi} OpenAI

// const configuration = new Configuration({
// });
// const openai = new OpenAIApi(configuration);

// async function runCompletion (text:string) {
//     const completion = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: text,
//     max_tokens:4000
//     });
//     console.log(completion.data.choices[0].text);
// 	return completion.data.choices[0].text;
// }

import * as https from 'https';
const config = require(".././config.json");


async function runCompletion(inputMessages: Object): Promise<string> {
   // Replace with your actual OpenAI API key
	const apiKey=config.API_KEY;
    const model = 'gpt-3.5-turbo'; // Adjust the model as needed

    const data = JSON.stringify({
        model,
        messages: inputMessages,
        max_tokens: 4000,
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': data.length,
        },
    };

    return new Promise<string>((resolve, reject) => {
        const req = https.request(options, (res) => {
            let result = '';

            res.on('data', (chunk) => {
                result += chunk;
            });

            res.on('end', () => {
				console.log(result);
				//completion.choices[0].message.content
                resolve(JSON.parse(result).choices[0].message.content);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codecraftcomrade" is now active!');

	const provider = new CCC(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CCC.viewType, provider));

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// context.subscriptions.push(
	// 	 vscode.commands.registerCommand('codecraftcomrade.askGPT', () => {
	// 	       ChatPanel.createOrShow(context.extensionUri);
	//    })
	// );

	
}



class CCC implements vscode.WebviewViewProvider {

	public static readonly viewType = "CCC.askGPT";

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
			
			
       
		webviewView.webview.onDidReceiveMessage(async data => {
			switch (data.command) {
				case 'sendMessage':
					{
						const inputMessages = data.text;
						try {
							const result = await runCompletion(inputMessages);
							webviewView.webview.postMessage({ 
								 type: "response",
								 result: result
							});
							console.log('OpenAI API Response:', result);
						} catch (error) {
							console.error('Failed to call OpenAI API:', error);
						}



						//var response = runCompletion(data.text);
						// vscode.window.showErrorMessage(response);
						//vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
						break;
					}
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out/compiled', 'bundle.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src ${webview.cspSource};">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">

			
			</head>
			<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// This method is called when your extension is deactivated
export function deactivate() {}