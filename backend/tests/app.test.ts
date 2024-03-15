import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import nock from 'nock';
import mongoose from 'mongoose';

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI!!);
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('GET /', () => {
    it('should return status code 200 and "Hello, World!"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
    });
});

describe('POST live /v1/chat/completions', () => {
    it('should return status code 200 and a completion message', async () => {
        const payload = { content: 'Hello, there!' };
        const response = await request(app).post('/completions').send(payload);
        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body.messages[2]).toBeDefined();
    });
});

describe('POST mocked /v1/chat/completions', () => {
    it('should return status code 200 and exact message', async () => {


        // test a new thread
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
        const response = await request(app).post('/completions').send(payload);
        expect(response.status).toBe(200);
        expect(response.body.messages[1].content).toBe('Hello, there!');
        expect(response.body.messages[2].content).toBe('Hi! How can I assist you today?');

        // send another message to the same thread
        const mockResponse2 = {
            choices: [
                {
                    message: { role: 'assistant', content: 'What do you need help with?' },
                }
            ]
        }
        nock('https://api.openai.com/v1')
            .post('/chat/completions')
            .reply(200, mockResponse2); 
        const payload2 = { content: 'I need help with something.' };
        const response2 = await request(app).post('/completions/' + response.body._id).send(payload2);
        expect(response2.status).toBe(200);
        expect(response2.body.messages[3].content).toBe('I need help with something.');
        expect(response2.body.messages[4].content).toBe('What do you need help with?');
    });
});
