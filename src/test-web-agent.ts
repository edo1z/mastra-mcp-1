import 'dotenv/config';
import { mastra } from './mastra/index';
import { webBrowserAgent } from './mastra/agents/web-browser-agent';

async function main() {
  try {
    console.log('ウェブブラウザエージェントをテスト中...');

    console.log('mastraオブジェクト:', mastra);
    console.log('エージェントを直接使用します...');

    console.log('エージェントの情報:', webBrowserAgent);

    console.log('プレイライトツールを直接実行します...');

    const { playwrightTools } = await import('./mastra/tools/playwright-mcp');
    const result = await playwrightTools.accessWebsiteAndScreenshot.execute({
      url: 'https://logicky.com',
      outputPath: './screenshot.png'
    });

    console.log('結果:', result);

    if (result.screenshotPath) {
      console.log(`スクリーンショットが保存されました: ${result.screenshotPath}`);
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーの詳細:', error.stack);
    }
  }
}

main().catch(console.error);