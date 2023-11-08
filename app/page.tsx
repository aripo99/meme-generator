"use client";

import { FiUploadCloud } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useState, FormEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import sendImage from '@/lib/actions/openai';
import Spinner from '@/components/Spinner';

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      setIsLoading(true);
      const fileUrl = URL.createObjectURL(selectedFile);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        let base64String = '';
        if (typeof reader.result === 'string') {
          // Get the base64 string portion of the Data URL
          base64String = reader.result.split(',')[1];
        }

        const memeText = await sendImage(base64String);
        setMemeText(memeText);
        console.log(memeText);
        setMemeImage(fileUrl);
        setIsLoading(false);
      }
    };
  }


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
            <div className="mt-8">
              <Image src={memeImage} alt="Uploaded Meme" className="max-w-md rounded-lg shadow-md" width={500} height={500} />
              {memeText && <p> {memeText} </p>}
            </div>
          )}
        </>
      )}
    </main >
  )
}