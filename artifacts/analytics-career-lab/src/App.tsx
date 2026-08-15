import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';
import { AuthProvider } from '@/context/auth';
import { Analytics } from '@/analytics';

import Home from '@/pages/home';
import Projects from '@/pages/projects';
import ProjectDetail from '@/pages/project-detail';
import Writings from '@/pages/writings';
import WritingDetail from '@/pages/writing-detail';
import Career from '@/pages/career';
import CareerDetail from '@/pages/career-detail';
import About from '@/pages/about';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/writings" component={Writings} />
        <Route path="/writings/:id" component={WritingDetail} />
        <Route path="/career" component={Career} />
        <Route path="/career/:id" component={CareerDetail} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Analytics />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
