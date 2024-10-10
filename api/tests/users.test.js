import request from 'supertest';  
import app from '../index.js';
import User from '../models/User.js'; 

// Mock the User model
jest.mock('../models/User');

// Test suite for the getUser controller
describe('GET /api/users/:username', () => {

    // Test for when a valid user is found
    it('should return user details without the password when user is found', async () => {
        // Mock data for the user
        const mockUser = {
            _id: '60c72b2f4f1a0627b8e35f8e',
            username: 'testuser',
            profilePic: 'https://example.com/profile.jpg',
            bio: 'This is a test user.',
            followers: ['user1', 'user2'],
            following: ['user3'],
            likedPosts: [],
            _doc: {  // Mocking the _doc property as it's what you extract in your controller
                username: 'testuser',
                profilePic: 'https://example.com/profile.jpg',
                bio: 'This is a test user.',
                followers: ['user1', 'user2'],
                following: ['user3'],
                likedPosts: []
            }
        };

        // Mock User.findOne to return the mock user
        User.findOne.mockResolvedValue(mockUser);

        // Perform the GET request to the API
        const res = await request(app).get('/api/users/testuser');

        // Expectations
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            username: 'testuser',
            profilePic: 'https://example.com/profile.jpg',
            bio: 'This is a test user.',
            followers: ['user1', 'user2'],
            following: ['user3'],
            likedPosts: []
        });
        // Ensure password is not included in the response
        expect(res.body.password).toBeUndefined();
    });

    // Test for when the user is not found
    it('should return a 404 when the user is not found', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        // Perform the GET request to the API
        const res = await request(app).get('/api/users/nonexistentuser');

        // Expectations
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual('User not found.');
    });

    // Test for when there is a server error
    it('should return 500 on server error', async () => {
        // Mock User.findOne to throw an error
        User.findOne.mockRejectedValue(new Error('Database error'));

        // Perform the GET request to the API
        const res = await request(app).get('/api/users/testuser');

        // Expectations
        expect(res.statusCode).toBe(500);
    });
});
