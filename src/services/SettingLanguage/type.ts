export interface LanguageSettingType {
  code: string;
  default: boolean;
  mandatory: boolean;
}

export interface LanguageSettingListType {
  languages: LanguageSettingType[];
}
