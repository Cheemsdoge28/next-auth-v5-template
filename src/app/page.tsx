import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
      <div className="space-y-6 text-center">
        <h1 className="text-center text-6xl font-semibold drop-shadow-md text-primary">📖 Student-registry</h1>
        <p className="text-center text-2xl text-white">A simple student registry application</p>
        <div>
          <LoginButton>
            <Button size={"lg"} variant="secondary" className="text-2xl">Sign in</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
