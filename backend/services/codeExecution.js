const Docker = require('dockerode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class CodeExecutionService {
  constructor() {
    this.docker = new Docker();
    this.tempDir = '/tmp/vibecode';
    this.initTempDir();
  }

  async initTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  async execute(code, language = 'javascript', stdin = '') {
    const executionId = uuidv4();
    const workDir = path.join(this.tempDir, executionId);

    try {
      await fs.mkdir(workDir);
      
      const config = this.getLanguageConfig(language);
      const filename = path.join(workDir, config.filename);
      
      await fs.writeFile(filename, code);
      
      if (stdin) {
        await fs.writeFile(path.join(workDir, 'input.txt'), stdin);
      }

      const container = await this.docker.createContainer({
        Image: config.image,
        Cmd: config.cmd,
        WorkingDir: '/app',
        HostConfig: {
          Memory: 128 * 1024 * 1024, // 128MB
          CpuQuota: 50000, // 50% CPU
          NetworkMode: 'none',
          ReadonlyRootfs: true,
          Binds: [`${workDir}:/app:ro`],
          AutoRemove: true
        },
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: !!stdin,
        OpenStdin: !!stdin,
        StdinOnce: !!stdin
      });

      await container.start();

      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        stdin: !!stdin
      });

      let output = '';
      let error = '';

      return new Promise((resolve) => {
        container.modem.demuxStream(stream, 
          (chunk) => { output += chunk.toString(); },
          (chunk) => { error += chunk.toString(); }
        );

        stream.on('end', async () => {
          await this.cleanup(workDir);
          
          resolve({
            output: output.trim(),
            error: error.trim(),
            exitCode: 0,
            executionTime: Date.now()
          });
        });

        // Timeout after 30 seconds
        setTimeout(async () => {
          try {
            await container.kill();
          } catch (e) {
            // Container might already be stopped
          }
          await this.cleanup(workDir);
          
          resolve({
            output: output.trim(),
            error: error.trim() + '\nExecution timed out after 30 seconds',
            exitCode: 124,
            executionTime: Date.now()
          });
        }, 30000);
      });

    } catch (error) {
      await this.cleanup(workDir);
      throw new Error(`Execution failed: ${error.message}`);
    }
  }

  getLanguageConfig(language) {
    const configs = {
      javascript: {
        image: 'node:18-alpine',
        filename: 'script.js',
        cmd: ['node', '/app/script.js']
      },
      python: {
        image: 'python:3.11-alpine',
        filename: 'script.py',
        cmd: ['python', '/app/script.py']
      },
      java: {
        image: 'openjdk:17-alpine',
        filename: 'Main.java',
        cmd: ['sh', '-c', 'javac /app/Main.java && java -cp /app Main']
      },
      cpp: {
        image: 'gcc:latest',
        filename: 'main.cpp',
        cmd: ['sh', '-c', 'g++ -o /tmp/main /app/main.cpp && /tmp/main']
      },
      go: {
        image: 'golang:1.21-alpine',
        filename: 'main.go',
        cmd: ['go', 'run', '/app/main.go']
      }
    };

    return configs[language] || configs.javascript;
  }

  async cleanup(workDir) {
    try {
      await fs.rmdir(workDir, { recursive: true });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

module.exports = new CodeExecutionService();
