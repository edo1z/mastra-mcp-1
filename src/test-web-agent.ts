import 'dotenv/config';
import { mastra } from './mastra/index';

async function main() {
  try {
    console.log('ウェブブラウザエージェントをテスト中...');
    const result = await mastra.getAgent('webBrowser').generate('https://logicky.comにアクセスしてタイトルを取得して教えてください');
    console.log('結果:', result.text);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーの詳細:', error.stack);
    }
  }
}

main().catch(console.error);