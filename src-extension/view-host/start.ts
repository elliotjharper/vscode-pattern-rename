import * as vscode from 'vscode';
import { viewTitle, viewType } from './constants';

function getTemplate(): string {
    // .html uses the webpack raw-loader
    let template = require('../../src-webview/view.html').default as string;

    // .js uses the webpack url-loader
    let scriptPath = require('../../dist-webview/bundle.js').default as string;
    template = template.replace('bundle.js', scriptPath);

    // .css uses the webpack url-loader
    let bulmaStylePath = require('../../node_modules/bulma/css/bulma.css').default as string;
    template = template.replace('bulma.css', bulmaStylePath);
    let stylePath = require('../../src-webview/view.css').default as string;
    template = template.replace('view.css', stylePath);

    return template;
}

export function startRenameView(): vscode.WebviewPanel {
    const template = getTemplate();

    const panel = vscode.window.createWebviewPanel(
        viewType, // Identifies the type of the webview. Used internally
        viewTitle, // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
            enableScripts: true,
        } // Webview options. More on these later.
    );

    panel.webview.html = template;

    return panel;
}
