import { Agent } from '@mastra/core/agent';
import { MCPConfiguration } from '@mastra/mcp';
import { openai } from '@ai-sdk/openai';

// MCPの設定
export const mcp = new MCPConfiguration({
  servers: {
    playwright: {
      command: 'npx',
      args: [
        '@playwright/mcp@latest',
        '--headless'
      ],
    },
  },
});

// Agentインスタンスを作成
export const webBrowserAgent = new Agent({
  name: 'WebBrowserAgent',
  model: openai('gpt-4o-mini'),
  tools: await mcp.getTools(),
  instructions: 'あなたはウェブサイトにアクセスして情報を取得するエージェントです。'
});

// MCPの接続を閉じる関数
export const disconnect = async () => {
  await mcp.disconnect();
};
