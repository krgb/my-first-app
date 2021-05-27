import React, { FunctionComponent } from 'react';
import {
  Autocomplete,
  Card,
  Option,
  Paragraph,
  Pill,
  SelectField,
} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { ContentType, CountryCodeType, SuggestionType, ValueType } from './types';
import { fetchSuggestions } from './api';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const ContentTypeField: FunctionComponent<FieldProps> = ({ sdk }) => {
  const selectedWrapperRef = React.useRef<HTMLDivElement>(null);
  const [selectedCountryCode, setSelectedCountryCode] = React.useState<CountryCodeType>(
    CountryCodeType.SE
  );
  const [value, setValue] = React.useState<ValueType>(() => sdk.field.getValue());
  const [contentType, setContentType] = React.useState<ContentType>(value?.type);
  const [selectedItem, setSelectedItem] = React.useState<SuggestionType | null>(
    value?.id
      ? {
          id: value.id,
          name: value.name,
        }
      : null
  );
  const [suggestedItems, setSuggestedItems] = React.useState<SuggestionType[]>([]);

  console.log('render', value, selectedItem, selectedItem?.id);

  const setWindowHeight = (addedHeight = 0) => {
    const { height = 50 } = selectedWrapperRef?.current?.getBoundingClientRect() || {};

    sdk.window.updateHeight(200 + height + addedHeight);
  };

  const resetSuggestedItems = () => {
    setSuggestedItems([]);
    setWindowHeight();
  };

  const resetSelectedItem = () => {
    setSelectedItem(null);
    setWindowHeight();
  };

  const handleSearchValue = async (query: string) => {
    if (query.length === 0) {
      resetSuggestedItems();

      return false;
    }

    if (!contentType) {
      return false;
    }

    setWindowHeight(200);

    const suggestions = await fetchSuggestions({
      contentType,
      query,
      countryCode: selectedCountryCode,
    });

    if (suggestions) {
      setSuggestedItems(suggestions);
    }
  };

  const handleSelectItem = (selectedSuggestion: SuggestionType) => {
    setSelectedItem(selectedSuggestion);
    resetSuggestedItems();
  };

  const handleRemoveSelectedItem = () => {
    setSelectedItem(null);
  };

  const handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value as ContentType;

    resetSelectedItem();
    resetSuggestedItems();
    setContentType(type);
  };

  const handleChangeSelectedCountryCode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value as CountryCodeType;

    setSelectedCountryCode(countryCode);
  };

  React.useEffect(() => {
    setWindowHeight();
  }, []);

  React.useEffect(() => {
    if (contentType && selectedItem) {
      const valueObj = {
        type: contentType,
        id: selectedItem.id,
        name: selectedItem.name,
      };

      console.log('update with:', valueObj);

      sdk.field.setValue(valueObj);
      setValue(valueObj);
    }
  }, [contentType, selectedItem]);

  return (
    <>
      <Paragraph>
        Select a type this content piece belongs to, then link it to one ID by searching below.
        Changing country lets you search for country specific IDs.
      </Paragraph>
      <div style={{ padding: 4 }}>
        <div style={{ marginBottom: 8 }}>
          <SelectField
            name="fieldType"
            id="fieldType"
            labelText=""
            value={contentType}
            selectProps={{ width: 'full' }}
            onChange={handleChangeType}>
            <Option value="">Choose a value</Option>
            {Object.values(ContentType).map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </SelectField>
        </div>
        <div ref={selectedWrapperRef}>
          <Card>
            {selectedItem?.id ? (
              <Pill
                key={selectedItem.id}
                style={{ marginRight: '8px', marginBottom: '4px' }}
                label={`${selectedItem.name} (${selectedItem.id})`}
                onClose={handleRemoveSelectedItem}
              />
            ) : (
              <Pill style={{ marginBottom: '4px' }} label="None" variant="deleted" />
            )}
          </Card>
        </div>
        {contentType && (
          <div style={{ marginTop: 8, display: 'flex', width: '100%' }}>
            <Autocomplete
              items={suggestedItems}
              width="large"
              willClearQueryOnClose
              maxHeight={200}
              placeholder="Type to search"
              emptyListMessage="Search by name"
              noMatchesMessage="No result found"
              onQueryChange={(query) => {
                handleSearchValue(query);
              }}
              onChange={handleSelectItem}>
              {(options) => options.map((option) => <span key={option.id}>{option.name}</span>)}
            </Autocomplete>
            <div style={{ marginLeft: 20, marginTop: -8 }}>
              <SelectField
                name="selectedCountryCode"
                id="selectedCountryCode"
                labelText=""
                value={selectedCountryCode}
                onChange={handleChangeSelectedCountryCode}>
                {Object.values(CountryCodeType).map((countryCode) => (
                  <Option key={countryCode} value={countryCode}>
                    {countryCode}
                  </Option>
                ))}
              </SelectField>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentTypeField;
