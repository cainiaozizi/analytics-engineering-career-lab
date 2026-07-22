import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';

import Home from '@/pages/home';
import Projects from '@/pages/projects';
import ProjectDetail from '@/pages/project-detail';
import Blog from '@/pages/blog';
import PostDetail from '@/pages/post-detail';
import Notes from '@/pages/notes';
import NoteDetail from '@/pages/note-detail';
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
        <Route path="/guides" component={Blog} />
        <Route path="/guides/:id" component={PostDetail} />
        <Route path="/interview-prep" component={Notes} />
        <Route path="/interview-prep/:id" component={NoteDetail} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
