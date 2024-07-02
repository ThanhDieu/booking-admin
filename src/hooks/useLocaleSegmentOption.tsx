/* eslint-disable @typescript-eslint/no-explicit-any */
import { languages } from 'constant';
import { useAppSelector } from 'store';

const useLocaleSegmentOption = () => {
  const { languages: languagesSetting } = useAppSelector((state) => state.booking.languageSetting);

  const segmentOptions = languagesSetting
    ? languagesSetting.map((locale) => ({
      label: (languages as any)[locale.code],
      value: locale.code
    }))
    : [];
  const mandatoryLocaleList = languagesSetting
    ?.filter((lang) => lang.mandatory)
    .map((lang) => {
      return lang.code;
    });

  return {
    segmentOptions,
    mandatoryLocaleList
  };
};

export default useLocaleSegmentOption;
