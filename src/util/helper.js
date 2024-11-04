const environmentConfig = {
  screenAllowed: 1,
  redtrictedApps: [
    'chrome',
    'msedge',
    'firefox',
    'ms-teams',
    'zoom',
    'google-meet',
    'slack',
    'brave',
    'AnyDesk',
  ],
};

export const blockedShortcuts = ['Alt+Space', 'Ctrl+Shift+Esc'];

export function buildGetRunningProcessWinCommand(
  config = environmentConfig.redtrictedApps
) {
  const processes = config.map((name) => `'${name}'`).join(', ');
  return `powershell -command "$runningProcesses = Get-Process -Name ${processes} -ErrorAction SilentlyContinue; $runningProcesses | Select-Object -Property Name  | ConvertTo-Csv -NoTypeInformation"`;
  // return `ps -A -o pid,comm | grep chrome `;
}

export function buildKillRunningProcessWinCommand(
  config = environmentConfig.redtrictedApps
) {
  const processes = config.map((name) => `'${name}'`).join(', ');
  return `powershell -command "Stop-Process -Name ${processes} -Force "`;
}

export function parseGetallProceessResult(data) {
  const newData = new Set(data.split('\r'));

  const valuesToRemove = ['"Name"', '\n', ''];

  valuesToRemove.forEach((value) => {
    newData.delete(value);
  });

  return newData;
}

export function parseMonitorInfo(data) {
  let filteredArr = data.split('\r');

  // Remove all unwanted elements
  filteredArr = filteredArr.filter(
    (item) => item.trim() !== '' && !item.includes('------')
  );

  // Remove leading and trailing newlines from each string
  filteredArr = filteredArr.map((item) => item.trim());
  filteredArr.shift();

  return filteredArr;
}

export function parseSystemNotificationResult(data) {
  const arr = data.split('\r');
  const toastEnabledValue = arr.find((item) => item.includes('ToastEnabled'));

  if (toastEnabledValue) {
    const parts = toastEnabledValue.trim().split(/\s+/);
    return parts[parts.length - 1];
  }

  return null;
}

export function removeCharsByVowelCount(text, string) {
  const vowels = 'aeiouAEIOU';
  let vowelCount = 0;

  for (let i = 0; i < string.length; i += 1) {
    if (vowels.indexOf(string[i]) !== -1) {
      vowelCount += 1;
    }
  }

  if (text.length > vowelCount) {
    return text.slice(0, -vowelCount);
  }
  return text;
}

export const TotalDisplaysInfoCommand = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
export const NotificationInfoCommand = `reg query "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v ToastEnabled`;
export const FingerGesturesCommand = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PrecisionTouchPad" /v ThreeFingerSlideEnabled /t REG_DWORD /d 0 /f && reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PrecisionTouchPad" /v FourFingerSlideEnabled /t REG_DWORD /d 0 /f && taskkill /f /im explorer.exe && start explorer.exe`;
export const getOSinfo = () => {
  const { userAgent } = navigator;
  let deviceType = 'Unknown';
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Desktop';
  }

  let osType = 'Unknown';
  if (userAgent.indexOf('Win') !== -1) osType = 'Windows';
  if (userAgent.indexOf('Mac') !== -1) osType = 'MacOS';
  if (userAgent.indexOf('Linux') !== -1) osType = 'Linux';
  if (userAgent.indexOf('Android') !== -1) osType = 'Android';
  if (userAgent.indexOf('like Mac') !== -1) osType = 'iOS';

  return { osType, deviceType };
};
