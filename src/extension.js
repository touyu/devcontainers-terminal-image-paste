const vscode = require('vscode');
const { exec, execFile } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('DevContainer Terminal Image Paste extension is now active');
    console.log('Extension running on:', process.platform);
    console.log('Extension host:', vscode.env.remoteName || 'local');
    console.log('Is remote:', vscode.env.remoteName ? true : false);

    let disposable = vscode.commands.registerCommand('devcontainers-terminal-image-paste.pasteImage', async () => {
        try {
            // Check if the feature is enabled in workspace settings
            const config = vscode.workspace.getConfiguration('devcontainersTerminalImagePaste');
            const isEnabled = config.get('enabled', true);
            
            if (!isEnabled) {
                // Feature is disabled, perform normal paste
                await vscode.commands.executeCommand('workbench.action.terminal.paste');
                return;
            }
            
            // Get clipboard image using AppleScript
            const imagePath = await getClipboardImage();
            
            if (!imagePath) {
                // No image in clipboard, perform normal paste
                await vscode.commands.executeCommand('workbench.action.terminal.paste');
                return;
            }

            // Save image to workspace
            const savedPath = await saveImageToWorkspace(imagePath);
            
            if (savedPath) {
                // Send saved path to terminal
                const terminal = vscode.window.activeTerminal;
                if (terminal) {
                    const relativePath = vscode.workspace.asRelativePath(savedPath);
                    terminal.sendText(`${relativePath}`, false);
                }
                
                // Show notification
                vscode.window.showInformationMessage(`Image saved: ${vscode.workspace.asRelativePath(savedPath)}`);
            }
        } catch (error) {
            console.error('Error pasting image:', error);
            // Fall back to normal paste on error
            await vscode.commands.executeCommand('workbench.action.terminal.paste');
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Get clipboard image using AppleScript
 * @returns {Promise<string|null>} Path to temporary file or null if no image
 */
async function getClipboardImage() {
    console.log('Attempting to get clipboard image on platform:', process.platform);
    
    const appleScript = `
    -- First check for file URL (to avoid icon issue)
    try
        set fileURL to the clipboard as «class furl»
        set filePath to POSIX path of fileURL
        
        -- Check if the file is an image
        set fileExt to do shell script "echo " & quoted form of filePath & " | sed 's/.*\\\\.//' | tr '[:upper:]' '[:lower:]'"
        if fileExt is in {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"} then
            return filePath
        end if
    on error
        -- No file URL or not an image file
    end try
    
    -- If no file URL, try to get direct image data (e.g., from screenshots)
    try
        set pngData to the clipboard as «class PNGf»
        set outFile to POSIX path of (path to temporary items folder) & "vscode_clip_" & (do shell script "date +%s") & ".png"
        set fh to open for access (outFile as POSIX file) with write permission
        set eof of fh to 0
        write pngData to fh
        close access fh
        return outFile
    on error
        return ""
    end try
    `;

    try {
        const { stdout } = await execFileAsync('osascript', ['-e', appleScript]);
        const filePath = stdout.trim();
        
        if (filePath) {
            // Verify file exists
            await fs.access(filePath);
            return filePath;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting clipboard image:', error);
        return null;
    }
}

/**
 * Save image to workspace
 * @param {string} sourcePath Path to source image
 * @returns {Promise<string|null>} Path to saved file or null on error
 */
async function saveImageToWorkspace(sourcePath) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder open');
        return null;
    }

    const config = vscode.workspace.getConfiguration('devcontainersTerminalImagePaste');
    const saveDir = config.get('saveDir', 'images');
    const fileNamePattern = config.get('fileNamePattern', 'clipboard-{timestamp}.png');

    const workspaceRoot = workspaceFolders[0].uri;
    const dirUri = vscode.Uri.joinPath(workspaceRoot, saveDir);

    try {
        // Create directory if it doesn't exist
        await vscode.workspace.fs.createDirectory(dirUri);

        // Generate filename with correct extension
        const sourceExt = path.extname(sourcePath).toLowerCase() || '.png';
        const fileName = generateFileName(fileNamePattern).replace('.png', sourceExt);
        const fileUri = vscode.Uri.joinPath(dirUri, fileName);

        // Read source file
        const imageData = await fs.readFile(sourcePath);

        // Write to workspace (convert Buffer to Uint8Array)
        await vscode.workspace.fs.writeFile(fileUri, new Uint8Array(imageData));

        // Clean up temporary file only if it's in temp directory
        if (sourcePath.includes('vscode_clip_')) {
            try {
                await fs.unlink(sourcePath);
            } catch (error) {
                console.error('Error cleaning up temp file:', error);
            }
        }

        return fileUri.fsPath;
    } catch (error) {
        console.error('Error saving image to workspace:', error);
        vscode.window.showErrorMessage(`Failed to save image: ${error.message}`);
        return null;
    }
}

/**
 * Generate filename from pattern
 * @param {string} pattern Filename pattern
 * @returns {string} Generated filename
 */
function generateFileName(pattern) {
    const timestamp = new Date().toISOString()
        .replace(/:/g, '-')
        .replace(/\./g, '-')
        .replace('T', '_')
        .slice(0, -1); // Remove 'Z' at the end
    
    return pattern.replace('{timestamp}', timestamp);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};