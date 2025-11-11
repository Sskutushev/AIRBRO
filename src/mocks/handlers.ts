import { http, HttpResponse } from 'msw';

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  telegram: string;
}

export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginBody;

    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json(
        {
          user: { id: '1', email: 'test@example.com', name: 'Test User', telegram: '@testuser' },
          token: 'mock-jwt-token',
        },
        { status: 200 }
      );
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const { email, password, name, telegram } = (await request.json()) as RegisterBody;

    if (email === 'existing@example.com' || telegram === '@existing') {
      return HttpResponse.json(
        { error: 'User with this email or telegram already exists' },
        { status: 409 }
      );
    }

    if (email && password && name && telegram) {
      return HttpResponse.json(
        {
          user: { id: '2', email, name, telegram },
          token: 'mock-jwt-token',
        },
        { status: 201 }
      );
    }

    return HttpResponse.json({ error: 'Missing registration data' }, { status: 400 });
  }),

  http.get('/api/auth/me', () => {
    // Assuming a successful authentication, return a mock user
    return HttpResponse.json(
      {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        telegram: '@testuser',
      },
      { status: 200 }
    );
  }),

  // Add other handlers as needed for products, cart, payments, etc.
  // Example for products:
  http.get('/api/products', () => {
    return HttpResponse.json(
      [
        { id: 'prod1', name: 'Product 1', price: 1000, description: 'Desc 1' },
        { id: 'prod2', name: 'Product 2', price: 2000, description: 'Desc 2' },
      ],
      { status: 200 }
    );
  }),
];
