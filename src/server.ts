import 'dotenv/config';
import { createApp, createCandidateRepository } from './app';

const PORT = Number(process.env.PORT ?? 3000);

createApp(createCandidateRepository()).listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
