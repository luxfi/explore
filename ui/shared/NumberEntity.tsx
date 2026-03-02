
type Props = {
  value: string;
  suffix?: string;
  postfix?: string;
};

export default function NumberEntity({ value, suffix, postfix }: Props) {
  const [ integer, decimal ] = value.split('.');
  return (
    <span>
      { suffix }
      { Number(integer) ? Number(integer).toLocaleString() : integer }
      { decimal && '.' }
      <span className="text-[var(--color-text-secondary)]">{ decimal }</span>
      { postfix && ` ${ postfix }` }
    </span>
  );
}
