const environmentConfig = {
  screenAllowed: 1,
  redtrictedApps: [
    "chrome",
    "msedge",
    "firefox",
    "teams",
    "zoom",
    "google-meet",
    "slack",
    "brave",
  ],
};

export const blockedShortcuts = [
  // Windows Key Combinations
  "Super", // Block single press of the Windows key
  "Super+Any", // Block any combination with the Windows key
  // Add more shortcuts as needed
];

export function buildGetRunningProcessWinCommand(
  config = environmentConfig.redtrictedApps
) {
  const processes = config.map(name => `'${name}'`).join(", ");
  return `powershell -command "$runningProcesses = Get-Process -Name ${processes} -ErrorAction SilentlyContinue; $runningProcesses | Select-Object -Property Name  | ConvertTo-Csv -NoTypeInformation"`;
  // return `ps -A -o pid,comm | grep chrome `;
}

export function buildKillRunningProcessWinCommand(
  config = environmentConfig.redtrictedApps
) {
  const processes = config.map(name => `'${name}'`).join(", ");
  return `powershell -command "Stop-Process -Name ${processes} -Force "`;
}
