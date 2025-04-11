import { Agent } from '@mastra/core/agent';
import { playwrightTools } from '../tools/playwright-mcp';
import { openai } from '@ai-sdk/openai';

export const webBrowserAgent = new Agent({
  name: 'WebBrowserAgent',
  description: 'ウェブサイトにアクセスして情報を取得するエージェント',
  tools: [playwrightTools.accessWebsiteAndScreenshot],
  model: openai('gpt-4o-mini'),
  execute: async ({ url = 'https://logicky.com', run }) => {
    try {
      console.log(`${url}にアクセスします...`);

      // ウェブサイトにアクセスしてスクリーンショットを撮影
      const result = await run('accessWebsiteAndScreenshot', {
        url,
        outputPath: './screenshot.png'
      });

      if (result.success) {
        return {
          result: {
            message: '正常にウェブサイトにアクセスしてスクリーンショットを撮影しました。',
            screenshotPath: result.screenshotPath
          }
        };
      }

      return {
        result: {
          error: result.message
        }
      };
    } catch (error) {
      console.error('エージェント実行エラー:', error);
      return {
        result: {
          error: `エラーが発生しました: ${error.message}`
        }
      };
    }
  }
});