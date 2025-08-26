// 定义设置类型接口
interface AppSettings {
    musicAutoPlay: boolean;    // 控制音乐自动播放
    imageSliderVisible: boolean; // 控制图片滑块显示
    imageSliderAutoPlay: boolean; // 控制图片滑块自动切换
    updateInfoPopup: boolean; // 控制更新信息提醒
}

// 默认设置
const DEFAULT_SETTINGS: AppSettings = {
    musicAutoPlay: true,
    imageSliderVisible: true,
    imageSliderAutoPlay: true,
    updateInfoPopup: true
};

// LocalStorage存储键名
const STORAGE_KEY = 'app_settings';

// 初始化设置
function initSettings() {
    const stored = localStorage.getItem(STORAGE_KEY);

    // 如果没有初始化过，设置默认值
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } else {
        // 处理可能的结构变化，确保所有字段都存在
        try {
            const parsed = JSON.parse(stored) as Partial<AppSettings>;
            const merged: AppSettings = { ...DEFAULT_SETTINGS, ...parsed };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {
            console.error('设置解析错误，重置为默认值', e);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
        }
    }
}

// 更新设置
function updateSettings(newSettings: Partial<AppSettings>) {
    initSettings(); // 确保设置已初始化
    // 明确指定current的类型为AppSettings
    const current: AppSettings = getSettings() as AppSettings;
    const updated: AppSettings = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

// 获取设置 - 支持带参数和不带参数两种方式
export function getSettings(key?: keyof AppSettings): AppSettings | boolean {
    initSettings(); // 确保先初始化
    const stored = localStorage.getItem(STORAGE_KEY);
    const settings: AppSettings = stored ? JSON.parse(stored) : DEFAULT_SETTINGS;

    // 如果指定了键，则返回对应的值，否则返回完整设置对象
    if (key) {
        return settings[key];
    }
    return settings;
}

// 暴露更新设置方法
export function setSettings(newSettings: Partial<AppSettings>) {
    return updateSettings(newSettings);
}
