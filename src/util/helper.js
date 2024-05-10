const environmentConfig = {
  screenAllowed: 1,
  redtrictedApps: [
    "chrome",
    "ms-edge",
    "firefox",
    "teams",
    "zoom",
    "google-meet",
    "slack",
    "brave",
  ],
  blockKeys: [],
};

export function buildGetRunningProcessWinCommand(
  config = environmentConfig.redtrictedApps
) {
  // const processes = config.map(name => `'${name}'`).join(", ");
  // return `powershell -command "$runningProcesses = Get-Process -Name ${processes} -ErrorAction SilentlyContinue; "`;
  return `ps -A -o pid,comm | grep chrome `;
}

function buildKillRunningProcessWinCommand(
  config = environmentConfig.redtrictedApps
) {
  const processes = config.map(name => `'${name}'`).join(", ");
  return `powershell -command "Stop-Process -Name ${processes} -Force }"`;
}
