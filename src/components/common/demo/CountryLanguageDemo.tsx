'use client';

import React, { useState, useEffect } from 'react';
import { getCountryInfo, getLanguageNameFromCode, getLanguageCodeFromCountry } from '@/utils/locale.util';

interface CountryLanguageResult {
  countryCode: string;
  countryName: string;
  languageCode: string;
  languageName: string;
}

const CountryLanguageDemo: React.FC = () => {
  const [results, setResults] = useState<CountryLanguageResult[]>([]);
  const [inputCountryCode, setInputCountryCode] = useState('');
  const [customResult, setCustomResult] = useState<CountryLanguageResult | null>(null);

  // Sample country codes to demonstrate
  const sampleCountryCodes = ['US', 'FR', 'JP', 'CN', 'RU', 'VN', 'TH', 'BR', 'SA', 'IN'];

  useEffect(() => {
    // Generate results for sample countries
    const demoResults = sampleCountryCodes.map(code => {
      const languageCode = getLanguageCodeFromCountry(code);
      return {
        countryCode: code,
        countryName: getCountryInfo(code).name || code,
        languageCode,
        languageName: getLanguageNameFromCode(languageCode)
      };
    });

    setResults(demoResults);
  }, []);

  const handleCustomLookup = () => {
    if (!inputCountryCode) return;

    const code = inputCountryCode.trim().toUpperCase();
    const languageCode = getLanguageCodeFromCountry(code);

    setCustomResult({
      countryCode: code,
      countryName: getCountryInfo(code).name || code,
      languageCode,
      languageName: getLanguageNameFromCode(languageCode)
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Country to Language Code Conversion Demo</h1>

      <div className="mb-8">
        <p className="mb-4">This demo shows how to convert ISO 3166-1 country codes to ISO 639-1 language codes using our utility functions.</p>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={inputCountryCode}
            onChange={(e) => setInputCountryCode(e.target.value)}
            placeholder="Enter country code (e.g., US, FR, JP)"
            className="border p-2 rounded"
          />
          <button
            onClick={handleCustomLookup}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Convert
          </button>
        </div>

        {customResult && (
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Custom Lookup Result:</h3>
            <p><span className="font-semibold">Country Code:</span> {customResult.countryCode}</p>
            <p><span className="font-semibold">Country Name:</span> {customResult.countryName}</p>
            <p><span className="font-semibold">Language Code:</span> {customResult.languageCode}</p>
            <p><span className="font-semibold">Language Name:</span> {customResult.languageName}</p>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Sample Conversions</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Country Code</th>
              <th className="p-3 border">Country Name</th>
              <th className="p-3 border">Language Code</th>
              <th className="p-3 border">Language Name</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="p-3 border">{result.countryCode}</td>
                <td className="p-3 border">{result.countryName}</td>
                <td className="p-3 border">{result.languageCode}</td>
                <td className="p-3 border">{result.languageName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Implementation Notes:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>The conversion uses multiple strategies: browser APIs, i18n-iso-countries library, and a fallback map</li>
          <li>For browser compatibility, we've implemented fallbacks for older browsers</li>
          <li>The utility handles server-side rendering (SSR) gracefully by checking for browser environment</li>
          <li>Default language is English if a country code can't be mapped</li>
        </ul>
      </div>
    </div>
  );
};

export default CountryLanguageDemo;
