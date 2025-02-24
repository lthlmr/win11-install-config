// lib/scripts/java-install.ts

// Define the types for Java version data
export interface JavaVersionInfo {
    version: string;
    zip_url: string;
    sha_url: string;
}

// List of all available Java versions from the PowerShell script
export const javaVersions: JavaVersionInfo[] = [
    {
        version: "22.0.2",
        zip_url: "https://download.java.net/java/GA/jdk22.0.2/c9ecb94cd31b495da20a27d4581645e8/9/GPL/openjdk-22.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk22.0.2/c9ecb94cd31b495da20a27d4581645e8/9/GPL/openjdk-22.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "21.0.2",
        zip_url: "https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "20.0.2",
        zip_url: "https://download.java.net/java/GA/jdk20.0.2/6e380f22cbe7469fa75fb448bd903d8e/9/GPL/openjdk-20.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk20.0.2/6e380f22cbe7469fa75fb448bd903d8e/9/GPL/openjdk-20.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "19.0.2",
        zip_url: "https://download.java.net/java/GA/jdk19.0.2/fdb695a9d9064ad6b064dc6df578380c/7/GPL/openjdk-19.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk19.0.2/fdb695a9d9064ad6b064dc6df578380c/7/GPL/openjdk-19.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "18.0.2",
        zip_url: "https://download.java.net/java/GA/jdk18.0.2/f6ad4b4450fd4d298113270ec84f30ee/9/GPL/openjdk-18.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk18.0.2/f6ad4b4450fd4d298113270ec84f30ee/9/GPL/openjdk-18.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "17.0.2",
        zip_url: "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "16.0.2",
        zip_url: "https://download.java.net/java/GA/jdk16.0.2/d4a915d82b4c4fbb9bde534da945d746/7/GPL/openjdk-16.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk16.0.2/d4a915d82b4c4fbb9bde534da945d746/7/GPL/openjdk-16.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "15.0.2",
        zip_url: "https://download.java.net/java/GA/jdk15.0.2/0d1cfde4252546c6931946de8db48ee2/7/GPL/openjdk-15.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk15.0.2/0d1cfde4252546c6931946de8db48ee2/7/GPL/openjdk-15.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "14.0.2",
        zip_url: "https://download.java.net/java/GA/jdk14.0.2/205943a0976c4ed48cb16f1043c5c647/12/GPL/openjdk-14.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk14.0.2/205943a0976c4ed48cb16f1043c5c647/12/GPL/openjdk-14.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "13.0.2",
        zip_url: "https://download.java.net/java/GA/jdk13.0.2/d4173c853231432d94f001e99d882ca7/8/GPL/openjdk-13.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk13.0.2/d4173c853231432d94f001e99d882ca7/8/GPL/openjdk-13.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "12.0.2",
        zip_url: "https://download.java.net/java/GA/jdk12.0.2/e482c34c86bd4bf8b56c0b35558996b9/10/GPL/openjdk-12.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk12.0.2/e482c34c86bd4bf8b56c0b35558996b9/10/GPL/openjdk-12.0.2_windows-x64_bin.zip.sha256"
    },
    {
        version: "11.0.2",
        zip_url: "https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip",
        sha_url: "https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip.sha256"
    }
];

/**
 * Generates a PowerShell script for installing a specific Java version
 * @param version Java version to install
 * @returns PowerShell script as a string
 */
export function javaInstallScript(version: string): string {
    // Find the matching Java version
    const javaVersion = javaVersions.find(jv => jv.version === version);

    if (!javaVersion) {
        return `# Error: Java version ${version} not found`;
    }

    // Generate the installation script
    return `# PowerShell script to install Java ${javaVersion.version}
# Prevent script from running on 32-bit systems as Java does not support them.
if (![Environment]::Is64BitProcess) {
  Write-Error -Message 'The latest version of Java requires a 64-bit version of Windows.'
  $host.EnterNestedPrompt()
  return
}

# Request Admin Privileges if not already running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (!$isAdmin) {
    # Create a temporary script file with the current Java installation instructions
    $tempScriptPath = "$env:TEMP\\JavaInstall_${version}.ps1"
    @"
# Java Installation Script generated by Windows Script Generator
# Installing Java ${javaVersion.version}

$zipUrl = "${javaVersion.zip_url}"
$shaUrl = "${javaVersion.sha_url}"

# Create Java folder
$javaFolder = "$env:ProgramFiles\\Java"
New-Item -ItemType directory -Path $javaFolder -Force
Set-Location $javaFolder

# Download JDK ZIP & SHA256 Files
$jdkZipFile = 'jdk.zip'
$jdkShaFile = 'sha.sha256'

Invoke-WebRequest -Uri $zipUrl -OutFile $jdkZipFile
Invoke-WebRequest -Uri $shaUrl -OutFile $jdkShaFile

# Compare JDK Zip Checksum to SHA256 File
$computedHash = (Get-FileHash -Algorithm SHA256 -Path $jdkZipFile).Hash
$existingHash = Get-Content -Path $jdkShaFile

if ($computedHash -ne $existingHash) {
  Remove-Item -Path $jdkZipFile
  Remove-Item -Path $jdkShaFile

  Write-Error -Message 'The checksum of the downloaded JDK is incorrect. The file may be corrupt.'
  Write-Error -Message 'This might be resolved by re-running this script.'
  $host.EnterNestedPrompt()
  return
}

# Extract Archive
Expand-Archive -Path $jdkZipFile
Remove-Item -Path $jdkZipFile
Remove-Item -Path $jdkShaFile

# Detect JDK Folder
$jdkFolder = "$javaFolder\\jdk\\jdk-${version}"
if ($jdkFolder.EndsWith(".0.0")) {
    $jdkFolder = $jdkFolder.Substring(0, $jdkFolder.Length - 4)
}

$binFolder = "$jdkFolder\\bin"

# Set Environment Variables
$path = [Environment]::GetEnvironmentVariable('Path', 'Machine')
[Environment]::SetEnvironmentVariable('Path', $path + ';' + $binFolder, 'Machine')

[Environment]::SetEnvironmentVariable('JAVA_HOME', $jdkFolder, 'Machine')
[Environment]::SetEnvironmentVariable('JDK_HOME', '%JAVA_HOME%', 'Machine')
[Environment]::SetEnvironmentVariable('JRE_HOME', '%JAVA_HOME%', 'Machine')

Write-Host -Object 'Success! Java has been installed.'
"@ | Out-File -FilePath $tempScriptPath -Encoding utf8

    # Run the temporary script with admin privileges
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-File \`"$tempScriptPath\`""
    
    # Clean up will happen when the admin script finishes
    Write-Host "Java installation initiated with admin privileges. Please follow the prompts in the new window."
    return
}

# Directly download and install Java ${javaVersion.version}
$zipUrl = "${javaVersion.zip_url}"
$shaUrl = "${javaVersion.sha_url}"

# Create Java folder
$javaFolder = "$env:ProgramFiles\\Java"
New-Item -ItemType directory -Path $javaFolder -Force
Set-Location $javaFolder

# Download JDK ZIP & SHA256 Files
$jdkZipFile = 'jdk.zip'
$jdkShaFile = 'sha.sha256'

Invoke-WebRequest -Uri $zipUrl -OutFile $jdkZipFile
Invoke-WebRequest -Uri $shaUrl -OutFile $jdkShaFile

# Compare JDK Zip Checksum to SHA256 File
$computedHash = (Get-FileHash -Algorithm SHA256 -Path $jdkZipFile).Hash
$existingHash = Get-Content -Path $jdkShaFile

if ($computedHash -ne $existingHash) {
  Remove-Item -Path $jdkZipFile
  Remove-Item -Path $jdkShaFile

  Write-Error -Message 'The checksum of the downloaded JDK is incorrect. The file may be corrupt.'
  Write-Error -Message 'This might be resolved by re-running this script.'
  $host.EnterNestedPrompt()
  return
}

# Extract Archive
Expand-Archive -Path $jdkZipFile
Remove-Item -Path $jdkZipFile
Remove-Item -Path $jdkShaFile

# Detect JDK Folder
$jdkFolder = "$javaFolder\\jdk\\jdk-${version}"
if ($jdkFolder.EndsWith(".0.0")) {
    $jdkFolder = $jdkFolder.Substring(0, $jdkFolder.Length - 4)
}

$binFolder = "$jdkFolder\\bin"

# Set Environment Variables
$path = [Environment]::GetEnvironmentVariable('Path', 'Machine')
[Environment]::SetEnvironmentVariable('Path', $path + ';' + $binFolder, 'Machine')

[Environment]::SetEnvironmentVariable('JAVA_HOME', $jdkFolder, 'Machine')
[Environment]::SetEnvironmentVariable('JDK_HOME', '%JAVA_HOME%', 'Machine')
[Environment]::SetEnvironmentVariable('JRE_HOME', '%JAVA_HOME%', 'Machine')

Write-Host -Object 'Success! Java has been installed.'`;
}