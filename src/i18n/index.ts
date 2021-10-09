import ZH_CN from './zh_cn.json';

// type I18NType = keyof typeof ZH_CN;

const i18nMap = {
  'zh_cn': ZH_CN,
};

const curLanguage = i18nMap['zh_cn'];

function i18n(key: string): string {
  return (curLanguage as any)[key] ?? `(I18N ERROR: ${key})`;
}

export {
  i18n
}