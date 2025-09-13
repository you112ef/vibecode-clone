const Docker = require('dockerode');
const { v4: uuidv4 } = require('uuid');

class DockerService {
  constructor() {
    this.docker = new Docker();
    this.containers = new Map();
  }

  async createSandbox(userId) {
    const containerId = uuidv4();
    
    try {
      const container = await this.docker.createContainer({
        Image: 'ubuntu:20.04',
        Cmd: ['/bin/bash'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true,
        Tty: true,
        WorkingDir: '/workspace',
        HostConfig: {
          Memory: 256 * 1024 * 1024, // 256MB
          CpuQuota: 50000, // 50% CPU
          NetworkMode: 'none',
          ReadonlyRootfs: false,
          Tmpfs: {
            '/workspace': 'rw,size=100m',
            '/tmp': 'rw,size=50m'
          },
          AutoRemove: true
        },
        Labels: {
          'vibecode.user': userId,
          'vibecode.type': 'sandbox'
        }
      });

      await container.start();
      
      this.containers.set(containerId, {
        container,
        userId,
        createdAt: new Date()
      });

      return {
        containerId,
        status: 'running'
      };

    } catch (error) {
      throw new Error(`Failed to create sandbox: ${error.message}`);
    }
  }

  async executeCommand(containerId, command) {
    const containerInfo = this.containers.get(containerId);
    
    if (!containerInfo) {
      throw new Error('Container not found');
    }

    try {
      const exec = await containerInfo.container.exec({
        Cmd: ['sh', '-c', command],
        AttachStdout: true,
        AttachStderr: true,
        Tty: false
      });

      const stream = await exec.start();
      
      return new Promise((resolve, reject) => {
        let output = '';
        let error = '';

        containerInfo.container.modem.demuxStream(stream,
          (chunk) => { output += chunk.toString(); },
          (chunk) => { error += chunk.toString(); }
        );

        stream.on('end', () => {
          resolve({
            output: output.trim(),
            error: error.trim(),
            exitCode: 0
          });
        });

        stream.on('error', reject);

        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error('Command execution timed out'));
        }, 10000);
      });

    } catch (error) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  async destroySandbox(containerId) {
    const containerInfo = this.containers.get(containerId);
    
    if (!containerInfo) {
      return false;
    }

    try {
      await containerInfo.container.kill();
      this.containers.delete(containerId);
      return true;
    } catch (error) {
      console.error('Failed to destroy sandbox:', error);
      return false;
    }
  }

  async listSandboxes(userId) {
    const userContainers = [];
    
    for (const [containerId, info] of this.containers.entries()) {
      if (info.userId === userId) {
        userContainers.push({
          containerId,
          createdAt: info.createdAt,
          status: 'running'
        });
      }
    }

    return userContainers;
  }

  // Cleanup old containers
  async cleanup() {
    const now = new Date();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours

    for (const [containerId, info] of this.containers.entries()) {
      if (now - info.createdAt > maxAge) {
        await this.destroySandbox(containerId);
      }
    }
  }
}

module.exports = new DockerService();
