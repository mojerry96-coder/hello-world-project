import mivaLogoAsset from "@/assets/miva-logo-white.png.asset.json";

export function BrandMark() {
  return (
    <img
      className="simulation-brand-mark"
      src={mivaLogoAsset.url}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}