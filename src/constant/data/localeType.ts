interface LocaleOption {
  title: string;
}

const localesOptions: Record<string, LocaleOption> = {
  en: { title: 'English' },
  de: {
    title: 'Deutsch'
  }
};

export default localesOptions;
