# DevContainer Terminal Paste

VS Code extension that enables pasting images from clipboard directly into DevContainer terminals.

## Features

- **Image Paste in Terminal**: Press `Cmd+V` in a DevContainer terminal to automatically save clipboard images to your workspace
- **Smart Detection**: Automatically detects images in clipboard and falls back to normal paste for text
- **Customizable**: Configure save location and filename patterns
- **File Path Insertion**: Automatically inserts the saved image path into your terminal

## Requirements

- VS Code 1.74.0 or higher
- macOS (currently only supports macOS due to AppleScript dependency)
- Active DevContainer or remote connection

## Installation

Install from the VS Code Marketplace or manually:

```bash
# Clone the repository
git clone https://github.com/touyu/devcontainers-terminal-image-paste.git

# Install dependencies
npm install

# Package the extension
npm run package

# Install the VSIX file in VS Code
code --install-extension devcontainer-terminal-paste-0.0.1.vsix
```

## Usage

1. Open a terminal in your DevContainer
2. Copy an image to your clipboard (screenshot, file copy, etc.)
3. Focus the terminal and press `Cmd+V`
4. The image will be saved to your workspace and the file path inserted

## Extension Settings

Configure the extension through VS Code settings:

- `clipboardImagePaste.enabled`: Enable/disable the extension (default: `true`)
- `clipboardImagePaste.saveDir`: Directory to save images relative to workspace root (default: `"images"`)
- `clipboardImagePaste.fileNamePattern`: Filename pattern for saved images (default: `"clipboard-{timestamp}.png"`)
  - `{timestamp}` will be replaced with current date/time

### Example Configuration

```json
{
  "clipboardImagePaste.enabled": true,
  "clipboardImagePaste.saveDir": "./screenshots",
  "clipboardImagePaste.fileNamePattern": "screenshot-{timestamp}.png"
}
```

## Supported Image Formats

- PNG
- JPG/JPEG
- GIF
- BMP
- TIFF
- WebP

## Known Issues

- Currently only supports macOS
- Requires DevContainer or remote connection to activate

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the [MIT License](LICENSE.md).

## Author

Yuto Akiba ([@touyu](https://github.com/touyu))