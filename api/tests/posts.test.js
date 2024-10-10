import request from 'supertest';
import app from '../index.js'; // Adjust the path if needed
import mongoose from 'mongoose';
import Post from '../models/Post.js';

beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Clean up the test database and close the connection
    await Post.deleteMany(); // Clear the posts collection
    await mongoose.connection.close();
});

describe('Posts API', () => {
    let postId;

    // Test for creating a post
    it('should create a new post', async () => {
        const newPost = {
            picUrl: 'http://example.com/image.jpg',
            caption: 'Test Caption',
            user: 'testUser',
            userId: new mongoose.Types.ObjectId(), // Create a new ObjectId
            comments: [],
        };

        const res = await request(app)
            .post('/api/posts/')
            .send(newPost);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        postId = res.body._id; // Save the postId for later tests
        expect(res.body).toMatchObject(newPost); // Check if the created post matches the input
    });

    // Test for getting all posts
    it('should get all posts', async () => {
        const res = await request(app).get('/api/posts/');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array); // Should return an array of posts
    });

    // Test for getting a specific post
    it('should get a specific post', async () => {
        const res = await request(app).get(`/api/posts/${postId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(postId);
    });

    // Test for updating a post
    it('should update a post', async () => {
        const updatedData = {
            caption: 'Updated Caption',
        };

        const res = await request(app)
            .put(`/api/posts/${postId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.caption).toEqual(updatedData.caption);
    });

    // Test for deleting a post
    it('should delete a post', async () => {
        const res = await request(app).delete(`/api/posts/${postId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Post has been deleted.');
    });
});
