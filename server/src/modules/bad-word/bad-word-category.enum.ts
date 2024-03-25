export enum BadWordCategoryEnum {
  politics = 'Politics',
  violence = 'Violence',
  enmity = 'Enmity',
  religion = 'Religion',
  racist = 'Racist',
  sexual_harassment = 'Sexual Harassment',
}

export const badWordCategories = () =>
  Object.keys(BadWordCategoryEnum).map((key) => ({
    id: key,
    label: BadWordCategoryEnum[key],
  }));
