import React, { FunctionComponent } from 'react';
import { render } from 'react-dom';
import { FieldExtensionSDK, init, locations, KnownSDK } from '@contentful/app-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import '@contentful/forma-36-tokens/dist/css/index.css';
import './index.css';
import ContentTypeField from './components/ContentTypeField/ContentTypeField';

const ENTRY_FIELD_TYPES = {
  CONTENT_TYPE: 'contentType',
};

type AppType = {
  sdk: KnownSDK;
};

type ParametersType = {
  component: string;
};

const App: FunctionComponent<AppType> = ({ sdk }) => {
  const { location, parameters } = sdk;
  const { component } = parameters.instance as ParametersType;

  if (location.is(locations.LOCATION_ENTRY_FIELD)) {
    switch (component) {
      case ENTRY_FIELD_TYPES.CONTENT_TYPE:
        return <ContentTypeField sdk={sdk as FieldExtensionSDK} />;
    }
  }

  return null;
};

init((sdk) => {
  render(<App sdk={sdk} />, document.getElementById('root'));
});
