import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('axios');

const fakeUsers = [{
    "id": 1,
    "name": "Test User 1",
    "username": "testuser1",
}, {
    "id": 2,
    "name": "Test User 2",
    "username": "testuser2",
}];

describe('App component', () => {

    test('it displays a row for each user', async () => {
        axios.get.mockResolvedValue({ data: fakeUsers });
        render(<App />);


        const userList = await waitFor(() => screen.findAllByTestId('user-item'));
        expect(userList).toHaveLength(2);
    });
});