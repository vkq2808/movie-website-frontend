import Image from "next/image";
import React from "react";

export type ImageItem = {
  url: string;
  alt: string;
};

export type ImageUploadListProps = {
  label?: string;
  images: ImageItem[];
  addFunction: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => Promise<void>;
  deleteFunction: (
    url: string,
    field: string
  ) => Promise<void>;
  field: string; // optional để hỗ trợ reuse ở nhiều nơi
  imgWidth?: number; // px
  imgHeight?: number; // px
  limit?: number; // tối đa số ảnh cho phép upload
};


export const ImageUploadList: React.FC<ImageUploadListProps> = ({
  label,
  images,
  addFunction,
  deleteFunction,
  field,
  imgWidth = 160,
  imgHeight = 90,
  limit,
}) => {
  const canAddMore = limit === undefined || images.length < limit;

  return (
    <div>
      {label && <label className="block text-gray-400 mb-2">{label}</label>}

      <div className="flex flex-wrap gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative inline-block">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
                width={imgWidth}
                height={imgHeight}
                className="object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
              />
            </div>

            {/* Nút xóa ảnh */}
            <button
              type="button"
              onClick={() => deleteFunction(img.url, field)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
              title="Xóa ảnh"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Ô thêm ảnh mới */}
        {canAddMore && (
          <label className="cursor-pointer h-24 w-18 rounded border border-dashed border-gray-700 bg-gray-800 flex flex-col items-center justify-center text-gray-500 text-sm hover:bg-gray-700 transition">
            <span className="text-lg">＋</span>
            <span>Thêm ảnh</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => addFunction(e, field)}
            />
          </label>
        )}
      </div>

      {limit !== undefined && (
        <p className="text-gray-500 text-xs mt-1">
          {images.length}/{limit} ảnh
        </p>
      )}
    </div>
  );
};
