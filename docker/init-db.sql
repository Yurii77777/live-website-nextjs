-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Grant privileges if needed
GRANT ALL PRIVILEGES ON DATABASE live_website TO postgres;
