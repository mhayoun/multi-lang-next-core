import React, { useRef } from 'react';

export const ImageToHtmlUploader = ({
  isHe,
  logic,
  actions,
  sub,
  subMenuEditor_NewSrcHtml,
  lastClicked,
  setLastClicked,
  ActionButton,
  icons: { Upload, Crop }
}) => {
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Core background canvas processing logic moved completely inside
  const createBannerCrop = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 900;
          canvas.height = 323;
          const ctx = canvas.getContext('2d');

          // Center crop logic (Cover)
          const ratio = Math.max(900 / img.width, 323 / img.height);
          const w = img.width * ratio;
          const h = img.height * ratio;
          const x = (900 - w) / 2;
          const y = (323 - h) / 2;

          ctx.drawImage(img, x, y, w, h);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.9);
        };
      };
    });
  };

  const handleStandardChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fallbackTitle = sub.title?.[logic.modalLang] || 'image';
    actions.processFileToHtml(file, subMenuEditor_NewSrcHtml, fallbackTitle);

    // Clear input value so users can upload the same file sequentially if needed
    e.target.value = '';
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Force the active spinner immediately before entering the async crop loop
    setLastClicked('banner');

    const cropped = await createBannerCrop(file);
    actions.processFileToHtml(cropped, subMenuEditor_NewSrcHtml, 'banner');

    e.target.value = '';
  };

  return (
    <>
      {/* All Image to HTML */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleStandardChange}
      />
      <ActionButton
        onClick={() => {
          setLastClicked('image');
          fileInputRef.current?.click();
        }}
        loading={actions.isProcessingFile && lastClicked === 'image'}
        success={actions.statusMsg === 'success' && lastClicked === 'image'}
        icon={Upload}
        label={isHe ? 'תמונה ל-HTML' : 'Image for HTML'}
      />

      {/* Crop Image to HTML (900x323) */}
      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleBannerChange}
      />
      <ActionButton
        onClick={() => {
          setLastClicked('banner');
          bannerInputRef.current?.click();
        }}
        loading={actions.isProcessingFile && lastClicked === 'banner'}
        success={actions.statusMsg === 'success' && lastClicked === 'banner'}
        icon={Crop}
        label={isHe ? 'באנר ל-HTML' : 'Banner (900x323)'}
      />
    </>
  );
};