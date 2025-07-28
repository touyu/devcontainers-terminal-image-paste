# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension that enables pasting images from clipboard to DevContainer workspaces when using the terminal. It intercepts Cmd+V in terminal when a remote container is active and saves clipboard images to the workspace.

## Build and Development Commands

```bash
# Package the extension
npm run package

# Publish to VS Code marketplace
npm run publish

# Install dependencies
npm install
```

## Architecture

The extension is a single-file VS Code extension (src/extension.js) that:

1. **Activation**: Registers a command `devcontainers-terminal-image-paste.pasteImage` that overrides Cmd+V in terminal when in a remote environment
2. **Clipboard Detection**: Uses AppleScript on macOS to detect and retrieve images from clipboard (both file references and raw image data)
3. **Image Saving**: Saves images to a configurable directory in the workspace with timestamped filenames
4. **Terminal Integration**: Inserts the saved file path into the active terminal

## Key Implementation Details

- **Platform**: Currently macOS-only due to AppleScript dependency
- **Image Formats**: Supports PNG, JPG, JPEG, GIF, BMP, TIFF, WEBP
- **Configuration Options**:
  - `devcontainersTerminalImagePaste.enabled`: Toggle feature on/off
  - `devcontainersTerminalImagePaste.saveDir`: Directory for saved images (default: "images")
  - `devcontainersTerminalImagePaste.fileNamePattern`: Filename pattern with {timestamp} placeholder
- **Fallback**: If no image is detected or on error, falls back to normal terminal paste command