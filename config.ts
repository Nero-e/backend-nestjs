import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      nameDB: process.env.DATABASE_NAMEDB,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
});
