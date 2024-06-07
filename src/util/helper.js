const environmentConfig = {
  screenAllowed: 1,
  redtrictedApps: [
    "chrome",
    "msedge",
    "firefox",
    // "ms-teams",
    "zoom",
    "google-meet",
    "slack",
    // "brave",
  ],
};

export const blockedShortcuts = ["Alt+Space", "Ctrl+Shift+Esc"];

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

export function parseGetallProceessResult(data) {
  const newData = new Set(data.split("\r"));
  console.log(newData, "before");
  if (newData.has('"Name"')) {
    newData.delete('"Name"');
    newData.delete("\n");
  }
  console.log(newData, "after");
  return newData;
}

export function parseMonitorInfo(data) {
  let filteredArr = data.split("\r");
  console.log(filteredArr, "manish");
  // Remove all unwanted elements
  filteredArr = filteredArr.filter(
    item => item.trim() !== "" && !item.includes("------")
  );

  // Remove leading and trailing newlines from each string
  filteredArr = filteredArr.map(item => item.trim());
  filteredArr.shift();

  return filteredArr;
}

export function parseSystemNotificationResult(data) {
  let arr = data.split("\r");
  let toastEnabledValue = null;

  // Iterate through the array to find the ToastEnabled value
  for (let item of arr) {
    if (item.includes("ToastEnabled")) {
      // Split the item by spaces and get the last part which is the value
      const parts = item.trim().split(/\s+/);
      toastEnabledValue = parts[parts.length - 1];
      return toastEnabledValue;
    }
  }
  return null;
}
