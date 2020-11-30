# Pull official Image
FROM node:alpine
# Set Working Directory
WORKDIR '/my-app'
# Install Dependencies
COPY ./package.json ./
RUN npm install
# Copy App
COPY . .
# Start App
CMD ["npm", "run", "start"]