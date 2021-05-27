import {
  CategorySuggestionResponseType,
  ContentType,
  CountryCodeType,
  GenericSuggestionResponseType,
  GlobalSuggestionResponseType,
  SuggestionType,
} from './types';

const BASE_URL = `https://www.pricerunner.se`;

const fetchCategorySuggestions = async (
  query: string,
  countryCode: CountryCodeType
): Promise<SuggestionType[] | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/public/search/suggest/categories/${countryCode}?q=${decodeURIComponent(query)}`
    );
    const data = await response.json();

    const categories = (data.categories || []) as CategorySuggestionResponseType[];
    const suggestions = categories.map((suggestion) => ({
      id: suggestion.id,
      name: suggestion.name,
    }));

    return suggestions;
  } catch (e) {
    return null;
  }
};

const fetchSubCategorySuggestions = async (
  query: string,
  countryCode: CountryCodeType
): Promise<SuggestionType[] | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/public/search/suggest/${countryCode}?q=${decodeURIComponent(query)}`
    );
    const data = await response.json();

    const suggestions = (data.suggestions || []) as GlobalSuggestionResponseType[];

    const subCategories = suggestions
      .filter((suggestion) => suggestion.type === 'CATEGORY' && suggestion.categories)
      .reduce((acc: SuggestionType[], cur) => {
        const subcategories: SuggestionType[] = [];

        if (cur.categories) {
          cur.categories.map((subcategory) => {
            subcategories.push({
              name: `${cur.name} - ${subcategory.name}`,
              id: subcategory.url,
            });
          });
        }

        return subcategories.length > 0 ? acc.concat(subcategories) : acc;
      }, []);

    return subCategories;
  } catch (e) {
    return null;
  }
};

const fetchMerchantSuggestions = async (
  query: string,
  countryCode: CountryCodeType
): Promise<SuggestionType[] | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/public/search/suggest/merchants/${countryCode}?q=${decodeURIComponent(query)}`
    );
    const data = await response.json();

    const merchants = (data.suggestions || []) as GenericSuggestionResponseType[];
    const suggestions = merchants.map((suggestion) => ({
      id: suggestion.id,
      name: suggestion.name,
    }));

    return suggestions;
  } catch (e) {
    return null;
  }
};

const fetchBrandSuggestions = async (
  query: string,
  countryCode: CountryCodeType
): Promise<SuggestionType[] | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/public/search/suggest/brands/${countryCode}?q=${decodeURIComponent(query)}`
    );
    const data = await response.json();

    const brands = (data.suggestions || []) as GenericSuggestionResponseType[];
    const suggestions = brands.map((suggestion) => ({
      id: suggestion.id,
      name: suggestion.name,
    }));

    return suggestions;
  } catch (e) {
    return null;
  }
};

type FetchSuggestionsType = {
  contentType: ContentType;
  query: string;
  countryCode: CountryCodeType;
};

export const fetchSuggestions = async ({
  contentType,
  query,
  countryCode,
}: FetchSuggestionsType): Promise<SuggestionType[] | null> => {
  switch (contentType) {
    case ContentType.CATEGORY:
      return await fetchCategorySuggestions(query, countryCode);
    case ContentType.SUBCATEGORY:
      return await fetchSubCategorySuggestions(query, countryCode);
    case ContentType.MERCHANT:
      return await fetchMerchantSuggestions(query, countryCode);
    case ContentType.BRAND:
      return await fetchBrandSuggestions(query, countryCode);
  }
};
