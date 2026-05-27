export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: {
    url: string;
    alt?: string | undefined;
    title?: string | undefined;
  };
};

export type UploadType = {
  url: string;
  alt?: string | undefined;
  title?: string | undefined;
  copyright?: string | undefined;
  author?: string | undefined;
};
