# MarkDoom

**MarkDoom** is an aesthetically pleasing, minimalist desktop journaling application designed for seamless daily writing and note-taking. It combines the simplicity of markdown with modern features to enhance your journaling experience.

## Features

- **Clean, Minimalist Interface** - Focus on your writing without distractions
- **Full Markdown Support** - Express yourself with rich formatting
- **AI-Powered Assistance** - Get journaling prompts and insights powered by Gemini API
- **Works Offline** - Your data stays on your device
- **Cross-Platform** - Available for Windows, Linux, and macOS
- **Free and Open Source** - Use and modify as you need
- **Automatic Saving** - Never lose your thoughts with automatic saving
- **Modern Blur Effects** - Beautiful transparent UI with backdrop blur effects
- **Material Design** - Beautiful, responsive interface

## Screenshots

<div align="center">

![MarkDoom Main Interface](screenshots/1.webp)
*Main interface with markdown editor and file navigation*

![MarkDoom AI Assistant](screenshots/2.webp)
*AI-powered writing assistant using Gemini API*

![MarkDoom AI helpful answers](screenshots/3.webp)
*Helpful answers for your queries by refering to your notes*

</div>

## Installation

### For Users

Download the latest release binaries for your operating system:

- **Windows**: Download the `.exe` installer from the [releases page](https://github.com/binge-coder/MarkDoom/releases)
- **Linux**: Download the `.AppImage` file from the [releases page](https://github.com/binge-coder/MarkDoom/releases)
- **macOS**: Download the `.dmg` file from the [releases page](https://github.com/binge-coder/MarkDoom/releases)

Alternatively, you can find the binaries in the [`dist`](dist) folder after building the project.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or later)
- [Bun Package Manager](https://bun.sh/)

### Running in Development Mode

1. Clone the repository:
   ```bash
   git clone https://github.com/binge-coder/MarkDoom.git
   cd MarkDoom
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

### Building from Source

```bash
# Build for all platforms
bun run build

# Build for specific platforms
bun run build:win    # Windows
bun run build:linux  # Linux
bun run build:mac    # macOS
```

## Technologies Used

- **Frontend**: React.js, TailwindCSS
- **Backend**: Electron.js, Node.js
- **Language**: TypeScript
- **AI Integration**: Gemini API
- **CI/CD**: GitHub Actions

## How It Works

MarkDoom stores your journal entries as Markdown files in the following locations:

- **Windows**: `C:\Users\YourUsername\MarkDoom\`
- **macOS**: `/Users/YourUsername/MarkDoom/`
- **Linux**: `/home/YourUsername/MarkDoom/`

The application provides a rich text editor experience while maintaining the simplicity and portability of plain text files.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

Made with ❤️ by [binge-coder](https://github.com/binge-coder)