import { createBrowserRouter } from 'react-router-dom';

interface RouterOptions {
  future?: {
    v7_startTransition?: boolean;
  };
}

export const routerConfig: RouterOptions = {
  future: {
    v7_startTransition: true
  }
};

export function createRouter(routes: Array<any>) {
  return createBrowserRouter(routes, {
    future: routerConfig.future
  });
}