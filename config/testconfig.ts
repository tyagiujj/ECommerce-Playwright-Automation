function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Add it to your .env file (see .env.example).`);
  }
  return value;
}

export class TestConfig {
  appUrl = requireEnv('BASE_URL');
  apploginUrl = new URL('login', this.appUrl).toString();
  testcaseUrl = new URL('test_cases', this.appUrl).toString();
  emailaddress = requireEnv('USER_EMAIL');
  password = requireEnv('USER_PASSWORD');
}
