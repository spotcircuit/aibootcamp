import React from 'react';

export default function TestEditing() {
  return (
    <div className="p-10 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Testing Page Editing</h1>
      <p className="mb-5">This page was created to verify that file changes are working correctly.</p>
      <p className="text-red-500 font-bold">If you can see this text in red, the editing system is working!</p>
      <p className="mt-5">Created at: {new Date().toLocaleString()}</p>
    </div>
  );
}