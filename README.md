# VibeCode Clone

A full-stack development platform with AI integration, Monaco Editor, and secure Docker execution environments.

## Features

- **Monaco Editor Integration**: Professional code editing experience
- **Live Preview**: Real-time HTML/CSS/JS preview
- **Secure Code Execution**: Docker-based sandboxes for safe code execution
- **AI Assistant**: Integrated AI for code completion and assistance
- **Terminal Access**: Full terminal experience in the browser
- **Multi-language Support**: JavaScript, Python, Java, C++, Go
- **Real-time Collaboration**: WebSocket-based collaborative editing
- **Customizable Settings**: Themes, fonts, and editor preferences

## Architecture

### Frontend (React)
- **Components**:
  - `Sidebar`: File explorer and navigation
  - `Editor`: Monaco-based code editor
  - `Terminal`: Xterm.js terminal emulator
  - `LivePreview`: Real-time preview pane
  - `Settings`: Configuration interface

### Backend (Node.js + Express)
- **Services**:
  - `codeExecution`: Secure Docker-based code execution
  - `docker`: Container management
  - `ai`: AI integration for code assistance
- **WebSocket Support**: Real-time communication
- **Security**: Rate limiting, CORS, Helmet

### Docker Configuration
- **Sandboxes**: Isolated execution environments
- **Multi-language**: Support for various programming languages
- **Resource Limits**: Memory and CPU constraints
- **Network Isolation**: No external network access

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Redis (for session management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibecode-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start with Docker**
   ```bash
   npm run docker:up
   ```

   Or start development servers:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Building for Production
```bash
npm run build
```

## Configuration

### Environment Variables

#### Backend (`.env`)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `PORT`: Backend server port (default: 5000)
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret

#### Frontend
- `REACT_APP_API_URL`: Backend API URL

### Docker Configuration

The application uses Docker Compose for orchestration:
- **Frontend**: React development server
- **Backend**: Node.js Express server
- **Redis**: Session and cache storage
- **Sandbox**: Secure code execution environment

## API Endpoints

### Code Execution
- `POST /api/execute`: Execute code in a sandbox
- `POST /api/ai/complete`: AI code completion
- `GET /api/health`: Health check

### WebSocket Events
- `run-code`: Execute code
- `terminal-input`: Terminal command
- `ai-request`: AI assistance request
- `code-change`: Real-time code updates

## Security Features

1. **Docker Sandboxes**: Isolated execution environments
2. **Resource Limits**: CPU and memory constraints
3. **Network Isolation**: No external network access from sandboxes
4. **Rate Limiting**: API request throttling
5. **Input Validation**: Secure input handling
6. **CORS Configuration**: Cross-origin request protection

## Supported Languages

- JavaScript/Node.js
- Python 3
- Java
- C/C++
- Go
- HTML/CSS (Live Preview)

## AI Integration

The platform integrates with OpenAI GPT-4 for:
- Code completion
- Bug detection
- Code explanation
- Performance optimization suggestions
- Error debugging assistance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

Built with ❤️ using React, Node.js, Docker, and AI
