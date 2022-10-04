import React, { ChangeEvent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from './shared/types';

const { SecretFormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

export const ConfigEditor: React.FC<Props> = ({ onOptionsChange, options }) => {
  const { secureJsonFields, secureJsonData } = options;

  const onAPITokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiToken: event.target.value,
      },
    });
  };

  const onResetAPIToken = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiToken: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiToken: '',
      },
    });
  };

  return (
    <div className="gf-form-group">
      <div className="gf-form">
        <SecretFormField
          isConfigured={secureJsonFields && secureJsonFields.apiToken}
          value={secureJsonData?.apiToken || ''}
          label="API Token"
          placeholder="Your Netdata Cloud API Token"
          labelWidth={6}
          inputWidth={20}
          onReset={onResetAPIToken}
          onChange={onAPITokenChange}
        />
      </div>
    </div>
  );
};
