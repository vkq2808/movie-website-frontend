import Image from "next/image";
import React from "react";
import { ImageUploadList } from "../../extensibles/ImageUploadList";


type BackdropsInputProps = {
  backdrops: {
    url: string;
    alt: string;
  }[];
  addFunction: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
  deleteFunction: (url: string, field: string) => Promise<void>;
}

const BackdropsInput = ({ backdrops, addFunction, deleteFunction }: BackdropsInputProps) => {
  return (
    <ImageUploadList
      label="Backdrops (URLs)"
      field="backdrops"
      images={backdrops}
      addFunction={addFunction}
      deleteFunction={deleteFunction}
      imgWidth={160}
      imgHeight={90}
      limit={10}
    />

  )
}

export default BackdropsInput;