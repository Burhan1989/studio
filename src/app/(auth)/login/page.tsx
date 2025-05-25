
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';

export default function LoginPage() {
  return (
    <>
    <Header />
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-background to-primary/10">
      <LoginForm />
    </div>
    </>
  );
}
