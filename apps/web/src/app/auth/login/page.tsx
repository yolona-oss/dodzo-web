import { AuthLayout } from "@/components/auth/layout";
import { LoginForm } from "@/components/auth/login-form";

function LoginPage() {
    return (
        <AuthLayout title="Login" subtitle="Login to your account">
            <LoginForm />
        </AuthLayout>
    )
}

export default LoginPage;
