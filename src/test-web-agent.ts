import 'dotenv/config';
import { mastra } from './mastra/index';
import { disconnect } from './mastra/agents/web-browser-agent';

const prompt = `
ランサーズのホームページ(https://www.lancers.jp/work/search/system/ai?open=1)にアクセスして最新のAI関連の募集中の開発案件を最大10件取得して、MastraかLangGraphを使って出来そうな案件を探してください。
出来そうなやつは詳細内容を教えてください。

取得する内容は以下の通りです
- 案件名
- 案件概要
- 案件金額
- 案件詳細URL
- 提案する場合の設計の超概要案
`;

async function main() {
  try {
    console.log('ウェブブラウザエージェントをテスト中...');
    const result = await mastra.getAgent('webBrowser').generate(prompt);
    console.log('結果:', result.text);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーの詳細:', error.stack);
    }
  } finally {
    await disconnect();
    console.log('MCPの接続を閉じました');
  }
}

main().catch(console.error);