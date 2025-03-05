import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">JobSwipe</h1>
        <p className="text-xl text-muted-foreground mb-8">Find your perfect job match</p>
        
        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">Login</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
          
          <div className="pt-4">
            <h2 className="text-lg font-medium mb-2">For Employers</h2>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/employer/login">Post a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
