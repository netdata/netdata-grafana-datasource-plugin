import React, { ChangeEvent } from 'react';
import { InlineField, SecretInput } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from './shared/types';

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
    <InlineField label="API Token" labelWidth={20} tooltip="Your Netdata Cloud API Token">
      <SecretInput
        isConfigured={secureJsonFields && secureJsonFields.apiToken}
        value={secureJsonData?.apiToken || ''}
        placeholder="Your Netdata Cloud API Token"
        width={40}
        onReset={onResetAPIToken}
        onChange={onAPITokenChange}
      />
    </InlineField>
  );
};
