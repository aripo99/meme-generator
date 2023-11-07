import { FiUploadCloud } from 'react-icons/fi'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">
        Meme Generator
      </h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-lg text-gray-700">
            Upload your image
          </div>
          <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
            <FiUploadCloud className="w-8 h-8" />
            <span className="mt-2 text-base leading-normal">
              Select a file
            </span>
            <input type='file' className="hidden" />
          </label>
        </div>
      </div>
    </main>
  )
}

