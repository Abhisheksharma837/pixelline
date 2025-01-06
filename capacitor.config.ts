import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'pixeline',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Storage: {
      group: 'CapacitorStorage', // Optional, if needed for configuration
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#272727", // Use the background color that matches your logo
      androidSplashResourceName: "splash",
      showSpinner: false
    }
  }
};

export default config;
