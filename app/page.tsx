"use client";

import { FiUploadCloud } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useState, FormEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import sendImage from '@/lib/actions/openai';
import Spinner from '@/components/Spinner';
import imageCompression from 'browser-image-compression';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [memeImage, setMemeImage] = useState('');
  const [memeText, setMemeText] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      setIsLoading(true);
      const options = {
        maxSizeMB: 1, // the maximum size of the output file in megabytes
        maxWidthOrHeight: 1024, // the maximum width or height of the output image, maintains aspect ratio
        useWebWorker: true // enable multi-threading for better performance
      };

      // Compress the image file
      const compressedFile = await imageCompression(selectedFile, options);

      // Create an object URL for the compressed image
      const fileUrl = URL.createObjectURL(compressedFile);

      // Convert the compressed file to a base64 string
      const base64String = await imageCompression.getDataUrlFromFile(compressedFile);

      // Split the base64 string and prepare it for the API
      const base64 = base64String.split(',')[1];

      // Send the reduced image to the API
      const memeText = await sendImage(base64);
      console.log(memeText);
      setMemeImage(fileUrl);
      setMemeText(memeText);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <h1 className="text-5xl font-bold text-gray-800 mb-8">
            Meme Generator
          </h1>
          {!memeImage && (
            <form className="w-full max-w-md bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
              <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-lg text-gray-700">
                    Upload your image
                  </div>
                  <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                    <FiUploadCloud className="w-8 h-8" />
                    <span className="mt-2 text-base leading-normal">
                      {selectedFile ? 'Image Selected' : 'Select a file'}
                    </span>
                    <input type='file' className="hidden" onChange={handleFileChange} />
                  </label>
                  <Button className={`mt-6 ${!selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`} disabled={!selectedFile}>
                    {selectedFile ? 'Ready to Generate' : 'Choose an Image'}
                  </Button>
                </div>
              </div>
            </form>
          )}
          {memeImage && (
            <>
              <div className="meme-container" style={{ position: 'relative', textAlign: 'center' }}>
                <Image src={memeImage} alt="Uploaded Meme" className="max-w-md rounded-lg shadow-md" width={500} height={500} />
                <div className="meme-text" style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  padding: '10px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}>
                  {memeText}
                </div>
              </div>
              <Button className="mt-6" onClick={() => {
                setMemeImage('');
                setMemeText('');
              }
              }>
                Generate Another
              </Button>
            </>
          )}
        </>
      )}
    </main >
  )
}