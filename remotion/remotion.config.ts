import { Config } from '@remotion/cli/config';
Config.setVideoImageFormat('png');
// Optional: point at a local Chrome / headless shell instead of the one Remotion downloads.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
