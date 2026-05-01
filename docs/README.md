# Developer Documentation

Complete technical documentation for Wedspace development team.

---

## 📚 Quick Navigation

### Getting Started
- **[Installation & Setup](./setup/installation.md)** - Development environment setup
- **[Environment Configuration](./setup/environment.md)** - Environment variables
- **[Troubleshooting](./setup/troubleshooting.md)** - Common issues

### Architecture & Design
- **[Architecture](./architecture.md)** - System design and components
- **[Data Structure](./data-structure.md)** - Database schema
- **[Business System](./business-system.md)** - Business logic

### Development
- **[Development Notes](./development-notes.md)** - Implementation status
- **[Deployment](./deployment.md)** - Production deployment

### Guides
- **[CORS Configuration](./guides/cors-configuration.md)** - CORS setup
- **[Release Notes](./releases/)** - Version history

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Initialize database
cd server
npm run init

# 3. Start development
npm run server    # Terminal 1
npm run client    # Terminal 2

# 4. Login
# Email: demo@wedspace.id
# Password: demo123
```

See [Installation & Setup](./setup/installation.md) for details.

---

## 📖 Documentation by Topic

### Setup & Installation
- [Installation & Setup](./setup/installation.md)
- [Environment Configuration](./setup/environment.md)
- [Troubleshooting](./setup/troubleshooting.md)

### Architecture
- [Architecture](./architecture.md)
- [Data Structure](./data-structure.md)
- [Business System](./business-system.md)

### Development
- [Development Notes](./development-notes.md)
- [Deployment](./deployment.md)

### Guides
- [CORS Configuration](./guides/cors-configuration.md)

### Release Notes
- [v0.0.3](./releases/v0.0.3.md) - Latest
- [v0.0.2](./releases/v0.0.2.md)
- [v0.0.1a](./releases/v0.0.1a.md)

### Product
- [PRD Alpha](./prd-alpha.md)
- [PRD Beta](./prd-beta.md)

---

## 🔍 Finding What You Need

### "How do I...?"
- **...get started?** → [Installation & Setup](./setup/installation.md)
- **...set up environment?** → [Environment Configuration](./setup/environment.md)
- **...fix an error?** → [Troubleshooting](./setup/troubleshooting.md)
- **...deploy?** → [Deployment](./deployment.md)
- **...understand the system?** → [Architecture](./architecture.md)

### "I need to understand..."
- **...the system architecture** → [Architecture](./architecture.md)
- **...the database schema** → [Data Structure](./data-structure.md)
- **...the business logic** → [Business System](./business-system.md)
- **...implementation status** → [Development Notes](./development-notes.md)

---

## 📋 Project Structure

```
wedspace/
├── server/
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utilities
│   ├── scripts/         # Setup scripts
│   ├── db.js            # Database
│   ├── index.js         # Server entry
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context API
│   │   ├── utils/       # Utilities
│   │   └── main.jsx
│   └── package.json
├── docs/                # This folder
└── package.json
```

---

## 🛠️ Development Commands

### Root Level
```bash
npm run install:all    # Install all dependencies
npm run server         # Start server
npm run client         # Start client
npm run build          # Build for production
```

### Server
```bash
npm run dev            # Start server
npm run init           # Initialize database
npm run setup-db       # Create database
npm run migrate        # Create tables & seed
```

### Client
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run lint           # Run linter
```

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| [Installation & Setup](./setup/installation.md) | Get started with development |
| [Environment Configuration](./setup/environment.md) | Configure environment variables |
| [Troubleshooting](./setup/troubleshooting.md) | Fix common issues |
| [Architecture](./architecture.md) | Understand system design |
| [Data Structure](./data-structure.md) | Database schema reference |
| [Business System](./business-system.md) | Business logic documentation |
| [Development Notes](./development-notes.md) | Implementation status |
| [Deployment](./deployment.md) | Production deployment guide |
| [CORS Configuration](./guides/cors-configuration.md) | CORS setup guide |
| [Release Notes](./releases/) | Version history |

---

## 🔗 Related Links

- **Main README**: [../README.md](../README.md) - For general users
- **Changelog**: [../CHANGELOG.md](../CHANGELOG.md) - Version history
- **GitHub**: [wedspace](https://github.com/your-username/wedspace)

---

## 📝 Version

- **Current**: v0.0.3
- **Latest Release**: [v0.0.3](./releases/v0.0.3.md)
- **Previous**: [v0.0.2](./releases/v0.0.2.md)

---

**Last Updated**: May 1, 2026
