export enum CountryCodeType {
  SE = 'SE',
  DK = 'DK',
  UK = 'UK',
}

export enum ContentType {
  CATEGORY = 'CATEGORY',
  SUBCATEGORY = 'SUBCATEGORY',
  MERCHANT = 'MERCHANT',
  BRAND = 'BRAND',
}

export type CategorySuggestionResponseType = {
  id: string;
  name: string;
  type: string;
  url: string;
};

type SubcategorySuggestionType = {
  name: string;
  url: string;
  subCategoryName?: string;
  type: string;
};

export type GlobalSuggestionResponseType = {
  id?: string;
  name?: string;
  type?: string;
  categories?: SubcategorySuggestionType[];
};

export type GenericSuggestionResponseType = {
  id: string;
  name: string;
};

export type ValueType = {
  type: ContentType;
  id: string;
  name: string;
};

export type SuggestionType = {
  id: string;
  name: string;
};
