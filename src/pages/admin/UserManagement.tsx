import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export const UserManagement = () => {
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery(
    ['users', search], // Trigger the query based on the search term
    async () => {
      const { data } = await api.get('/admin/users', { params: { search } });
      return data;
    }
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Update the search term
        placeholder="Search users..."
        className="mb-4 p-2 border rounded"
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
