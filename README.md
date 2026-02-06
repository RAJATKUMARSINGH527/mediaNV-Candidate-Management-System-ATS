# 🚀 Talent Pool - mediaNV Candidate Management System ATS

Talent Pool is a high-performance, full-stack recruitment management tool designed to replace cluttered spreadsheets. It offers a centralized, secure, and visually stunning platform to manage candidate information throughout the recruitment lifecycle.

---

## ✨ Features

- **Premium Glassmorphism UI:** Built with a dark-themed, translucent interface using Tailwind CSS.
- **Fluid Animations:** Smooth transitions and modal popups powered by Framer Motion.
- ****Full CRUD Capabilities:** Seamlessly create, read, update, and delete candidate records.
- **Advanced Search & Filtering:** Real-time filtering by name, position, or skills.
- **Robust Backend Validation:** Data integrity is ensured using Zod schemas and PostgreSQL constraints.
- **Mobile First & Responsive:** Optimized for every device, from mobile screens to large monitors.
- **Database Security:** Protection against SQL injection using parameterized queries with the node-postgres library.

---

## 🛠️ Tech Stack

**Frontend:**

- **React.js (Vite):** For a fast, component-based user interface.
- **Tailwind CSS:** Modern utility-first styling.
- **Lucide React:** Clean and consistent iconography.
- **Framer Motion:** Production-ready animations.

**Backend:**

- Node.js & Express.js: Scalable server-side logic.
- PostgreSQL: Reliable relational database storage.
- node-postgres (pg): Direct interface for executing SQL queries.
- Zod: TypeScript-first schema declaration and validation.
---

### 1. Clone the Repository
```bash
git clone https://github.com/RAJATKUMARSINGH527/mediaNV-Database_Management_Interface.git
cd mediaNV-Database_Management_Interface
```

## ⚙️ Setup & Installation

### 2. Database Configuration

Ensure `PostgreSQL` is running on your system. Open your SQL shell or `pgAdmin 4` and execute:

```sql
CREATE DATABASE recruitment_db;

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    skills TEXT,
    experience INT,
    applied_position VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Applied',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Backend Setup

Create a `.env` file in the `BackEnd` folder:

```env
PORT=7000
DATABASE_URL=postgres://your_user:your_password@localhost:7777/recruitment_db

```
Then run:

```bash
cd BackEnd
npm install
npm run server
```

### 4. Frontend Setup

```bash
cd ../frontEnd
npm install
npm run dev
```
### 5. Access the Application

Open your browser and navigate to `http://localhost:5173` to access the Talent Pool ATS.

## 📋 API Endpoints
Method          Endpoint                  Description
`POST`         `/api/candidates`       Create a new candidate record
`GET`          `/api/candidates`       Retrieve all candidates
`GET`          `/api/candidates/:id`   Retrieve a candidate by ID
`PUT`          `/api/candidates/:id`   Update a candidate's information
`DELETE`       `/api/candidates/:id`   Delete a candidate record

## 📝 Usage

- **Add Candidate:** Fill out the form with candidate details and click `"Add Candidate"`.
- **View Candidates:** Browse the list of candidates with their details displayed in a card format.
- **Edit Candidate:** Click the edit icon on a candidate card to update their information.
- **Delete Candidate:** Click the delete icon on a candidate card to remove them from the system.
- **Search & Filter:** Use the search bar to filter candidates by name, position, or skills in real-time.


## 🛡️ Security Measures

- **Parameterized Queries:** All database interactions use parameterized queries to prevent SQL injection.
- **Input Validation:** Zod schemas validate incoming data to ensure it meets required formats and constraints.
- **CORS Configuration:** The backend is configured to allow requests only from trusted origins.
- **Environment Variables:** Sensitive information like database credentials is stored securely in environment variables.


## 📝 Troubleshooting (Local Setup)

- **Database Connection Issues:** Ensure PostgreSQL is running and the `DATABASE_URL` in your `.env` file is correct.
- **Port Conflicts:** If ports 7000 (backend) or 5173 (frontend) are in use, update the `PORT` variable in the `.env` file and the frontend `vite.config.js` accordingly.
- **Dependency Errors:** Run `npm install` in both `BackEnd` and `frontEnd` directories to ensure all dependencies are installed.
- **CORS Errors:** Make sure the frontend is making requests to the correct backend URL and that CORS is properly configured in the backend.
## 📂 Project Structure

```
mediaNV-Candidate-Management-System-ATS/
├── BackEnd/
│   ├── db.js
│   ├── server.js
├── package.json
├── frontEnd/
│   ├── src/
│   ├── index.html
├── package.json
```
## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres Documentation](https://node-postgres.com/)
- [Zod Documentation](https://zod.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons Documentation](https://lucide.dev/)

## 🧑‍💻 Contributing

Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request and describe your changes.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contact & Support
**Project Lead**: Rajat Kumar Singh
- Email: [rajatkumarsingh257@gmail.com](mailto:rajatkumarsingh257@gmail.com)  
- GitHub: [RAJATKUMARSINGH527](https://github.com/RAJATKUMARSINGH527)  

## 🙏 Acknowledgements

- Thanks to the open-source community for libraries and tools that made this project possible.
- Inspired by the need to streamline financial workflows and reduce manual data entry errors.

---

© 2026 Community Hub. All rights reserved. Built with ❤️ for the Developer Community.