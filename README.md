# Banking System API

Welcome to the Banking System API! This API provides a set of endpoints to interact with a banking system, allowing you to perform various operations related to accounts, transactions, and user management.

## API Base URL

[https://banking-system-api-mt6q.onrender.com/api/v1/banking](https://banking-system-api-mt6q.onrender.com/api/v1/banking)

## API Endpoints

| Method | Endpoint                   | Request Type | Description                                   |
| ------ | -------------------------- | ------------ | --------------------------------------------- |
| GET    | /users                     | Read         | Retrieve details of all users.                |
| GET    | /users/:id                 | Read         | Retrieve details of a specific user by ID.    |
| POST   | /users                     | Create       | Create a new user.                            |
| PATCH  | /users/:id/credit          | Update       | Update user credit.                           |
| PATCH  | /users/:id/deposit         | Update       | Deposit money in user's account.              |
| PATCH  | /users/:from/transact/:to  | Update       | Transfer money between two users.             |
| DELETE | /users/:id                 | Delete       | Delete a user                  |
| PATCH  | /users/:id/active          | Update       | Update user account status (active/inactive). |
| GET    | /users/filter/cash/:amount | Read         | Filter users by the amount of cash.           |

## How to Use

1. **Retrieve All Users:**

   - Endpoint: `/users`
   - Method: GET
   - Description: Get details of all users.

2. **Retrieve a Specific User:**

   - Endpoint: `/users/:id`
   - Method: GET
   - Description: Get details of a specific user by ID.

3. **Create a New User:**

   - Endpoint: `/users`
   - Method: POST
   - Description: Create a new user.

4. **Update User Credit:**

   - Endpoint: `/users/:id/credit`
   - Method: PATCH
   - Description: Update user credit.

5. **Deposit Money:**

   - Endpoint: `/users/:id/deposit`
   - Method: PATCH
   - Description: Deposit money in user's account.

6. **Transfer Money:**

   - Endpoint: `/users/:from/transact/:to`
   - Method: PATCH
   - Description: Transfer money between two users.

7. **Delete User:**

   - Endpoint: `/users/:id`
   - Method: DELETE
   - Description: Delete a user.

8. **Update User Account Status:**
   - Endpoint: `/users/:id/active`
   - Method: PATCH
   - Description: Update user account status (active/inactive).

9. **Filter Users by Amount of Cash:**
    - Endpoint: `/users/filter/cash/:amount`
    - Method: GET
    - Description: Filter users by the specified amount of cash.# 
