// pages/api/generate-script.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { javaInstallScript } from '../../lib/scripts/java-install';
import { Application, Optimization, Tweak } from '../../lib/supabase';

type Data = {
  script: string;
};

interface ScriptRequestBody {
  selectedApps: Application[];
  selectedOptimizations: Optimization[];
  selectedTweaks: Tweak[];
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { selectedApps, selectedOptimizations, selectedTweaks } = req.body as ScriptRequestBody;

    // Basic PowerShell script generation logic
    let powerShellScript = '# PowerShell script to install applications and apply optimizations and tweaks\n\n';

    // Add a function to handle waiting for processes
    powerShellScript += `# Function to execute and wait for a process to complete
function Invoke-ScriptWithProgress {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Command,
        
        [Parameter(Mandatory = $true)]
        [string]$Description
    )
    
    Write-Host "Starting: $Description" -ForegroundColor Cyan
    
    try {
        # Execute the command
        Invoke-Expression -Command $Command
        
        Write-Host "Completed: $Description" -ForegroundColor Green
    } catch {
        Write-Host "Error executing: $Description" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Request Admin Privileges if not already running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (!$isAdmin) {
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File \\"$PSCommandPath\\"" -Verb RunAs
    exit
}

# Progress tracking variables
$totalSteps = ${selectedApps.length + selectedOptimizations.length + (selectedTweaks ? selectedTweaks.length : 0)}
$currentStep = 0

`;

    // Install Applications
    if (selectedApps.length > 0) {
      powerShellScript += '# Installing Applications\n';

      selectedApps.forEach((app) => {
        powerShellScript += `$currentStep++\n`;
        powerShellScript += `Write-Progress -Activity "Installing Applications and Applying Optimizations" -Status "Installing ${app.name}" -PercentComplete ($currentStep / $totalSteps * 100)\n\n`;

        // Special handling for Java installation
        if (app.name === 'Java') {
          // Debug logging to help diagnose the issue
          console.log('Processing Java app:', JSON.stringify(app, null, 2));

          const javaVersion = app.version || '';

          powerShellScript += `# Installing ${app.name} version ${javaVersion}\n`;

          // Get Java install script with selected version
          const javaScript = javaInstallScript(javaVersion);
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
    }

    // Apply Optimizations
    if (selectedOptimizations && selectedOptimizations.length > 0) {
      powerShellScript += '# Applying Windows Optimizations\n\n';
      selectedOptimizations.forEach((optimization) => {
        powerShellScript += `$currentStep++\n`;
        powerShellScript += `Write-Progress -Activity "Installing Applications and Applying Optimizations" -Status "Applying optimization: ${optimization.name}" -PercentComplete ($currentStep / $totalSteps * 100)\n\n`;
        powerShellScript += `# Applying optimization: ${optimization.name}\n`;
        powerShellScript += optimization.script + '\n\n';
      });
    }

    // Apply Tweaks
    if (selectedTweaks && selectedTweaks.length > 0) {
      powerShellScript += '# Applying Windows Tweaks\n\n';
      selectedTweaks.forEach((tweak) => {
        powerShellScript += `$currentStep++\n`;
        powerShellScript += `Write-Progress -Activity "Installing Applications and Applying Optimizations" -Status "Applying tweak: ${tweak.name}" -PercentComplete ($currentStep / $totalSteps * 100)\n\n`;
        powerShellScript += `# Applying tweak: ${tweak.name}\n`;
        powerShellScript += `# Description: ${tweak.description}\n`;
        // Correction pour éviter les problèmes avec les backticks
        const safeCommand = tweak.command.replace(/`/g, '``'); // Double les backticks dans PowerShell
        powerShellScript += `Invoke-ScriptWithProgress -Command "${safeCommand}" -Description "${tweak.name}"\n\n`;
      });
    }

    // Finish script
    powerShellScript += `Write-Progress -Activity "Installing Applications and Applying Optimizations" -Status "Completed" -PercentComplete 100\n`;
    powerShellScript += `Write-Host "Script completed successfully!" -ForegroundColor Green\n`;
    powerShellScript += `Write-Host "Press any key to exit..." -ForegroundColor Yellow\n`;
    powerShellScript += `$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")\n`;

    console.log('Generated script:', powerShellScript);

    res.status(200).json({ script: powerShellScript });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
