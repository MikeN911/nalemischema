const vscode = require('vscode');

let inlineDecorationType = null;
let lineDecorationType = null;
let updateTimeout = null;

function toTransparentColor(color) {
    if (!color) return 'rgba(0, 0, 0, 0.086)';
    if (color.startsWith('rgba') || color.startsWith('hsla') || color.length === 9) {
        return color;
    }
    if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
        let hex = color.slice(1);
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const minVal = Math.min(r, g, b);
        const alpha = Math.max(0.04, Math.min(0.9, (255 - minVal) / 255));
        const tr = Math.round((r - 255 * (1 - alpha)) / alpha);
        const tg = Math.round((g - 255 * (1 - alpha)) / alpha);
        const tb = Math.round((b - 255 * (1 - alpha)) / alpha);
        const clamp = v => Math.max(0, Math.min(255, v));
        return `rgba(${clamp(tr)}, ${clamp(tg)}, ${clamp(tb)}, ${alpha.toFixed(3)})`;
    }
    return color;
}

function getDecorationTypes() {
    const config = vscode.workspace.getConfiguration('nalemischema');
    const enabled = config.get('phpBackground.enabled', true);
    const rawColor = config.get('phpBackground.color', '#E9E9E9');
    const color = toTransparentColor(rawColor);

    if (inlineDecorationType) inlineDecorationType.dispose();
    if (lineDecorationType) lineDecorationType.dispose();

    if (!enabled) {
        inlineDecorationType = null;
        lineDecorationType = null;
        return;
    }

    inlineDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: color,
        isWholeLine: false
    });

    lineDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: color,
        isWholeLine: true
    });
}

function findPhpBlocks(text) {
    const len = text.length;
    let i = 0;
    const blocks = [];

    while (i < len) {
        const openIdx = text.indexOf('<?', i);
        if (openIdx === -1) break;

        let closeIdx = -1;
        let pos = openIdx + 2;
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inLineComment = false;
        let inBlockComment = false;

        while (pos < len) {
            const ch = text[pos];
            const nextCh = pos + 1 < len ? text[pos + 1] : '';

            if (inLineComment) {
                if (ch === '\n') {
                    inLineComment = false;
                } else if (ch === '?' && nextCh === '>') {
                    inLineComment = false;
                    closeIdx = pos + 2;
                    break;
                }
            } else if (inBlockComment) {
                if (ch === '*' && nextCh === '/') {
                    inBlockComment = false;
                    pos++;
                }
            } else if (inSingleQuote) {
                if (ch === '\\') {
                    pos++;
                } else if (ch === "'") {
                    inSingleQuote = false;
                }
            } else if (inDoubleQuote) {
                if (ch === '\\') {
                    pos++;
                } else if (ch === '"') {
                    inDoubleQuote = false;
                }
            } else {
                if (ch === "'") {
                    inSingleQuote = true;
                } else if (ch === '"') {
                    inDoubleQuote = true;
                } else if (ch === '/' && nextCh === '/') {
                    inLineComment = true;
                    pos++;
                } else if (ch === '#') {
                    inLineComment = true;
                } else if (ch === '/' && nextCh === '*') {
                    inBlockComment = true;
                    pos++;
                } else if (ch === '?' && nextCh === '>') {
                    closeIdx = pos + 2;
                    break;
                }
            }
            pos++;
        }

        if (closeIdx === -1) {
            closeIdx = len;
        }

        blocks.push({ start: openIdx, end: closeIdx });
        i = closeIdx;
    }
    return blocks;
}

function updateEditorDecorations(editor) {
    if (!editor || !editor.document) return;
    const doc = editor.document;
    if (doc.languageId !== 'php' && !doc.fileName.endsWith('.php') && !doc.fileName.endsWith('.phtml')) {
        return;
    }

    if (!inlineDecorationType || !lineDecorationType) {
        if (inlineDecorationType) editor.setDecorations(inlineDecorationType, []);
        if (lineDecorationType) editor.setDecorations(lineDecorationType, []);
        return;
    }

    const text = doc.getText();
    const blocks = findPhpBlocks(text);

    const inlineRanges = [];
    const lineRanges = [];

	for (const block of blocks) {
		const startPos = doc.positionAt(block.start);
		const endPos = doc.positionAt(block.end);
		const hasClosingTag = text.slice(block.end - 2, block.end) === '?>';
		const firstLineText = doc.lineAt(startPos.line).text;
		const isPhpAloneOnFirstLine = /^<\?(?:php)?\s*$/i.test(firstLineText);

		if (startPos.line === endPos.line) {
			// Jednořádkový blok: <?php ... ?> nebo <?=$var?>
			if (isPhpAloneOnFirstLine) {
				lineRanges.push(new vscode.Range(startPos.line, 0, startPos.line, 0));
			} else {
				// Odsazení před <? a text po ?> zůstávají bez podbarvení
				inlineRanges.push(new vscode.Range(startPos, endPos));
			}
		} else {
			// Víceřádkový blok
			// 1. První řádek: pokud je <?php sám na řádku bez mezer před ním a bez ?>, podbarví se celý řádek
			if (isPhpAloneOnFirstLine) {
				lineRanges.push(new vscode.Range(startPos.line, 0, startPos.line, 0));
			} else {
				// Odsazení nebo text před <?php zůstává bez podbarvení
				inlineRanges.push(new vscode.Range(startPos, new vscode.Position(startPos.line, firstLineText.length)));
			}

			// 2. Mezilehlé a koncové řádky
			if (hasClosingTag) {
				// Mezilehlé řádky: čistě PHP kód
				for (let l = startPos.line + 1; l < endPos.line; l++) {
					lineRanges.push(new vscode.Range(l, 0, l, 0));
				}

				// 3. Poslední řádek: od sloupce 0 (odsazení před ?>) až po endPos (?>)
				// Odsazení před ?> má podbarvení; cokoliv za ?> zůstává bez podbarvení
				inlineRanges.push(new vscode.Range(new vscode.Position(endPos.line, 0), endPos));
			} else {
				// Bez uzavíracího tagu ?>: všechny zbývající řádky až do konce souboru jsou čistě PHP
				for (let l = startPos.line + 1; l <= endPos.line; l++) {
					lineRanges.push(new vscode.Range(l, 0, l, 0));
				}
			}
		}
	}

    editor.setDecorations(lineDecorationType, lineRanges);
    editor.setDecorations(inlineDecorationType, inlineRanges);
}

function triggerUpdateDecorations(editor) {
    if (updateTimeout) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        if (editor) {
            updateEditorDecorations(editor);
        } else {
            vscode.window.visibleTextEditors.forEach(updateEditorDecorations);
        }
    }, 40);
}

function activate(context) {
    getDecorationTypes();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('nalemischema.phpBackground')) {
                getDecorationTypes();
                vscode.window.visibleTextEditors.forEach(updateEditorDecorations);
            }
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) triggerUpdateDecorations(editor);
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(activeEditor);
            }
        })
    );

    vscode.window.visibleTextEditors.forEach(updateEditorDecorations);
}

function deactivate() {
    if (inlineDecorationType) inlineDecorationType.dispose();
    if (lineDecorationType) lineDecorationType.dispose();
}

module.exports = {
    activate,
    deactivate
};
