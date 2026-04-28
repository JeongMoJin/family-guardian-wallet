import { Router } from 'express';
import { config } from '../../config';

// 프론트엔드가 어떤 시니어 계정을 보여줄지를 서버 환경변수에서 가져온다.
// 시드는 절대 노출하지 않고 주소·네트워크·가디언 라벨만 내려준다.
export const configRouter = Router();

configRouter.get('/', (_req, res) => {
  res.json({
    seniorAddress: config.senior.address || null,
    network: config.network,
    guardians: config.guardians
      .map((g, i) => ({ label: `가족 가디언 ${i + 1}`, address: g.address }))
      .filter((g) => g.address),
    demoDestination: config.demo.destination,
  });
});
