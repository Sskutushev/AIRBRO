import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Проверяем, что это POST-запрос
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // 2. Получаем данные из тела запроса
    const { name, email, company, service, employees, problem } = req.body;

    // 3. Логируем данные формы для тестирования (не отправляем в Telegram)
    console.log('Form data received for AIRBRO Business:', {
      name,
      email,
      company,
      service,
      employees,
      problem
    });

    // 4. Имитируем успешную отправку (возвращаем 200 OK без фактической отправки в Telegram)
    return res.status(200).json({ message: 'AIRBRO Business message received successfully (placeholder)' });

  } catch (error) {
    // 5. В случае ошибки, логируем ее
    console.error('Internal Server Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}