import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-20">
      <Card className="w-full max-w-md mx-4 shadow-sm border-dashed">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              404 Not Found
            </h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
