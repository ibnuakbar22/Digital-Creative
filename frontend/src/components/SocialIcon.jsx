// Ikon sosial dimuat dari public/assets/icons/social/<id>.svg — ganti file untuk memakai ikon asli Anda.
export default function SocialIcon({ id, label, url, size = 'md', children }) {
  const cls = `soc soc--${size}`;
  const icon = <img src={`/assets/icons/social/${id}.svg`} alt="" aria-hidden="true" />;
  return url ? (
    <a className={cls} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>{icon}{children}</a>
  ) : (
    <span className={`${cls} is-off`} aria-label={`${label} (link belum diisi)`} role="img">{icon}{children}</span>
  );
}
