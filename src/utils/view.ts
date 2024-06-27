import { paths } from 'constant';

export const displayRole = (currentView: string, word = '@') => {
  const newTitle = currentView?.split(word);
  if (newTitle && newTitle?.length && !paths[newTitle[0] as keyof typeof paths]) {
    return {
      name: newTitle[1] || newTitle[0],
      code: newTitle[0]
    };
  }
  return {
    name: currentView
  };
};
