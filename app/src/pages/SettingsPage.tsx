import React from 'react';
import Layout from '../layouts/Layout';
import CurrencySettings from '../components/CurrencySettings';

function SettingsPage(): JSX.Element {
  return (
    <Layout>
      <CurrencySettings />
    </Layout>
  );
}

export default SettingsPage;
