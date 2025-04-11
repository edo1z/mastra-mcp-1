import { Tool } from '@mastra/core';
import { z } from 'zod';
import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as playwright from 'playwright';

// MCPサーバー起動用の一時ディレクトリの作成
const tempDir = path.join(os.tmpdir(), 'mastra-mcp');

// MCPクライアント設定ファイルの作成と管理
async function ensureMcpConfig() {
  try {
    await fs.mkdir(tempDir, { recursive: true });
    const configPath = path.join(tempDir, 'mcp-config.json');

    // 設定ファイルを作成
    const config = {
      mcpServers: {
        playwright: {
          command: 'npx',
          args: [
            '@playwright/mcp',
            '--headless'
          ]
        }
      }
    };

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return configPath;
  } catch (error) {
    console.error('MCPの設定ファイル作成に失敗しました:', error);
    throw error;
  }
}

// MCPサーバーを起動する関数
async function startMcpServer() {
  const configPath = await ensureMcpConfig();

  console.log('MCPサーバーを起動中...');
  const mcp = spawn('npx', ['@playwright/mcp', '--headless'], {
    stdio: 'pipe',
    shell: true
  });

  return new Promise<void>((resolve, reject) => {
    mcp.stdout.on('data', (data) => {
      console.log(`MCP出力: ${data}`);
      if (data.toString().includes('Server running')) {
        resolve();
      }
    });

    mcp.stderr.on('data', (data) => {
      console.error(`MCP エラー: ${data}`);
    });

    mcp.on('error', (error) => {
      console.error('MCPサーバー起動エラー:', error);
      reject(error);
    });

    // 10秒後にタイムアウト
    setTimeout(() => {
      resolve();
    }, 10000);
  });
}

export const playwrightTools = {
  // ウェブサイトにアクセスしてスクリーンショットを撮るツール
  accessWebsiteAndScreenshot: {
    id: 'accessWebsiteAndScreenshot',
    description: 'ウェブサイトにアクセスしてスクリーンショットを撮影します',
    schema: {
      input: z.object({
        url: z.string().describe('アクセスするURL'),
        outputPath: z.string().optional().describe('スクリーンショットの保存パス（省略時はtempディレクトリ）')
      }),
      output: z.object({
        success: z.boolean(),
        message: z.string(),
        screenshotPath: z.string().optional()
      })
    },
    execute: async ({ url, outputPath }) => {
      try {
        await startMcpServer();

        // スクリーンショットを保存するパスを設定
        const savePath = outputPath || path.join(tempDir, `screenshot-${Date.now()}.png`);

        // Playwrightでのブラウザアクセスとスクリーンショットを実行
        const browser = await playwright.chromium.launch({ headless: true });
        const page = await browser.newPage();

        console.log(`${url}にアクセス中...`);
        await page.goto(url);

        console.log('スクリーンショットを撮影中...');
        await page.screenshot({ path: savePath });

        await browser.close();

        return {
          success: true,
          message: `スクリーンショットを保存しました: ${savePath}`,
          screenshotPath: savePath
        };
      } catch (error) {
        console.error('ウェブアクセスエラー:', error);
        return {
          success: false,
          message: `エラーが発生しました: ${error.message}`
        };
      }
    }
  }
};