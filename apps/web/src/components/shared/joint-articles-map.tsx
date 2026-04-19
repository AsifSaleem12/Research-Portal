'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { JointArticleMapPoint } from '../../types/portal';

type JointArticlesMapProps = {
  points: JointArticleMapPoint[];
};

const COUNTRY_HIGHLIGHTS: Record<string, string> = {
  germany: 'M442 107l18-10 18 4 9 12-5 18-16 8-18-7-8-13z',
  china: 'M645 151l28-8 26 8 8 18-14 17-34 4-19-10-2-18z',
  malaysia: 'M670 252l13-2 8 8-4 11-11 4-8-8z',
};

const WORLD_PATHS = [
  'M52 126l16-19 19-9 28-6 24-18 30-6 14 8-3 16-18 11-12 16 14 8 18-6 17 3 16 19 12 5 10 12-4 14-24 10-16 14 9 12-5 16-19 8-16 15-26 2-20-12-20-1-18 10-10-16 5-14-14-14-6-27z',
  'M113 203l22-8 18 5 17 17 10 20 15 9-4 18-12 13 8 21-6 22-15 11-23-8-13-18-7-25-14-21-6-22z',
  'M385 111l10-17 19-7 18 5 9 11 10-5 16 5 4 11-6 11-18 4-9 12-14 2-10-9-14-1-9-10 1-12z',
  'M410 150l17-11 24 2 12 11-8 19 6 17-7 15 9 21-16 19-19 9-23-7-14-25 5-16-5-20 9-16z',
  'M462 108l18-13 34-9 46 7 33-9 33 8 25-5 33 10 23 18 25 3 12 16-5 18 17 11 5 17-17 9-31-1-19 11-11 16-23 1-17-13-19 8-20-9-28 4-26-8-18 10-17-11-22 1-14-13 4-20-8-18 10-17-12-14z',
  'M640 251l17-4 12 9 17-4 15 7 15 16-4 18-16 13-18 4-14-11-3-15-12-10z',
  'M702 122l9-14 15-4 12 10 4 14-10 10-14-2-12-14z',
  'M731 297l18-7 20 5 13 14 5 17-11 18-18 6-18-7-13-16 4-17z',
  'M279 66l13-18 24-11 28-2 17 10-2 21-10 15-25 1-22-7-15-9z',
  'M338 96l6-10 13-2 9 8-2 12-12 6-12-4z',
];

function slugifyCountry(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

function getMarkerRadius(index: number, isActive: boolean) {
  const sizes = [6, 7, 8, 9];
  return sizes[index % sizes.length];
}

export function JointArticlesMap({ points }: JointArticlesMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId ?? selectedId;

  const selected = useMemo(
    () => points.find((point) => point.id === activeId) ?? null,
    [activeId, points],
  );

  if (!points.length) {
    return null;
  }

  const activeCountryKey = selected?.country.toLowerCase() ?? '';

  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-white p-2 sm:p-4">
      <div className="relative rounded-[20px] bg-white">
        <svg viewBox="0 0 860 390" className="h-auto w-full">
          <rect x="0" y="0" width="860" height="390" fill="#ffffff" />

          <g fill="#b0b0b0">
            {WORLD_PATHS.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>

          {Object.entries(COUNTRY_HIGHLIGHTS).map(([countryKey, path]) => (
            <path
              key={countryKey}
              d={path}
              fill={countryKey === activeCountryKey ? '#8d8d8d' : 'transparent'}
            />
          ))}

          {points.map((point, index) => {
            const isActive = point.id === activeId;
            const radius = getMarkerRadius(index, isActive);

            return (
              <g key={point.id}>
                {isActive ? (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={radius + 5}
                    fill="#d61f26"
                    fillOpacity="0.18"
                  />
                ) : null}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={radius}
                  fill="#d61f26"
                  stroke="#ffffff"
                  strokeWidth="1.6"
                  className="cursor-pointer"
                  onClick={() => setSelectedId(point.id)}
                  onMouseEnter={() => setHoveredId(point.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              </g>
            );
          })}
        </svg>

        {selected ? (
          <div className="pointer-events-none absolute left-3 top-3 w-[260px] max-w-[calc(100%-1.5rem)] sm:left-5 sm:top-5">
            <div className="pointer-events-auto rounded-[16px] border border-slate-200 bg-white/98 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                    {selected.country}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                    {selected.articleTitle}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                  {selected.year}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                {selected.summary}
              </p>

              <div className="mt-2 text-[11px] text-slate-500">{selected.partnerInstitution}</div>

              <Link
                href={selected.href}
                className="mt-3 inline-flex rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-600"
              >
                Open Article
              </Link>
            </div>
          </div>
        ) : null}

        {!selected ? (
          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/96 px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm sm:left-5 sm:top-5">
            Select a marker to view the linked article
          </div>
        ) : null}
      </div>
    </div>
  );
}
