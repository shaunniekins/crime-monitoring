import React from 'react';
import FileUpload from './FileUpload';

export default function Upload({user}) {
  return (
    <div>
      <h1 className='p-2 text-2xl'>File Upload</h1>
      <FileUpload user={user}/>
    </div>
  )
}
