const environmentConfig = {
  screenAllowed: 1,
  redtrictedApps: [
    "chrome",
    "msedge",
    "firefox",
    "ms-teams",
    "zoom",
    "google-meet",
    "slack",
    "brave",
    "AnyDesk",
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

  const valuesToRemove = ['"Name"', "\n", ""];

  for (const value of valuesToRemove) {
    newData.delete(value);
  }

  return newData;
}

export function parseMonitorInfo(data) {
  let filteredArr = data.split("\r");

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

export function removeCharsByVowelCount(text, string) {
  const vowels = "aeiouAEIOU";
  let vowelCount = 0;

  for (let i = 0; i < string.length; i++) {
    if (vowels.indexOf(string[i]) !== -1) {
      vowelCount++;
    }
  }

  if (text.length > vowelCount) {
    return text.slice(0, -vowelCount);
  } else {
    return text;
  }
}

export const TotalDisplaysInfoCommand = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
export const NotificationInfoCommand = `reg query "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v ToastEnabled`;
export const FingerGesturesCommand = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PrecisionTouchPad" /v ThreeFingerSlideEnabled /t REG_DWORD /d 0 /f && reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PrecisionTouchPad" /v FourFingerSlideEnabled /t REG_DWORD /d 0 /f && taskkill /f /im explorer.exe && start explorer.exe`;
export const getOSinfo = () => {
  const userAgent = navigator.userAgent;
  let deviceType = "Unknown";
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = "Mobile";
  } else {
    deviceType = "Desktop";
  }

  let osType = "Unknown";
  if (userAgent.indexOf("Win") !== -1) osType = "Windows";
  if (userAgent.indexOf("Mac") !== -1) osType = "MacOS";
  if (userAgent.indexOf("Linux") !== -1) osType = "Linux";
  if (userAgent.indexOf("Android") !== -1) osType = "Android";
  if (userAgent.indexOf("like Mac") !== -1) osType = "iOS";

  return { osType, deviceType };
};
