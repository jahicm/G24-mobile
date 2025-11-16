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
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,        // Show splash for 3 seconds
      launchAutoHide: true,            // Auto-hide automatically
      backgroundColor: "#ffffff",      // White background
      androidScaleType: "CENTER_CROP", // Best for full-screen images
      showSpinner: false,              // Set true if you want a spinner
      spinnerColor: "#000000",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large"
    }
  }
};

export default config;
