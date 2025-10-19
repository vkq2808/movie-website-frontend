import Image from "next/image";
import React from "react";


type BackdropsFormProps = {
  backdrops: {
    url: string;
    alt: string;
  }[];
  addFunction: (e: React.ChangeEvent<HTMLInputElement>, type: 'backdrops' | 'posters') => Promise<void>;
  deleteFunction: (url: string, type: 'backdrops' | 'posters') => Promise<void>;
}

export const BackdropsForm = ({ backdrops, addFunction, deleteFunction }: BackdropsFormProps) => {
  return (
    <div>
      <label className="block text-gray-400">Backdrops (URLs)</label>
      <div className="flex flex-wrap gap-4">
        {backdrops.map((b, i) => (
          <div className="relative inline-block" key={i}>
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={b.url}
                alt={b.alt}
                className=" object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                width={160}
                height={90}
              />
            </div>
            {/* Nút xóa */}
            <button
              type="button"
              onClick={() => deleteFunction(b.url, 'backdrops')}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
              title="Xóa ảnh"
            >
              ✕
            </button>
          </div>
        ))}
        {
          <input
            type="file"
            accept="image/*"
            key={'new-backdrop'}
            className="cursor-pointer h-24 w-18 rounded border border-dashed border-gray-700 bg-gray-800 flex items-center justify-center text-gray-500 text-sm"
            onChange={(e) => addFunction(e, 'backdrops')}
          />
        }
      </div>
    </div>
  )
}

type PostersFormProps = {
  posters: {
    url: string;
    alt: string;
  }[];
  addFunction: (e: React.ChangeEvent<HTMLInputElement>, type: 'backdrops' | 'posters') => Promise<void>;
  deleteFunction: (url: string, type: 'backdrops' | 'posters') => Promise<void>;
}

export const PostersForm = ({ posters, addFunction, deleteFunction }: PostersFormProps) => {



  return (
    <div>
      <label className="block text-gray-400">Posters (URLs)</label>
      <div className="flex flex-wrap gap-4">
        {posters.map((p, i) => (
          <div className="relative inline-block" key={i}>
            <div className=" bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={p.url}
                alt={p.alt}
                className="object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                height={90}
                width={67.5}
              />
            </div>

            {/* Nút xóa */}
            <button
              type="button"
              onClick={() => deleteFunction(p.url, 'posters')}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
              title="Xóa ảnh"
            >
              ✕
            </button>
          </div>
        ))}
        {
          <input
            type="file"
            accept="image/*"
            key={'new-poster'}
            className="cursor-pointer h-24 w-18 rounded border border-dashed border-gray-700 bg-gray-800 flex items-center justify-center text-gray-500 text-sm"
            onChange={(e) => addFunction(e, 'posters')}
          />
        }
      </div>
    </div>
  )
}
