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