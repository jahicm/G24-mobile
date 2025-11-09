import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ch.g24.app',
  appName: 'g24',
  webDir: 'dist/g24/browser',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      '10.0.2.2',
      'localhost',
      'g24-backend.ashyhill-9796b5b9.westeurope.azurecontainerapps.io'
    ]
  }
};

export default config;
