import imageCompression from 'browser-image-compression';

export const useImageCompression = () => {
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error);
      return file; // Retorna o arquivo original em caso de erro
    }
  };

  const compressImages = async (files: File[]) => {
    const compressPromises = files.map(compressImage);
    return Promise.all(compressPromises);
  };

  return { compressImage, compressImages };
};