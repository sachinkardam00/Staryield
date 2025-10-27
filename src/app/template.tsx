// Disable runtime JS for static pages where possible
export const runtime = 'edge';

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="root-template">
      {children}
    </div>
  );
}