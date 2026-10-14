import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/modules/auth";
import { CredentialsForm } from "@/modules/auth/components/credentials-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Accede para ver y editar tus personajes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CredentialsForm action={login} submitLabel="Entrar" next={next} />
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-foreground underline">
              Crear una
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
