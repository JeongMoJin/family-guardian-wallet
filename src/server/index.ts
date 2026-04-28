import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { existsSync } from 'fs';
import { accountRouter } from './routes/account';
import { configRouter } from './routes/config';
import { signingRouter } from './routes/signing';
import { faucetRouter } from './routes/faucet';

const PORT = Number(process.env.PORT ?? 4000);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'family-guardian-wallet', uptime: process.uptime() });
});

app.use('/api/config', configRouter);
app.use('/api/account', accountRouter);
app.use('/api/signing-requests', signingRouter);
app.use('/api/faucet', faucetRouter);

// 프로덕션 모드: web/dist 가 빌드되어 있으면 같은 서버에서 정적 호스팅 + SPA fallback
const webDist = path.resolve(process.cwd(), 'web', 'dist');
if (existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(webDist, 'index.html'));
  });
  console.log(`static frontend mounted from ${webDist}`);
}

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
