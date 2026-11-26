import { useEffect, useRef, useState } from "react";
import { resolveImageUrl } from "~/lib/storage";

export default function InputImage({
  previewLogo,
  previewImages,
  onAvatarChange,
  onImagesChange,
}) {
  const [currLogo, setCurrtLogo] = useState(null);
  const [currImages, setCurrtImages] = useState(null);
  const objectUrls = useRef([]);

  useEffect(() => {
    setCurrtLogo(resolveImageUrl(previewLogo));
    setCurrtImages((previewImages ?? []).map(resolveImageUrl));
  }, [previewLogo, previewImages]);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const createObjectUrl = (file) => {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    return url;
  };

  const logoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCurrtLogo(createObjectUrl(e.target.files[0]));
      onAvatarChange(e.target.files[0]);
      e.target.value = "";
    }
  };

  const slidesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setCurrtImages(files.map(createObjectUrl));
      onImagesChange(files);
      e.target.value = "";
    }
  };

  return (
    <div className="mt-6 lg:ml-6">
      <div>
        <label className="label">
          <span className="label-text">Logo (opsional)</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full"
          accept="image/*"
          onChange={logoChange}
        />
        {currLogo && (
          <div className="mt-4 h-24 w-24 rounded-full">
            <img src={currLogo} className="h-full object-cover" alt="" />
          </div>
        )}
      </div>

      <div className="pb-6">
        <label className="label">
          <span className="label-text">Gambar</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full"
          accept="image/*"
          onChange={slidesChange}
          multiple
        />
        {currImages && (
          <div className="flex flex-wrap gap-4">
            {currImages.map((obj, idx) => (
              <div className="relative mt-4 h-24 w-24" key={idx}>
                <img src={obj} className="h-full rounded object-cover" alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
