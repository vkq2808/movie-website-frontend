export const metadata = {
  title: 'Admin - MovieStream',
};

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  // We keep using the root header/footer; AdminLayout handles inner nav
  return children;
}
