// ImageUploadModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Modals/Modal';
import { UploadButton } from '@/utilis';
import { PreImageProps } from '@/app/(editor)/write/[operation]/page';
import { toast } from 'react-toastify';
import { DebouncedState } from 'use-debounce';

interface ImageUploadModalProps {
  preImage: PreImageProps;
  setPreImage: React.Dispatch<React.SetStateAction<PreImageProps>>;
  button: React.ReactNode;
  heroImageRef: React.RefObject<HTMLInputElement>;
  altRef: React.RefObject<HTMLInputElement>;
  debounced?: DebouncedState<(val: {
    key: string;
    value: string;
}) => void>
  open?: boolean;
  onClose?:()=>void;
  additionalWork?: (param1: string, param2: string) => void;

}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ preImage, setPreImage,open,onClose, button, heroImageRef,altRef,debounced,additionalWork }) => {
  const [dialogRef, setDialogRef] = useState<React.RefObject<HTMLDialogElement> | null>(null);
  const [method, setMethod] = useState("uploadthing");

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMethod(e.target.value);
  };



  return (
    <Modal open={open} onClose={onClose} setDialog={setDialogRef } btnClass='w-full' className='!px-20 ' button={button}>
      <input
        onChange={(e) => {
          setPreImage({ src: preImage.src, alt: e.target.value });
          if(debounced){
            debounced({key:"alt",value:e.target.value});
          }
        }}
        value={preImage.alt}
        ref={altRef}
        type="text"
        placeholder='image title....'
        className="w-full px-8 py-2 rounded-md font-medium  border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
      />
      <div className='flex justify-center gap-x-4 mx-auto my-6'>
        <label>
          <input
            type="radio"
            name="method"
            value="uploadthing"
            checked={method === 'uploadthing'}
            onChange={onChange}
            className="mx-2"
          />
          uploadthing
        </label>
        <label>
          <input
            type="radio"
            name="method"
            value="url"
            checked={method === 'url'}
            onChange={onChange}
            className="mx-2"
          />
          url
        </label>
      </div>
      {method === "uploadthing" && (
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setPreImage({ src: res[0].url, alt: "" });
            if(debounced){
              debounced({key:"heroImage",value:res[0].url});
            }
            if(additionalWork && altRef.current){
              additionalWork?.(res[0].url,altRef.current?.value);
            }
            dialogRef?.current?.close();
          }}
          onUploadError={(error: Error) => {
            dialogRef?.current?.close();
            toast.error(error.message);
          }}
        />
      )}
      {method === "url" && (
        <div>
          <input
            type="url"
            ref={heroImageRef}
            placeholder='cover banner URL...'
            className="w-[70%] px-8 py-2 rounded-md font-medium  border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          />
          <button
            className='py-2 px-4 bg-black text-white rounded-md my-2'
            onClick={() => {
              if (heroImageRef.current?.value) {
                setPreImage({ src: heroImageRef.current.value, alt: "" });
                if(additionalWork && altRef.current){
                  additionalWork?.(heroImageRef.current.value,altRef.current?.value);
                }
              } else {
                toast.error("url not found");
              }
              dialogRef?.current?.close();
            }}
          >
            add cover image...
          </button>
        </div>
      )}
    </Modal>


  );
};

export default ImageUploadModal;
