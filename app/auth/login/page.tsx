import LoginForm from '@/components/auth/LoginForm'
import AuthGuard from '@/components/auth/AuthGuard'

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </AuthGuard>
  )
}