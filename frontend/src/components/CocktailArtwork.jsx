import React, { useId } from "react";

const DRINK_COLORS = {
  amber: "#d99a43",
  red: "#bd4f4b",
  pink: "#d97891",
  blue: "#388da8",
  green: "#65946e",
  cream: "#d7c3a0",
  clear: "#c5d6d0",
  purple: "#805c91",
  orange: "#d77a3f",
  brown: "#80533e",
};

export const isCocktailArtwork = (image = "") =>
  image.endsWith("/illustration.svg") || /\/\d+\.jpe?g$/i.test(image);

const getGlassShape = (glassware = "") => {
  const glass = glassware.toLowerCase();
  if (glass.includes("mug")) return "mug";
  if (glass.includes("flute")) return "flute";
  if (glass.includes("coupe")) return "coupe";
  if (glass.includes("martini") || glass.includes("cocktail")) return "martini";
  if (glass.includes("highball") || glass.includes("collins")) return "highball";
  return "rocks";
};

const CocktailArtwork = ({ cocktail }) => {
  const gradientId = useId().replace(/:/g, "");
  const color = DRINK_COLORS[cocktail?.artwork_color] || DRINK_COLORS.amber;
  const glass = getGlassShape(cocktail?.glassware_en);
  const garnish = (cocktail?.garnish_en || "").toLowerCase();

  return (
    <div
      className="cocktail-artwork cocktail-card-img"
      role="img"
      aria-label={`${cocktail?.English_Name || "Cocktail"} illustration`}
    >
      <svg viewBox="0 0 320 240" aria-hidden="true">
        <defs>
          <linearGradient id={`glass-${gradientId}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".34" />
            <stop offset=".5" stopColor="#ffffff" stopOpacity=".05" />
            <stop offset="1" stopColor="#ffffff" stopOpacity=".2" />
          </linearGradient>
          <linearGradient id={`drink-${gradientId}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".72" />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="205" rx="74" ry="12" fill="#060815" opacity=".35" />
        {glass === "martini" && (
          <>
            <path d="M92 52h136l-68 83z" fill={`url(#drink-${gradientId})`} opacity=".86" />
            <path d="M92 52h136l-68 83z" fill={`url(#glass-${gradientId})`} stroke="#d9e7e7" strokeWidth="4" />
            <path d="M160 135v53m-32 0h64" fill="none" stroke="#d9e7e7" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {glass === "coupe" && (
          <>
            <path d="M98 68c3 43 23 68 62 68s59-25 62-68z" fill={`url(#drink-${gradientId})`} opacity=".86" />
            <path d="M98 68c3 43 23 68 62 68s59-25 62-68z" fill={`url(#glass-${gradientId})`} stroke="#d9e7e7" strokeWidth="4" />
            <path d="M160 136v52m-32 0h64" fill="none" stroke="#d9e7e7" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {glass === "flute" && (
          <>
            <path d="M126 42h68l-7 105h-54z" fill={`url(#drink-${gradientId})`} opacity=".86" />
            <path d="M126 42h68l-7 105h-54z" fill={`url(#glass-${gradientId})`} stroke="#d9e7e7" strokeWidth="4" />
            <path d="M160 147v41m-28 0h56" fill="none" stroke="#d9e7e7" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {glass === "highball" && (
          <>
            <path d="M112 48h96l-10 140h-76z" fill={`url(#drink-${gradientId})`} opacity=".86" />
            <path d="M112 48h96l-10 140h-76z" fill={`url(#glass-${gradientId})`} stroke="#d9e7e7" strokeWidth="4" strokeLinejoin="round" />
          </>
        )}
        {glass === "rocks" && (
          <>
            <path d="M108 82h104l-8 106h-88z" fill={`url(#drink-${gradientId})`} opacity=".86" />
            <path d="M108 82h104l-8 106h-88z" fill={`url(#glass-${gradientId})`} stroke="#d9e7e7" strokeWidth="4" strokeLinejoin="round" />
          </>
        )}
        {glass === "mug" && (
          <>
            <path d="M112 66h88v122h-88z" fill={`url(#drink-${gradientId})`} opacity=".86" />
            <path d="M112 66h88v122h-88z" fill={`url(#glass-${gradientId})`} stroke="#d9e7e7" strokeWidth="4" strokeLinejoin="round" />
            <path d="M200 92h15c19 0 19 47 0 47h-15" fill="none" stroke="#d9e7e7" strokeWidth="5" />
          </>
        )}
        {(garnish.includes("lime") || garnish.includes("lemon") || garnish.includes("orange")) && (
          <g transform="translate(207 44)">
            <circle r="20" fill="#e4b85e" stroke="#f8e7b6" strokeWidth="4" />
            <path d="M0-16v32M-14-8l28 16M14-8L-14 8" stroke="#f8e7b6" strokeWidth="2" />
          </g>
        )}
        {(garnish.includes("cherry") || garnish.includes("olive")) && (
          <circle cx="204" cy="54" r="10" fill={garnish.includes("olive") ? "#718b4e" : "#b94749"} stroke="#f8e7b6" strokeWidth="3" />
        )}
        {garnish.includes("mint") && (
          <path d="M192 60c-9-24 13-34 25-23-1 16-11 25-25 23zm0 0c-14-15-31-3-26 13 13 5 23 0 26-13z" fill="#79a77c" stroke="#c5e0bb" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
};

export default CocktailArtwork;
