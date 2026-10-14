import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { register } from "@/modules/auth";
import { CredentialsForm } from "@/modules/auth/components/credentials-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Tus fichas quedan guardadas y accesibles desde cualquier sitio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CredentialsForm action={register} submitLabel="Crear cuenta" />
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-foreground underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
