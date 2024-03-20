import axios from 'axios';
import { IMessage } from '../models/Thread';

const apiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

export default async function getCompletion(messages: IMessage[]): Promise<string> {

    const messagesToSubmit = messages.map(msg => ({ role: msg.role, content: msg.content }));

    try {
        const response = await apiClient.post('/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: messagesToSubmit,
            max_tokens: 1000,
        });
        console.log(response.data)
        return response.data.choices[0].message.content.trim();
    } catch (error: any) {
        console.error('Error:', error.response.data);
        throw new Error('Failed to get completion from OpenAI API');
    }
}