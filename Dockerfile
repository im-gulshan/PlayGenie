FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Default command — override in CI to run specific products/tags
CMD ["npm", "run", "test:saucedemo"]
