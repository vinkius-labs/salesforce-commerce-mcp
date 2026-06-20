import { defineCredentials } from '@mcpfusion/core';
export const credentials = defineCredentials({
    SF_INSTANCE_URL: {
        label: 'Salesforce Instance URL',
        description: 'Your Salesforce My Domain URL (e.g. https://yourcompany.my.salesforce.com)',
        placeholder: 'https://yourcompany.my.salesforce.com',
        type: 'string',
        required: true,
        sensitive: false,
        group: 'Salesforce'
    },
    SF_CONSUMER_KEY: {
        label: 'Consumer Key (Client ID)',
        description: 'The Consumer Key from your Salesforce Connected App or External Client App. Found in Setup > App Manager > Your App > View.',
        placeholder: '3MVG9...',
        type: 'string',
        required: true,
        sensitive: false,
        group: 'Salesforce'
    },
    SF_CONSUMER_SECRET: {
        label: 'Consumer Secret (Client Secret)',
        description: 'The Consumer Secret from your Salesforce Connected App. Keep this value secure.',
        placeholder: 'A1B2C3D4...',
        type: 'string',
        required: true,
        sensitive: true,
        group: 'Salesforce'
    }
});
