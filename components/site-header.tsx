import { DicesIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/modules/auth/queries";
import { logout } from "@/modules/auth";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-semibold tracking-wide"
        >
          <DicesIcon className="size-5 text-primary" />
          Fichas D&amp;D
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" render={<Link href="/ramdom" />}
            nativeButton={false}>
            Generador
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/character" />}
                nativeButton={false}>
                Mis personajes
              </Button>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOutIcon /> Salir
                </Button>
              </form>
            </>
          ) : (
            <Button size="sm" render={<Link href="/login" />} nativeButton={false}>
              Entrar
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
