const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../database/models/user_model');
const Cost = require('../database/models/cost_model');

jest.mock('../database/models/user_model');
jest.mock('../database/models/cost_model');

describe('API Routes', () => {
    jest.setTimeout(20000);

    beforeAll(async () => {
        User.findOne.mockResolvedValue(null); // לוודא שהמשתמש לא קיים בתחילת הריצה
        await request(app)
            .post('/api/users/123')
            .send({
                id: 123,
                first_name: 'Orel',
                last_name: 'Fleish',
                birthday: '1995-01-01',
                marital_status: 'Single',
            });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('GET /api/about should return 200', async () => {
        const res = await request(app).get('/api/about');
        expect(res.statusCode).toBe(200);
    });

    test('POST /api/users/:id should return 201 or 400 if already exists', async () => {
        const res = await request(app)
            .post('/api/users/123')
            .send({
                id: 123,
                first_name: 'Orel',
                last_name: 'Fleish',
                birthday: '1995-01-01',
                marital_status: 'Single',
            });

        expect([201, 400]).toContain(res.statusCode);
    });

    describe('POST /api/add', () => {
        it('should return 201 and add new costs', async () => {
            const expenses = [
                { userid: 123, description: 'Groceries', category: 'food', sum: 250, date: '2025-05-05' },
                { userid: 123, description: 'Dinner at restaurant', category: 'food', sum: 120, date: '2025-05-12' },
                { userid: 123, description: 'Pharmacy', category: 'health', sum: 90, date: '2025-05-08' },
                { userid: 123, description: 'Doctor appointment', category: 'health', sum: 300, date: '2025-05-14' },
                { userid: 123, description: 'Gym membership', category: 'sport', sum: 150, date: '2025-05-02' },
                { userid: 123, description: 'Yoga class', category: 'sport', sum: 100, date: '2025-05-18' },
            ];

            User.findOne.mockResolvedValue({ id: 123 }); // משתמש קיים
            Cost.prototype.save = jest.fn().mockImplementation(function () {
                // מחזיר את המסמך שנשמר ללא _id כי כנראה אין כזה בשרת שלך
                return Promise.resolve(this);
            });

            for (const expense of expenses) {
                const res = await request(app).post('/api/add').send(expense);
                expect(res.statusCode).toBe(201);
                // בשרת שלך יש רק message ולא data._id
                expect(res.body).toHaveProperty('message', 'New cost entry added');
            }
        });

        it('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const expense = {
                userid: 999,
                description: 'test',
                sum: 100,
                category: 'sport',
                date: '2025-01-01',
            };

            const res = await request(app).post('/api/add').send(expense);
            expect(res.statusCode).toBe(404);
            // תעדכן כאן ל־message במקום Error
            expect(res.body).toEqual({ message: 'User not found' });
        });

        it('should return 500 on save error', async () => {
            User.findOne.mockResolvedValue({ id: 123 });
            Cost.prototype.save = jest.fn().mockRejectedValue(new Error('Save error'));

            const expense = {
                userid: 123,
                description: 'test',
                sum: 20,
                category: 'sport',
                date: '2025-01-01',
            };

            const res = await request(app).post('/api/add').send(expense);
            expect(res.statusCode).toBe(500);
            // גם פה תשנה את המפתח ל־message ותבדוק את ההודעה האמיתית שאתה שולח מהשרת
            expect(res.body).toEqual({
                message: 'Save error',
            });
        });
    });

    describe('GET /api/report', () => {
        it('should return 200 and costs grouped by category', async () => {
            const mockUser = { id: 123 };

            User.findOne.mockResolvedValue(mockUser);
            Cost.find.mockResolvedValue([
                { description: 'ice cream', sum: 25, category: 'food', day: 5 },
                { description: 'Rent', sum: 500, category: 'housing', day: 1 },
            ]);

            const res = await request(app).get('/api/report').query({ id: 123, year: '2025', month: '1' });
            expect(res.statusCode).toBe(200);

            expect(res.body).toHaveProperty('userid', 123);
            expect(res.body).toHaveProperty('year', 2025);
            expect(res.body).toHaveProperty('month', 1);
            expect(res.body).toHaveProperty('costs');
            expect(Array.isArray(res.body.costs)).toBe(true);
        });

        it('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app).get('/api/report').query({ id: 123, year: '2025', month: '5' });
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'User not found' });
        });

        it('should return 500 on DB error', async () => {
            User.findOne.mockResolvedValue({ id: 123 });
            Cost.find.mockRejectedValue(new Error('DB error'));

            const res = await request(app).get('/api/report').query({ id: 123, year: '2025', month: '5' });
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'DB error' });
        });

    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
