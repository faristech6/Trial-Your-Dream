
import { useEffect, useState } from 'react';
import {
  CarFront,
  ImageOff,
  ExternalLink
} from 'lucide-react';

import { assetSrc } from '../lib/api';

interface ImageAttribution {
  title?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
}

interface VehicleImageProps {
  src?: string | null;
  name: string;
  attribution?: ImageAttribution | null;
  className?: string;
  imageClassName?: string;
  showCredits?: boolean;
}

function validWebUrl(value?: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    ) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

function getVehicleImage(
  value?: string | null
): string | null {
  const image = value?.trim();

  if (!image) return null;

  if (
    image.startsWith('data:image/')
  ) {
    return image;
  }

  if (/^https?:\/\//i.test(image)) {
    return validWebUrl(image);
  }

  if (image.startsWith('/')) {
    return assetSrc(image);
  }

  return null;
}

export default function VehicleImage({
  src,
  name,
  attribution,
  className = '',
  imageClassName = '',
  showCredits = true
}: VehicleImageProps) {
  const [failed, setFailed] = useState(false);

  const imageUrl = getVehicleImage(src);
  const hasImage = Boolean(imageUrl) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const sourceUrl = validWebUrl(
    attribution?.sourceUrl
  );

  const licenseUrl = validWebUrl(
    attribution?.licenseUrl
  );

  const hasCredits =
    Boolean(attribution?.credit) ||
    Boolean(attribution?.license);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="relative flex h-full min-h-[180px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#0b2d47]">
        {hasImage ? (
          <img
            src={imageUrl || undefined}
            alt={name}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`h-full w-full object-contain ${imageClassName}`}
          />
        ) : (
          <div className="flex min-h-[180px] w-full flex-col items-center justify-center gap-3 p-8 text-center">
            {failed ? (
              <ImageOff className="h-12 w-12 text-[#67d7df]" />
            ) : (
              <CarFront className="h-12 w-12 text-[#67d7df]" />
            )}

            <p className="text-sm font-semibold text-white">
              {name}
            </p>

            <p className="text-xs text-[#a9c3d0]">
              Vehicle image unavailable
            </p>
          </div>
        )}
      </div>

      {showCredits && hasImage && hasCredits && (
        <div className="mt-3 rounded-lg border border-[#285673]/70 bg-[#103a58] px-4 py-3">
          <p className="text-xs font-semibold text-[#a9c3d0]">
            Image Credits
          </p>

          {attribution?.credit && (
            <p className="mt-1 text-xs text-[#d6e4ea]">
              Photo: {attribution.credit}
            </p>
          )}

          {attribution?.license && (
            <p className="mt-1 text-xs text-[#d6e4ea]">
              License: {attribution.license}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-4">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#67d7df] hover:text-white"
              >
                Image Source
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {licenseUrl && (
              <a
                href={licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#67d7df] hover:text-white"
              >
                View License
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
