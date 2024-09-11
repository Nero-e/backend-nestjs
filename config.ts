import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      nameDB: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
});
