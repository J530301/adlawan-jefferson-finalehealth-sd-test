# Patient Visit Management System

A full-stack web application for managing patients and their visits in a healthcare setting.

## Project Structure

```
Patient_Visit_Management_Adlawan/
├── backend/          # NestJS Backend API
├── frontend/         # Angular Frontend Application
└── README.md         # This file
```

## Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 17+
- **UI Library**: Angular Material
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient

## Features

### Patient Management
- ✅ Create, read, update, delete patients
- ✅ Patient information includes: name, email, phone, date of birth, address
- ✅ Search and filter patients
- ✅ Pagination support

### Visit Management
- ✅ Create, read, update, delete visits
- ✅ Link visits to specific patients
- ✅ Visit types: Home, Telehealth, Clinic
- ✅ Visit notes and scheduling
- ✅ Track creation and update timestamps

### User Interface
- ✅ Modern, responsive design
- ✅ Material Design components
- ✅ Real-time form validation
- ✅ Loading states and error handling
- ✅ Intuitive navigation

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/J530301/adlawan-jefferson-finalehealth-sd-test.git
cd adlawan-jefferson-finalehealth-sd-test
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/patient-visit-management
# PORT=3001

# Start the backend server
npm run start:dev
```

The backend will be available at: `http://localhost:3001`
API Documentation (Swagger): `http://localhost:3001/api`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at: `http://localhost:4200`

## Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/patient-visit-management
PORT=3001
NODE_ENV=development
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001'
};
```

## API Endpoints

### Patients
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient by ID
- `POST /patients` - Create new patient
- `PUT /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Visits
- `GET /patients/:patientId/visits` - Get visits for a patient
- `POST /patients/:patientId/visits` - Create visit for patient
- `GET /visits/:id` - Get visit by ID
- `PUT /visits/:id` - Update visit
- `DELETE /visits/:id` - Delete visit

## Development Commands

### Backend
```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linter
```

### Frontend
```bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run lint        # Run linter
```

## Database Schema

### Patient Model
```typescript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  dob: string,
  address: string,
  emergencyContact?: string,
  medicalHistory?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Visit Model
```typescript
{
  _id: ObjectId,
  patientId: ObjectId,
  visitDate: string,
  visitType: 'Home' | 'Telehealth' | 'Clinic',
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file
   - Verify network connectivity

2. **Frontend Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Update Angular CLI: `npm install -g @angular/cli@latest`

3. **CORS Issues**
   - Backend is configured to allow localhost:4200
   - Check environment.ts for correct API URL

4. **Port Already in Use**
   - Backend: Change PORT in .env file
   - Frontend: Use `ng serve --port 4201`

## License

This project is licensed under the MIT License.

## Author

Jefferson Adlawan
