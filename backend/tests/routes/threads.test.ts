import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../../src/app';
import nock from 'nock';
import mongoose from 'mongoose';
import { IThread } from '../../src/models/Thread';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // create a test user
    const user = {
        email: 'test@test.com',
        password: 'password'
    }

    await request(app).post('/user/signup').send(user);
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('get /thread', () => {
    it('should return both threads', async () => {

        // starts empty
        const response = await request(app).get('/thread');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);

        // create two threads and combine promises
        await Promise.all([sendMessageToThread(), sendMessageToThread()]);

        // get both threads
        const response2 = await request(app).get('/thread');
        expect(response2.status).toBe(200);
        console.log(response2.body);
        expect(response2.body.length).toBe(2);
    });
});

describe('DELETE /thread', () => {
    it('should delete a thread', async () => {

        // create a thread 
        const threadId = await sendMessageToThread();

        const response = await request(app).get(`/thread/${threadId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(threadId);

        const response2 = await request(app).delete(`/thread/${threadId}`);
        expect(response2.status).toBe(200);
        expect(response2.body._id).toBe(threadId);

        const response3 = await request(app).get(`/thread/${threadId}`);
        expect(response3.status).toBe(404);
    });
});

async function sendMessageToThread(threadId: string | null = null): Promise<string> {
    const mockResponse = {
        choices: [
            {
                message: { role: 'assistant', content: 'Hi! How can I assist you today?' },
            }
        ]
    }
    nock('https://api.openai.com/v1')
        .post('/chat/completions')
        .reply(200, mockResponse);

    const payload = { content: 'Hello, there!' };
    const response = await request(app).post('/completions/').send(payload);
    return response.body._id;
}
