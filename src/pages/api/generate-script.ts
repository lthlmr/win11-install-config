// pages/api/generate-script.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { javaInstallScript } from '../../lib/scripts/java-install';

type Data = {
  script: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { selectedApps, selectedOptimizations } = req.body;

    // Basic PowerShell script generation logic
    let powerShellScript = '# PowerShell script to install applications and apply optimizations\n\n';

    // Install Applications
    selectedApps.forEach((app: any) => {
      // Special handling for Java installation
      if (app.name === 'Java') {
        powerShellScript += `# Installing ${app.name} version ${app.version}\n`;
        // Get Java install script with selected version
        const javaScript = javaInstallScript(app.version);
        powerShellScript += javaScript + '\n\n';
      } else {
        // Standard application installation
        powerShellScript += `# Installing ${app.name}\n`;
        powerShellScript += `$installerPath = "$env:TEMP\\${app.name}_installer.exe"\n`;
        powerShellScript += `Invoke-WebRequest -Uri "${app.download_url}" -OutFile $installerPath\n`;
        powerShellScript += `Start-Process $installerPath -ArgumentList "${app.install_args}" -Wait\n`;
        powerShellScript += `Remove-Item $installerPath\n\n`;
      }
    });

    // Apply Optimizations
    if (selectedOptimizations && selectedOptimizations.length > 0) {
      powerShellScript += '# Applying Windows Optimizations\n\n';
      selectedOptimizations.forEach((optimization: any) => {
        powerShellScript += `# Applying optimization: ${optimization.name}\n`;
        powerShellScript += optimization.script + '\n\n';
      });
    }

    console.log('Generated script:', powerShellScript);

    res.status(200).json({ script: powerShellScript });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}