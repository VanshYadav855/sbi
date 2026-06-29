export default function DemoDataTag({ className = 'mt-2' }) {
  return (
    <span
      className={`inline-block text-[10px] px-2 py-0.5 rounded bg-amber/10 text-amber border border-amber/20 ${className}`}
    >
      Demo Data · GFF 2026
    </span>
  );
}
