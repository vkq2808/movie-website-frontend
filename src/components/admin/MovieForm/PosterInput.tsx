import Image from "next/image";
import React from "react";
import { ImageUploadList } from "../../extensibles/ImageUploadList";

type PostersInputProps = {
  posters: {
    url: string;
    alt: string;
  }[];
  addFunction: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
  deleteFunction: (url: string, field: string) => Promise<void>;
}

const PostersInput = ({ posters, addFunction, deleteFunction }: PostersInputProps) => {

  return (
    <ImageUploadList
      label="Posters (URLs)"
      field="posters"
      images={posters}
      addFunction={addFunction}
      deleteFunction={deleteFunction}
      imgWidth={67.5}
      imgHeight={90}
      limit={10}
    />
  )
}

export default PostersInput;