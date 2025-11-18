'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestDB() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      setLoading(true);
      
      // Test 1: Simple select
      console.log('Test 1: Simple select');
      const { data: data1, error: error1 } = await supabase
        .from('technical_content')
        .select('*')
        .limit(5);
      
      console.log('Test 1 Result:', { data: data1, error: error1 });
      
      // Test 2: Count
      console.log('Test 2: Count');
      const { count, error: error2 } = await supabase
        .from('technical_content')
        .select('*', { count: 'exact', head: true });
      
      console.log('Test 2 Result:', { count, error: error2 });
      
      // Test 3: Get columns
      console.log('Test 3: Get first row to see structure');
      const { data: data3, error: error3 } = await supabase
        .from('technical_content')
        .select('*')
        .limit(1);
      
      console.log('Test 3 Result:', { data: data3, error: error3 });
      
      setResult({
        test1: { data: data1, error: error1, count: data1?.length },
        test2: { count, error: error2 },
        test3: { data: data3, error: error3, columns: data3 && data3.length > 0 ? Object.keys(data3[0]) : [] },
      });
      
      setLoading(false);
    }
    test();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Test - Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className="space-y-4">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Test 1: Simple Select (5 rows)</h2>
          {result.test1.error ? (
            <div className="text-red-600">
              <p>Error: {result.test1.error.message}</p>
              <p>Code: {result.test1.error.code}</p>
              <p>Details: {result.test1.error.details}</p>
            </div>
          ) : (
            <div>
              <p>Success! Found {result.test1.count} rows</p>
              {result.test1.data && result.test1.data.length > 0 && (
                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-48">
                  {JSON.stringify(result.test1.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Test 2: Count</h2>
          {result.test2.error ? (
            <div className="text-red-600">
              <p>Error: {result.test2.error.message}</p>
            </div>
          ) : (
            <p>Total rows in table: {result.test2.count}</p>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Test 3: Column Structure</h2>
          {result.test3.error ? (
            <div className="text-red-600">
              <p>Error: {result.test3.error.message}</p>
            </div>
          ) : (
            <div>
              <p>Columns found: {result.test3.columns.length}</p>
              <ul className="list-disc list-inside mt-2">
                {result.test3.columns.map((col: string) => (
                  <li key={col} className="text-sm">{col}</li>
                ))}
              </ul>
              {result.test3.data && result.test3.data.length > 0 && (
                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-48">
                  {JSON.stringify(result.test3.data[0], null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Full Result</h2>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

